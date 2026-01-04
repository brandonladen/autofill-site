# LaceFi Autofill: static site

This folder is a small static site intended to guide users through installing and using the LaceFi Autofill extension on desktop (Chrome) and mobile (Quetta browser).

How to preview locally

1. From the repo root run a quick static server. Example using Python 3:

```bash
cd autofill-site
python3 -m http.server 8000
# then open http://localhost:8000 in a browser
```

2. The `index.html` references screenshots located in `public/`.

What I included

- `index.html` : one page quick start with sections: Desktop install, Mobile (Quetta), screenshots, licenses/payments, support.
- `styles.css` : lightweight responsive styles.
- `public/` : existing screenshots you provided (used by the page).

Downloads

- `extension.zip` : ZIP of the extension intended for mobile users (Quetta). Place this file in the site root and users can download it directly to their Android devices.
- `dist/` : built extension folder for laptop users. Laptop users should download the `dist/` folder and load it as an unpacked extension in Chrome (chrome://extensions → Developer mode → Load unpacked).

Hosting note

When you push this repository to GitHub and enable GitHub Pages (or host the `autofill-site` folder with any static host), the `extension.zip` and `dist/` links will be directly downloadable from the site. For example, if served at `https://<your-gh-user>.github.io/<repo>/`, the ZIP will be available at `https://.../extension.zip`.

Next improvements I can make

- Add step by step Quetta specific install instructions if you tell me which Quetta version or flow you want.
- Add separate pages for troubleshooting, screenshots with captions, or a download link for the CRX/ZIP.
- Add analytics or a contact form (requires a server endpoint).

If you want any text changes, new screenshots added, or a hosted deployment (GitHub Pages / Netlify), tell me which and I’ll update and give deploy commands.
