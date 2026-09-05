/*
 * UofT STAR contact form
 * Browser -> Cloudflare Worker -> private Discord webhook.
 *
 * Styling belongs in css/style.css.
 */

(() => {
    let turnstileWidgetId = null;

    function getConfig() {
        return window.UTSTAR_CONTACT_CONFIG || {};
    }

    function setStatus(type, message) {
        const status = document.getElementById("contactFormStatus");
        if (!status) return;

        status.className = `contact-form-status is-${type}`;
        status.innerHTML = message;
        status.hidden = false;
    }

    function clearStatus() {
        const status = document.getElementById("contactFormStatus");
        if (!status) return;

        status.hidden = true;
        status.textContent = "";
        status.className = "contact-form-status";
    }

    function setSending(isSending) {
        const button = document.getElementById("contactSubmitButton");
        if (!button) return;

        const label = button.querySelector(".contact-submit-label");
        button.disabled = isSending;
        button.classList.toggle("is-sending", isSending);

        if (label) {
            label.textContent = isSending ? "Sending…" : "Send Transmission";
        }
    }

    function selectedPrograms(form) {
        const otherProgram = form.elements.other_program
            ? form.elements.other_program.value.trim()
            : "";

        return Array.from(form.querySelectorAll('input[name="program"]:checked'))
            .map(input => {
                if (input.value === "Other" && otherProgram) {
                    return `Other — ${otherProgram}`;
                }

                return input.value;
            });
    }

    function syncOtherProgramField(form) {
        const otherCheckbox = form.querySelector(
            'input[name="program"][value="Other"]'
        );
        const container = document.getElementById("contactOtherProgram");
        const input = form.elements.other_program;

        if (!otherCheckbox || !container || !input) return;

        const shouldShow = otherCheckbox.checked;

        container.hidden = !shouldShow;
        input.required = shouldShow;

        if (!shouldShow) {
            input.value = "";
        }
    }

    function validateForm(form) {
        const name = form.elements.from_name;
        const email = form.elements.reply_to;
        const topic = form.querySelector('input[name="topic"]:checked');
        const message = form.elements.message;

        if (!name.value.trim()) {
            name.focus();
            return "Please enter your name.";
        }

        if (!email.value.trim() || !email.validity.valid) {
            email.focus();
            return "Please enter a valid reply email.";
        }

        if (!topic) {
            const firstTopic = form.querySelector('input[name="topic"]');
            if (firstTopic) firstTopic.focus();
            return "Please choose where your message should be routed.";
        }

        const otherCheckbox = form.querySelector(
            'input[name="program"][value="Other"]'
        );
        const otherProgram = form.elements.other_program;

        if (
            otherCheckbox &&
            otherCheckbox.checked &&
            otherProgram &&
            !otherProgram.value.trim()
        ) {
            otherProgram.focus();
            return "Please tell us what other program or organization you are in.";
        }

        if (message.value.trim().length < 10) {
            message.focus();
            return "Please write a little more detail in your message.";
        }

        return "";
    }

    function resetTurnstile() {
        if (
            window.turnstile &&
            turnstileWidgetId !== null &&
            typeof window.turnstile.reset === "function"
        ) {
            window.turnstile.reset(turnstileWidgetId);
        }
    }

    function renderTurnstile(siteKey) {
        const region = document.getElementById("contactTurnstileRegion");
        const widget = document.getElementById("contactTurnstileWidget");

        if (!region || !widget || !siteKey || siteKey.startsWith("YOUR_")) {
            return;
        }

        region.hidden = false;

        const render = () => {
            if (
                !window.turnstile ||
                typeof window.turnstile.render !== "function" ||
                turnstileWidgetId !== null
            ) {
                return;
            }

            turnstileWidgetId = window.turnstile.render(widget, {
                sitekey: siteKey,
                theme: "dark",
                action: "contact"
            });
        };

        if (window.turnstile && typeof window.turnstile.render === "function") {
            render();
            return;
        }

        window.utstarRenderTurnstile = render;

        if (!document.querySelector("script[data-utstar-turnstile]")) {
            const turnstileScript = document.createElement("script");
            turnstileScript.src =
                "https://challenges.cloudflare.com/turnstile/v0/api.js" +
                "?onload=utstarRenderTurnstile&render=explicit";
            turnstileScript.async = true;
            turnstileScript.defer = true;
            turnstileScript.dataset.utstarTurnstile = "true";
            document.head.appendChild(turnstileScript);
        }
    }

    function getTurnstileToken(config) {
        if (!config.turnstileSiteKey || config.turnstileSiteKey.startsWith("YOUR_")) {
            return "";
        }

        if (
            !window.turnstile ||
            turnstileWidgetId === null ||
            typeof window.turnstile.getResponse !== "function"
        ) {
            return null;
        }

        return window.turnstile.getResponse(turnstileWidgetId);
    }

    async function submitContactForm(form, config) {
        const topic = form.querySelector('input[name="topic"]:checked');
        const turnstileToken = getTurnstileToken(config);

        if (turnstileToken === null) {
            setStatus(
                "error",
                '<i class="fas fa-shield-halved" aria-hidden="true"></i>' +
                "<span>Human verification is still loading. Please try again in a moment.</span>"
            );
            return;
        }

        if (
            config.turnstileSiteKey &&
            !config.turnstileSiteKey.startsWith("YOUR_") &&
            !turnstileToken
        ) {
            setStatus(
                "error",
                '<i class="fas fa-shield-halved" aria-hidden="true"></i>' +
                "<span>Please complete the human verification before sending.</span>"
            );
            return;
        }

        const payload = {
            name: form.elements.from_name.value.trim(),
            email: form.elements.reply_to.value.trim(),
            affiliation: form.elements.other_program
                ? form.elements.other_program.value.trim()
                : "",
            topic: topic ? topic.value : "General",
            programs: selectedPrograms(form),
            message: form.elements.message.value.trim(),
            website: form.elements.website ? form.elements.website.value.trim() : "",
            turnstileToken,
            pageUrl: window.location.href
        };

        setSending(true);

        try {
            const response = await fetch(config.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            let result = {};
            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (!response.ok) {
                const error = new Error(result.error || "Contact request failed.");
                error.status = response.status;
                throw error;
            }

            form.reset();
            syncOtherProgramField(form);

            const counter = document.getElementById("contactCharacterCount");
            if (counter) counter.textContent = "0";

            resetTurnstile();

            setStatus(
                "success",
                '<i class="fas fa-circle-check" aria-hidden="true"></i>' +
                "<span><strong>Transmission sent.</strong> Your message was delivered to UofT STAR.</span>"
            );
        } catch (error) {
            console.error("STAR contact submission failed:", error);

            let message =
                "We could not send your message right now. Please try again, " +
                "or use the club email above.";

            if (error.status === 403) {
                message =
                    "Human verification could not be confirmed. Please retry the verification and send again.";
            } else if (error.status === 429) {
                message =
                    "Too many messages were submitted recently. Please wait a moment and try again.";
            } else if (error.status === 413) {
                message =
                    "That message is too large to send through the contact form.";
            }

            setStatus(
                "error",
                '<i class="fas fa-circle-exclamation" aria-hidden="true"></i>' +
                `<span>${message}</span>`
            );

            resetTurnstile();
        } finally {
            setSending(false);
        }
    }

    function init() {
        const form = document.getElementById("contactForm");
        if (!form) return;

        const config = getConfig();
        const message = document.getElementById("message");
        const counter = document.getElementById("contactCharacterCount");

        if (message && counter) {
            const updateCounter = () => {
                counter.textContent = String(message.value.length);
            };

            message.addEventListener("input", updateCounter);
            updateCounter();
        }

        const otherCheckbox = form.querySelector(
            'input[name="program"][value="Other"]'
        );

        if (otherCheckbox) {
            otherCheckbox.addEventListener("change", () => {
                syncOtherProgramField(form);

                if (otherCheckbox.checked && form.elements.other_program) {
                    form.elements.other_program.focus();
                }
            });

            syncOtherProgramField(form);
        }

        renderTurnstile(config.turnstileSiteKey);

        form.addEventListener("submit", async event => {
            event.preventDefault();
            clearStatus();

            // Honeypot: silently discard obvious bot submissions.
            if (form.elements.website && form.elements.website.value.trim()) {
                form.reset();
                syncOtherProgramField(form);
                if (counter) counter.textContent = "0";
                setStatus(
                    "success",
                    '<i class="fas fa-circle-check" aria-hidden="true"></i>' +
                    "<span>Transmission received.</span>"
                );
                return;
            }

            const validationError = validateForm(form);
            if (validationError) {
                setStatus(
                    "error",
                    '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i>' +
                    `<span>${validationError}</span>`
                );
                return;
            }

            if (
                !config.endpoint ||
                config.endpoint.includes("YOUR-WORKER") ||
                !/^https:\/\//i.test(config.endpoint)
            ) {
                setStatus(
                    "error",
                    '<i class="fas fa-screwdriver-wrench" aria-hidden="true"></i>' +
                    "<span>The contact endpoint has not been configured yet. Please use the club email above for now.</span>"
                );
                return;
            }

            await submitContactForm(form, config);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
