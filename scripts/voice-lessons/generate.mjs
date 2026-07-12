#!/usr/bin/env node
/**
 * Batch-generate ElevenLabs MP3s for every skill-tree leaf (male + female)
 * and Coach voice preview clips.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... node scripts/voice-lessons/generate.mjs
 *   node scripts/voice-lessons/generate.mjs --previews-only
 *   node scripts/voice-lessons/generate.mjs --leaf decomposition
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

/** Load `.env` from project root (does not override existing env vars). */
function loadDotEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

const apiKey = process.env.ELEVENLABS_API_KEY;
const args = process.argv.slice(2);
const previewsOnly = args.includes('--previews-only');
const leafFilter = args.includes('--leaf') ? args[args.indexOf('--leaf') + 1] : null;

const voices = JSON.parse(readFileSync(join(root, 'content/voice/coach-voices.json'), 'utf8'));
const manifestPath = join(root, 'content/lessons/manifest.json');

if (!existsSync(manifestPath)) {
  console.error('Run: node scripts/voice-lessons/build-lesson-manifest.mjs first');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const lessonsDir = join(root, voices.output.lessonsDir);
const previewsDir = join(root, voices.output.previewsDir);
mkdirSync(lessonsDir, { recursive: true });
mkdirSync(previewsDir, { recursive: true });

const audioManifest = existsSync(join(root, 'content/lessons/audio-manifest.json'))
  ? JSON.parse(readFileSync(join(root, 'content/lessons/audio-manifest.json'), 'utf8'))
  : { version: 1, leaves: {}, previews: {} };

async function tts(text, voiceId, outPath) {
  if (existsSync(outPath) && !args.includes('--force')) {
    console.log('skip (exists)', outPath);
    return outPath;
  }
  if (!apiKey) {
    console.warn('No ELEVENLABS_API_KEY — skipping', outPath);
    return null;
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: voices.modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  console.log('wrote', outPath, `(${(buf.length / 1024).toFixed(1)} KB)`);
  return outPath;
}

function publicUrl(absPath) {
  const rel = absPath.replace(join(root, 'public'), '').replace(/\\/g, '/');
  return rel.startsWith('/') ? rel : `/${rel}`;
}

async function generatePreviews() {
  for (const gender of ['male', 'female']) {
    const voiceId = voices[gender].voiceId;
    const filename = `preview-${gender}.mp3`;
    const out = join(previewsDir, filename);
    await tts(voices.previewScript, voiceId, out);
    if (existsSync(out)) {
      audioManifest.previews[gender] = {
        url: publicUrl(out),
        script: voices.previewScript,
        generatedAt: new Date().toISOString(),
      };
    }
  }
}

async function generateLessons() {
  let lessons = manifest.lessons;
  if (leafFilter) lessons = lessons.filter((l) => l.leafId === leafFilter);

  for (const lesson of lessons) {
    if (!audioManifest.leaves[lesson.leafId]) {
      audioManifest.leaves[lesson.leafId] = { scriptVersion: lesson.scriptVersion };
    }
    const entry = audioManifest.leaves[lesson.leafId];
    entry.title = lesson.title;
    entry.scriptVersion = lesson.scriptVersion;

    for (const gender of ['male', 'female']) {
      const voiceId = voices[gender].voiceId;
      const filename = `${lesson.leafId}-${gender}.mp3`;
      const out = join(lessonsDir, filename);
      await tts(lesson.script, voiceId, out);
      if (existsSync(out)) {
        entry[`audioUrl${gender === 'male' ? 'Male' : 'Female'}`] = publicUrl(out);
        entry.generatedAt = new Date().toISOString();
      }
    }
  }
}

try {
  if (previewsOnly) {
    await generatePreviews();
  } else {
    await generatePreviews();
    await generateLessons();
  }

  audioManifest.updatedAt = new Date().toISOString();
  writeFileSync(join(root, 'content/lessons/audio-manifest.json'), JSON.stringify(audioManifest, null, 2));
  console.log('Updated content/lessons/audio-manifest.json');
} catch (err) {
  console.error(err);
  process.exit(1);
}
