# Coach voice lessons

Audio files are generated locally and committed to `public/audio/` (or generated at deploy time).

## Setup

1. Get an [ElevenLabs API key](https://elevenlabs.io).
2. Store it in **`.env`** at the project root (gitignored):

```
ELEVENLABS_API_KEY=sk_...
```

3. Audition voices and update IDs in `content/voice/coach-voices.json`.
4. Build lesson scripts from the skill tree:

```bash
npm run lessons:manifest
```

5. Generate MP3s (previews + all 38 leaves × 2 voices):

```bash
npm run lessons:generate
```

The generate script loads `.env` automatically.

Options:

- `--previews-only` — only Coach intro clips
- `--leaf decomposition` — single leaf
- `--force` — overwrite existing MP3s

Output updates `content/lessons/audio-manifest.json` with public URLs.

## Without API key

The app falls back to **browser read-aloud** (Web Speech API) using lesson transcripts from `content/lessons/manifest.json`.
