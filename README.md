# chronicleofgods.com

The website of Chronicle of Gods. Plain static HTML: no build step, no framework, no tracking.

- `index.html`, `css/site.css`: the page.
- `material/`: the game's own house-style images (deckled edge, hand-drawn frames, paper and leather
  textures), baked out of the game's source (`src/renderer/ui/material/`), so the site wears the same paper.
- `fonts/`: the game's house type, EB Garamond and IM Fell English, each with its SIL Open Font License.
- `img/`, `video/`: screenshots and the map-layers loop, taken from the game.

Hosted on GitHub Pages; `CNAME` points it at chronicleofgods.com. DNS stays at Porkbun. **Never delete the
`_atproto` TXT record (it proves the Bluesky handle) or the email-forwarding MX records** when adding the
Pages records.

Preview locally with any static server from this folder, e.g. `npx serve .`.
