/*
 * UofT STAR contact Worker
 *
 * Browser -> Turnstile verification -> private Discord webhook.
 *
 * Required Worker secrets (set in Cloudflare, never in this repo):
 *   DISCORD_WEBHOOK_URL
 *   TURNSTILE_SECRET
 *
 * No KV, D1, R2, Durable Object, or other submission database is used.
 */

const ALLOWED_HOSTNAMES = new Set([
    "utstar.ca",
    "www.utstar.ca",
    "utstarwebsite.pages.dev"
]);

function isAllowedHostname(hostname) {
    if (typeof hostname !== "string") return false;

    return (
        ALLOWED_HOSTNAMES.has(hostname) ||
        // Cloudflare Pages preview deployments, e.g. abc123.utstarwebsite.pages.dev
        hostname.endsWith(".utstarwebsite.pages.dev")
    );
}

function isAllowedOrigin(origin) {
    try {
        const url = new URL(origin);
        return url.protocol === "https:" && isAllowedHostname(url.hostname);
    } catch {
        return false;
    }
}

const MAX_BODY_BYTES = 16_000;

function corsHeaders(origin) {
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
    };
}

function jsonResponse(origin, body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            ...corsHeaders(origin)
        }
    });
}

function cleanText(value, maxLength) {
    if (typeof value !== "string") return "";

    return value
        .replace(/\u0000/g, "")
        .replace(/\r\n?/g, "\n")
        .trim()
        .slice(0, maxLength);
}

function cleanSingleLine(value, maxLength) {
    return cleanText(value, maxLength)
        .replace(/\s*\n+\s*/g, " ")
        .replace(/\s{2,}/g, " ");
}

function isReasonableEmail(value) {
    return (
        value.length <= 180 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    );
}

function safePrograms(value) {
    if (!Array.isArray(value)) return [];

    return value
        .filter(item => typeof item === "string")
        .map(item => cleanSingleLine(item, 60))
        .filter(Boolean)
        .slice(0, 8);
}

async function verifyTurnstile(token, request, env) {
    if (!token || typeof token !== "string") {
        return { ok: false, reason: "missing-token" };
    }

    const formData = new FormData();
    formData.append("secret", env.TURNSTILE_SECRET);
    formData.append("response", token);

    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) {
        formData.append("remoteip", ip);
    }

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        return { ok: false, reason: "siteverify-unavailable" };
    }

    const result = await response.json();

    if (!result.success) {
        return { ok: false, reason: "challenge-failed" };
    }

    if (result.action !== "contact") {
        return { ok: false, reason: "wrong-action" };
    }

    if (!isAllowedHostname(result.hostname)) {
        return { ok: false, reason: "wrong-hostname" };
    }

    return { ok: true };
}

function buildDiscordPayload(data, request) {
    const programs = data.programs.length
        ? data.programs.join(", ")
        : "Not specified";

    return {
        username: "UofT STAR Website",
        allowed_mentions: {
            parse: []
        },
        embeds: [
            {
                title: "New website contact",
                description: data.message,
                color: 6894079,
                fields: [
                    {
                        name: "Name",
                        value: data.name,
                        inline: true
                    },
                    {
                        name: "Reply email",
                        value: data.email,
                        inline: true
                    },
                    {
                        name: "Route",
                        value: data.topic,
                        inline: true
                    },
                    {
                        name: "Background",
                        value: programs,
                        inline: false
                    }
                ],
                footer: {
                    text: `UTSTAR contact form • ${request.cf?.colo || "Cloudflare"}`
                },
                timestamp: new Date().toISOString()
            }
        ]
    };
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin") || "";

        if (!isAllowedOrigin(origin)) {
            return new Response("Forbidden", { status: 403 });
        }

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(origin)
            });
        }

        if (request.method !== "POST" || url.pathname !== "/contact") {
            return jsonResponse(origin, { error: "Not found." }, 404);
        }

        if (!env.DISCORD_WEBHOOK_URL || !env.TURNSTILE_SECRET) {
            return jsonResponse(
                origin,
                { error: "Worker secrets are not configured." },
                500
            );
        }

        const contentType = request.headers.get("Content-Type") || "";
        if (!contentType.toLowerCase().startsWith("application/json")) {
            return jsonResponse(
                origin,
                { error: "Content-Type must be application/json." },
                415
            );
        }

        const declaredLength = Number(request.headers.get("Content-Length") || "0");
        if (declaredLength > MAX_BODY_BYTES) {
            return jsonResponse(origin, { error: "Request is too large." }, 413);
        }

        let rawBody;
        try {
            rawBody = await request.text();
        } catch {
            return jsonResponse(origin, { error: "Could not read request." }, 400);
        }

        if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
            return jsonResponse(origin, { error: "Request is too large." }, 413);
        }

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return jsonResponse(origin, { error: "Invalid JSON." }, 400);
        }

        // Honeypot: return success without forwarding.
        if (cleanSingleLine(body.website, 200)) {
            return jsonResponse(origin, { ok: true });
        }

        const data = {
            name: cleanSingleLine(body.name, 100),
            email: cleanSingleLine(body.email, 180),
            topic: cleanSingleLine(body.topic, 100),
            programs: safePrograms(body.programs),
            message: cleanText(body.message, 2500),
            turnstileToken:
                typeof body.turnstileToken === "string"
                    ? body.turnstileToken
                    : ""
        };

        if (
            !data.name ||
            !isReasonableEmail(data.email) ||
            !data.topic ||
            data.message.length < 10
        ) {
            return jsonResponse(origin, { error: "Invalid form fields." }, 400);
        }

        const turnstile = await verifyTurnstile(
            data.turnstileToken,
            request,
            env
        );

        if (!turnstile.ok) {
            console.warn("Turnstile rejected:", turnstile.reason);
            return jsonResponse(
                origin,
                { error: "Human verification failed." },
                403
            );
        }

        const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buildDiscordPayload(data, request))
        });

        if (!discordResponse.ok) {
            console.error(
                "Discord webhook failed:",
                discordResponse.status,
                await discordResponse.text()
            );

            return jsonResponse(
                origin,
                { error: "Message delivery failed." },
                502
            );
        }

        return jsonResponse(origin, { ok: true });
    }
};
