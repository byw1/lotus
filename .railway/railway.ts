import { defineRailway, github, preserve, project, service } from "railway/iac";

/**
 * The festival site, as Railway infrastructure.
 *
 * One service, no database, no volume, no queue — the site keeps nothing. This
 * file exists so that "how it is deployed" is reviewable in a pull request
 * rather than remembered by whoever clicked through the dashboard, which for a
 * volunteer-run civic site is the difference between a redeploy taking ten
 * minutes and taking an afternoon.
 *
 *   npm install                  # the `railway` package is a devDependency
 *   railway login && railway link
 *   railway config plan          # read-only: shows exactly what would change
 *   railway config apply         # plans again, then asks before doing it
 *
 * Railway IaC is "omit means delete": a variable that exists on Railway but is
 * not named below is planned for removal. That is why every variable the app
 * reads appears here, including the secrets — as `preserve()`, which means
 * "keep whatever is set on Railway" and keeps real values out of the
 * repository. Set those four on Railway before the first apply.
 *
 * Deploying somewhere else? Delete this directory and drop the `railway`
 * devDependency. Nothing in `src/` imports any of it.
 */
export default defineRailway(() => {
  const web = service("web", {
    source: github("byw1/lotus", { branch: "main" }),

    // Railpack detects Next.js on its own; these are written out so the plan
    // shows them and a change to package.json cannot silently change the
    // deploy.
    build: "npm run build",
    start: "npm run start",

    /*
     * `/` rather than a dedicated endpoint. The healthcheck runs at deploy
     * time, so it may as well prove the thing people actually load renders —
     * and `/` is public whether the preview gate is up or down, so this does
     * not need an exception carved into `src/proxy.ts`.
     */
    healthcheck: "/",
    healthcheckTimeout: 120,

    env: {
      /*
       * NODE_ENV is deliberately absent, and should stay absent.
       *
       * Set here it would also be set during the build, where `npm ci` reads
       * it and omits devDependencies — which is where TypeScript, Tailwind and
       * the PostCSS plugin live, so `next build` would fail. It is not needed
       * anyway: `next start` sets NODE_ENV=production itself when it is unset,
       * which is what makes the session cookie `Secure` and the preview gate
       * fail closed. See `next/dist/bin/next`.
       *
       * PORT is absent for the same reason in reverse: Railway injects it and
       * `next start` reads it. Setting either is how this breaks.
       */

      /*
       * Railway resolves `${{...}}` itself, at build and at run time, so the
       * site knows its own origin before a domain has been chosen. Point this
       * at the custom domain once there is one — canonical URLs, the sitemap,
       * the OG card and the links inside outgoing email all come from it, and
       * `NEXT_PUBLIC_` values are baked in at build time, so changing it needs
       * a redeploy rather than a restart.
       */
      NEXT_PUBLIC_SITE_URL: "https://${{RAILWAY_PUBLIC_DOMAIN}}",

      /*
       * The one Railway-specific line in the whole repository.
       *
       * Railway's edge documents `X-Real-IP` as the client's address and says
       * nothing about `x-forwarded-for`, so an `x-forwarded-for` reaching the
       * app came from the caller. Without this the rate limiter would key on
       * a header anyone can set, and one script could take an unlimited number
       * of budgets. See `clientKey` in `src/lib/rate-limit.ts`.
       */
      CLIENT_IP_HEADER: "x-real-ip",

      /*
       * The gate. Anything other than the exact string "false" leaves it up,
       * so a fresh deploy fails closed. Changing this to "false" here and
       * applying is the launch — deliberately a commit and a review rather
       * than a dashboard toggle, because it is the one irreversible step in
       * `docs/DEPLOYMENT.md`.
       */
      PREVIEW_MODE: "true",

      // Set on Railway, never in the repository. `preserve()` keeps whatever
      // is there; it does not invent a value.
      PREVIEW_PASSWORD: preserve(),
      PREVIEW_SESSION_SECRET: preserve(),
      RESEND_API_KEY: preserve(),
      EMAIL_FROM: preserve(),
      EMAIL_TO: preserve(),
    },
  });

  return project("lotus-festival", { resources: [web] });
});
