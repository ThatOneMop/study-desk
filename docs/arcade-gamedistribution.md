# Arcade: switching on the GameDistribution games

The Arcade has two kinds of third-party games:

- **23 GameMonetize games** are **on** (`gmEnabled: true` in `arcade-config.js`). They are ad-supported, made and owned by their developers, and are listed and embedded on the site. Their pages, descriptions and embed addresses stay in `arcade/gamemonetize.js` and `arcade/<id>/`. Setting `gmEnabled` to anything other than exactly `true` hides them again. That does not turn GameDistribution on.
- **45 GameDistribution (GD) games** are fully wired up but **switched off**. GD only licenses its games to publishers with an approved account (see their Publisher Game License Agreement: https://static.gamedistribution.com/terms/publisher.html). While switched off, they are not listed anywhere on the site and their pages create no iframe. They only show a "not switched on yet" card.

The prepared data is in `arcade/gamedistribution.js`, and there is one page per game in `arcade/gd-<slug>/index.html`. `tests/arcade.cjs` checks that they stay hidden while the switch is off.

## Before you flip the switch (needs a parent)

GD accounts, Google AdSense and Google Ad Manager are for adults (Google requires 18+). A parent or guardian has to own all of them, and the payments go to them.

1. **GD publisher account.** Sign up on the Publisher track at https://gamedistribution.com/publishers/ (the "Sign up" button). GD then emails four onboarding steps: https://gamedistribution.com/publishers/faq/first-steps/what-to-do-once-you%27ve-created-your-account/
2. **Google Ad Manager.** GD's terms (§2.6) require an active Google Ad Manager account. Ad Manager needs an AdSense account first: https://support.google.com/admanager/answer/7084151. During onboarding you accept GD's invitation to manage ads "within the game frame only".
3. **ads.txt.** GD's lines (from https://reporting.headerlift.com/ads-txt-management) must be at the **root** of the domain, e.g. `https://example.com/ads.txt`. See https://gamedistribution.com/publishers/faq/getting-started/adding-ads.txt
   - **github.io limitation:** this site is at `thatonemop.github.io/study-desk/`. An `ads.txt` in this repo would be at `/study-desk/ads.txt`, which is not the root, so it doesn't count.
   - Option A (recommended): use a **custom domain** for the Pages site (Settings → Pages → Custom domain). Put `ads.txt` at the top of this repo so it is served at `https://<your-domain>/ads.txt`.
   - Option B: create the user-site repo `ThatOneMop/ThatOneMop.github.io` and put `ads.txt` at its top, so it is served at `https://thatonemop.github.io/ads.txt`.
4. **Domain approval.** Share the domain with GD. GD whitelists it in Google Ad Manager, and Google has to approve it. Sites can be rejected for thin or copied content: https://gamedistribution.com/publishers/faq/getting-started/why-was-my-domain-rejected/
5. **Payments.** Enter payment details in HeaderLift (GD's reporting tool). The thresholds are €100 by bank transfer or €50 by PayPal. Invoices are paid at the end of the month after they are made.

## Flipping the switch

Do this only after GD says the domain is approved.

1. Edit `arcade-config.js`:
   ```js
   window.ARCADE_CONFIG = {
     gdEnabled: true,
     gdPublisherId: 'PASTE-YOUR-GD-PUBLISHER-ID-HERE'
   };
   ```
   Both values are needed: the games stay hidden if `gdEnabled` is not `true` or the ID is empty.
2. Embed URLs are already built the way GD asks (https://gamedistribution.com/publishers/faq/getting-started/adding-games-to-your-site/):
   `https://html5.gamedistribution.com/<gameId>/?gd_sdk_referrer_url=<this page's URL>`.
   If GD's onboarding email gives you an extra site tag or SDK snippet, add it to `arcade/gd-*/index.html` through the generator template, not by hand. Keep it inside the game pages only.
3. Update `tests/arcade.cjs`. It asserts the default is off, so change that assertion when the switch is turned on for real. Then run the suite and deploy.
4. Check that the Arcade still says the games show ads, and that each game's credit line is visible.

Turning it off again just means setting `gdEnabled: false`.
