# Student Daily Payment — PWA Wrapper

This is a lightweight PWA wrapper that embeds the Apps Script app
(`/exec` URL) inside a GitHub Pages-hosted shell, so it can be installed
as a real app on mobile devices.

## How it works

- `index.html` loads a full-viewport iframe pointing to the Apps Script app.
- `manifest.json` + `sw.js` make the shell installable.
- The service worker caches only the shell (never the Apps Script traffic).

## Updating the Apps Script URL

If you ever change the Apps Script deployment URL, edit the
`APPS_SCRIPT_URL` constant in `index.html` and commit.

## Adding your school logo

Replace `icon.svg` with your logo (keep the same filename), or add a PNG:

1. Add `icon-192.png` and `icon-512.png` to the repo.
2. Update `manifest.json` to reference them.
3. Commit.

## Troubleshooting

- **"This app cannot be installed"** — make sure you're visiting the HTTPS URL,
  not a local file.
- **Blank screen after install** — open the app, wait 5 seconds; the shell
  falls back if the iframe is slow. Then check the Apps Script URL.
- **iOS doesn't show an install prompt** — Safari never does; use
  Share → Add to Home Screen.