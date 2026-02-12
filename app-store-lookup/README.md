# App Store Lookup

Minimal app that takes a **Google Play** or **App Store** URL and returns:

- **App icon** (highest available quality)
- **App name**
- **Bundle ID**
- **Short description** (2–3 lines)
- **Developer**: name, website, email

## Run

```bash
npm install
npm start
```

Open [http://localhost:3333](http://localhost:3333), paste a store link, and click **Look up**.

## Example URLs

- Google Play: `https://play.google.com/store/apps/details?id=com.google.android.apps.translate`
- App Store: `https://apps.apple.com/app/id414478124` or `https://apps.apple.com/us/app/google-translate/id414478124`

## Stack

- **Backend**: Node.js, Express, [google-play-scraper](https://www.npmjs.com/package/google-play-scraper), iTunes Lookup API for Apple
- **Frontend**: vanilla HTML/CSS/JS, minimal UI
