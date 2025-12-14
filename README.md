# Query Mission Control

An Expo (React Native + TypeScript) app that turns natural-language requests into saved queries with ranked, expandable result cards. Queries persist locally and via Supabase when configured. Adapters route requests to Google Places for local food searches or to a static global ranked list for the fastest cars.

## Features
- Home screen shows saved queries (like a chat list) with a floating action button to start a new one.
- Results screen renders ranked, tappable cards with inline expansion and deep links (maps, calls, web search, share).
- Intent router switches between a live Google Places adapter and a static car ranking adapter.
- Pull-to-refresh re-runs adapters and updates stored cards; cached cards load immediately while stale results refresh in the background.

## Setup
1. Install dependencies:

```bash
npm install
```

2. Provide environment secrets (e.g., via `.env` or your Expo config):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GOOGLE_PLACES_API_KEY`

Local food searches will attempt to geocode the typed location (if provided) with Google and otherwise request foreground
location permission to use the device coordinates.

3. Start the Expo dev server:

```bash
npm start
```

By default the app falls back to local AsyncStorage when Supabase credentials are not provided.
