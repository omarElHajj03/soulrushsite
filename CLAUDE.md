# PL Labs website

The studio site for **PL Labs**, live at https://playsoulrush.netlify.app.
Plain HTML/CSS/JS, no build step. Netlify auto-deploys every push to `main`,
so **a push to main is a live release**. Work on a branch and preview locally
first (`npx serve .` or `python -m http.server` from this folder).

## DO NOT TOUCH: these keep ads and store verification working

| File | Why it must stay exactly where it is |
|---|---|
| `app-ads.txt` | Yodo1 MAS ad seller list. Ad networks crawl it at the site ROOT. Moving, renaming or editing it breaks ad revenue. Only change it when Yodo1 sends a new list. |
| `privacy.html` | Soul Rush's privacy policy. The Yodo1 MAS SDK in the app (`AdsPlugin.java`) and the Google Play listing link to `/privacy`. Never move or rename it. |
| `googledba1242dae4050e1.html` | Google Search Console ownership proof. |
| `.nojekyll` | Leave it. |

Also keep the site on this domain. `app-ads.txt` is tied to the developer
website set in Google Play Console.

## Layout

```
/index.html               PL Labs home: logo, intro, game cards
/about/index.html         About Us
/games/index.html         Games & Services: every project card
/games/<slug>/            One folder per game, fully self-contained
    index.html
    style.css / main.js   the game's own look (may differ from the studio's)
    assets/               screenshots, favicon, etc.
/assets/studio.css        Shared styles for the three studio pages ONLY
/assets/pl-labs-logo.png  White logo on transparent background
/assets/favicon.svg       Studio favicon
/privacy.html             Soul Rush privacy policy (styled by games/soul-rush/style.css)
/games/soul-blocks/privacy.html  Soul Blocks privacy policy (link THIS one from the Play listing)
```

Game pages don't have to use `studio.css`. Each game can have its own style
(Soul Rush is gothic). The studio pages stay neutral: black, white, Space
Grotesk + Inter.

## Adding a game page (e.g. Soul Block)

1. Create `games/<slug>/index.html` (e.g. `games/soul-block/`). Put its CSS,
   JS and images inside that folder. Use **relative paths** only
   (`style.css`, `assets/...`, `../../` to reach the root). Never start a
   path with `/`.
2. Give the page a header linking back: `← PL Labs` → `../../` and
   `All games` → `../` (see `games/soul-rush/index.html`).
3. Update the project card in **both** `games/index.html` and `index.html`:
   - Turn the `<div class="card">` into `<a class="card" href="<slug>/">`
     (on the home page: `href="games/<slug>/"`).
   - Swap the `card-art placeholder` block for a real
     `<div class="card-art"><img ...></div>`.
   - Once it's released, move the card from "In development" up to the
     "Games" section in `games/index.html`.
4. If the game needs its own privacy policy, add it as
   `games/<slug>/privacy.html`. **Do not** edit or replace the root
   `privacy.html`; that one belongs to Soul Rush.
5. If the game uses ads from a network that isn't already in `app-ads.txt`,
   **append** its lines to the end of the file. Never delete existing lines.

## Adding a service

`games/index.html` has "Games" and "In development" sections. Add a new
`<section class="section">` with the same `section-head` + `card-grid`
pattern, titled "Services".
