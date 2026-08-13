# Berkan Kömür - portfolio

Static site. No build step, no dependencies to install. Open `index.html` and it runs.

```
index.html    all markup and copy
styles.css    tokens, layout, light + dark themes
main.js       theme toggle, scroll reveal, marquee, copy-to-clipboard, CV check
assets/       screenshots (already in place) and your CV
```

Name, email (`berkankomur1@gmail.com`) and LinkedIn are filled in throughout. Nothing is left as a placeholder.

---

## Images already in place

Screenshots of your own live sites, captured at 1568x726:

| File | Where it appears |
|---|---|
| `stillfiring-home.jpg` | Hero, right column |
| `stillfiring-pricing.jpg` | StillFiring case study, full width |
| `provepixel-report.jpg` | ProvePixel case study, right column |

Replacing any of them is just a matter of dropping a new file with the same name. Roughly 16:9 works best. If a file goes missing the page shows a labelled slot rather than a broken image.

## The CV button

The hero has a **Download CV** button that stays hidden until `assets/cv.pdf` exists. Drop the PDF in and it appears on its own, so the page never offers a download that 404s.

## Two things worth a second look

**The tech stack row** (`#stack`) lists Shopify, Google Tag Manager, Google Analytics, Google Ads, Meta, Claude, Cursor, JavaScript, Cloudflare, Git. Claude and Cursor are in there on purpose, because that is how you build. If you would rather not lead with that in a job application, delete those two `<img>` lines. Adding a tool means copying a line and swapping the slug from https://simpleicons.org:

```html
<img src="https://cdn.simpleicons.org/SLUG/8a8a8a" alt="Name" width="34" height="34" loading="lazy">
```

**The "How I build" card** in `#approach` says you build with AI coding tools rather than by hand. It is framed as a strength, since two products reaching paying customers is the evidence. Reword or remove it if you would rather not raise it first.

## Guide links

The six cards in `#writing` all point at `https://stillfiring.com/guides`. Swap in the direct URL for each guide once you have the slugs.

---

## Getting berkankomur.is-a.dev

`berkankomur`, `komurberkan` and even plain `berkan` were all still free in the registry when this was written.

The registry requires the site to already be live before you apply, because the pull request has to include a working link and a screenshot. So the order is deploy first, register second.

This folder is already a git repository with one commit, and `is-a-dev-berkankomur.json` in the root holds the exact file the registry wants. It is gitignored, so it will not be published with the site.

### Step 1: deploy to GitHub Pages

```bash
gh repo create komurberkan.github.io --public --source . --push
```

That needs the GitHub CLI. If you do not have it, create the repository at https://github.com/new named `komurberkan.github.io`, then:

```bash
git remote add origin https://github.com/komurberkan/komurberkan.github.io.git
git push -u origin main
```

Then in the repository, Settings > Pages > Source: `Deploy from a branch`, branch `main`, folder `/ (root)`. A minute later the site is live at https://komurberkan.github.io.

### Step 2: claim the subdomain

1. Fork https://github.com/is-a-dev/register
2. In your fork create `domains/berkankomur.json` with exactly the contents of `is-a-dev-berkankomur.json`:

```json
{
  "owner": {
    "username": "komurberkan",
    "email": "berkankomur1@gmail.com"
  },
  "records": {
    "CNAME": "komurberkan.github.io"
  }
}
```

3. Open a pull request. **Fill in their template rather than replacing it**, and include the live link plus a screenshot of the site. Both are required, and pull requests that skip them get closed.
4. Once it is merged, go back to Settings > Pages on your repository, put `berkankomur.is-a.dev` in Custom domain, and tick Enforce HTTPS.

One thing worth knowing: the registry's README says plainly not to use AI to generate the request. The JSON above is copied from their own GitHub Pages guide rather than invented, so it is correct, but write the pull request description in your own words. A submission that reads as machine-written gets a colder review.

### If you want something live today instead

Cloudflare Pages gives you `berkankomur.pages.dev` the moment you deploy, with no pull request and no waiting for a maintainer. You already run both products on Cloudflare, so it stays in one account:

1. https://dash.cloudflare.com > Workers & Pages > Create > Pages > Upload assets
2. Drag this whole folder in, name the project `berkankomur`

No build command and no output directory, because there is no build. You can still do the is-a.dev registration afterwards and point the `CNAME` at `berkankomur.pages.dev` instead.

**What not to bother with:** Freenom, the old source of free `.tk` and `.cf` domains, shut down in 2024 after Meta sued over phishing volume. It came back in 2026 but the domains are paid now, and the extensions still carry a spam reputation.

**Worth knowing:** a real `.com` runs about $10 a year. For something a hiring manager types by hand, that is usually money well spent.

---

## Notes on how it is built

- **Themes.** Follows the operating system by default. The toggle in the nav writes a choice to `localStorage` and that choice wins from then on.
- **Motion.** Sections fade up as they enter the viewport using `IntersectionObserver`, never a scroll listener. Everything collapses to static under `prefers-reduced-motion`.
- **The logo marquee** repeats its row in JavaScript until the loop is seamless at whatever width the browser is, and rebuilds on resize.
- **Fonts.** Geist and Geist Mono from Google Fonts, with a system fallback stack so text renders immediately.
- **Accessibility.** Skip link, visible focus rings, real landmarks, and colour pairs that clear WCAG AA in both themes.
- **Clipboard.** The copy button needs a secure context. Opening `index.html` straight from disk means `file://`, where the clipboard API is unavailable, so the button falls back to displaying the address. It works normally once deployed over HTTPS.
