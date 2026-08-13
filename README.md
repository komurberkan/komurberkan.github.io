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

## A free domain

You asked for free. In order of how good the result looks:

**1. `berkankomur.is-a.dev` - free forever, best looking**
A community registry that hands out `.is-a.dev` subdomains to developers, running on Cloudflare. You fork [is-a-dev/register](https://github.com/is-a-dev/register), add a small JSON file pointing at your host, and open a pull request. Takes about ten minutes plus review time. A `.dev` address reads as deliberate on a CV, which no other free option manages.

**2. `berkankomur.pages.dev` - instant, zero effort**
Cloudflare Pages gives every project a free subdomain the moment you deploy. You already run both products on Cloudflare, so this keeps everything in one account and needs no extra steps. Good enough to start applying today, and you can point option 1 at it later without redeploying.

Netlify (`.netlify.app`), Vercel (`.vercel.app`) and GitHub Pages (`.github.io`) work the same way if you prefer one of those.

**What not to bother with:** Freenom, the old source of free `.tk` and `.cf` domains, shut down in 2024 after Meta sued over phishing volume. It came back in 2026 but the domains are paid now, and the extensions still carry a spam reputation that hurts deliverability. Not worth it.

**Worth knowing:** a real `.com` runs about $10 a year. For something a hiring manager will type, that is usually money well spent. `berkankomur.com` and `.dev` variants are worth checking.

### Deploying

Cloudflare Pages, since you are already there:

1. https://dash.cloudflare.com > Workers & Pages > Create > Pages > Upload assets
2. Drag this whole folder in
3. Name the project `berkankomur`, which gives you `berkankomur.pages.dev`

No build command and no output directory to set, because there is no build. Netlify has the same flow at https://app.netlify.com/drop.

---

## Notes on how it is built

- **Themes.** Follows the operating system by default. The toggle in the nav writes a choice to `localStorage` and that choice wins from then on.
- **Motion.** Sections fade up as they enter the viewport using `IntersectionObserver`, never a scroll listener. Everything collapses to static under `prefers-reduced-motion`.
- **The logo marquee** repeats its row in JavaScript until the loop is seamless at whatever width the browser is, and rebuilds on resize.
- **Fonts.** Geist and Geist Mono from Google Fonts, with a system fallback stack so text renders immediately.
- **Accessibility.** Skip link, visible focus rings, real landmarks, and colour pairs that clear WCAG AA in both themes.
- **Clipboard.** The copy button needs a secure context. Opening `index.html` straight from disk means `file://`, where the clipboard API is unavailable, so the button falls back to displaying the address. It works normally once deployed over HTTPS.
