# Contact form Worker

This Cloudflare Worker sits behind the contact form on `contact.html`. The flow is:

1. The browser sends a POST to `https://utstar-contact.kaibague.workers.dev/contact`. The address is set in `js/contact-worker.js`.
2. The Worker checks the request's origin, then checks the fields.
3. It verifies the Cloudflare Turnstile token, including that the action is `contact` and the hostname is one of ours.
4. It forwards the message as an embed to a private Discord webhook.

Nothing is stored. There is no KV, D1 or R2.

## Secrets

The Worker needs two secrets: `DISCORD_WEBHOOK_URL` and `TURNSTILE_SECRET`. They are set in Cloudflare and **never** committed:

- **Dashboard:** go to Workers & Pages → `utstar-contact` → Settings → Variables and Secrets. Cloudflare shows the names but never the values. To change one, overwrite it.
- **CLI** (from this folder):
  ```bash
  npx wrangler secret list
  ```
  ```bash
  npx wrangler secret put TURNSTILE_SECRET
  ```

The Turnstile *site key* in `js/contact-worker.js` is public, so it's safe in the repo. The Turnstile *secret* is in Cloudflare under Turnstile → the widget → Settings.

## Allowed hosts

`ALLOWED_HOSTNAMES` in `src/index.js` lists the hosts allowed to send messages. If the site moves to a new domain, add the domain there. If you don't, the form returns 403.

## Deploying

The best setup is automatic: push to `main` and the Worker redeploys. See "Auto-deploy" below.

To deploy manually, run this from this folder:

```bash
npx wrangler deploy
```

## Auto-deploy (Workers Builds)

This is a one-time setup in the Cloudflare dashboard:

1. Go to Workers & Pages → `utstar-contact` → Settings → Build → **Connect** a Git repository.
2. Pick the `UofT-STAR/Website` repo, branch `main`.
3. Set **Root directory** to `/worker`. The build command can stay empty. The deploy command is `npx wrangler deploy`.
4. Under build watch paths, include only `worker/*`. That way, changes to the website alone don't redeploy the Worker.

Deploys keep the existing secrets.
