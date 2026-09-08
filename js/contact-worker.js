/*
 * UofT STAR contact form public configuration.
 *
 * These values are PUBLIC:
 * - endpoint is the public Cloudflare Worker URL.
 * - turnstileSiteKey is the public Turnstile site key.
 *
 * NEVER put the Discord webhook URL or Turnstile secret key here.
 */

window.UTSTAR_CONTACT_CONFIG = {
    endpoint: "https://utstar-contact.kaibague.workers.dev/contact",
    turnstileSiteKey: "0x4AAAAAAEoytoccf7egkyBz"
};
