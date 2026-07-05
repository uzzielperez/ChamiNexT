#!/usr/bin/env node
/**
 * Scrapes public interview-experience content into a raw document cache.
 *
 * Sources (all keyless):
 *  - Reddit public JSON API (posts + top comments)
 *  - Hacker News via Algolia search API
 *  - Blog RSS feeds
 *  - YouTube search + caption transcripts
 *
 * Usage:
 *   node scripts/interview-intel/scrape.mjs [--source reddit|hn|rss|youtube] [--profile frontier]
 *
 * Output: scripts/interview-intel/.cache/raw-docs.json
 * Politeness: sequential fetches with delays, descriptive User-Agent, and
 * public read-only endpoints only.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, '.cache');

const profileArg = process.argv.includes('--profile')
  ? process.argv[process.argv.indexOf('--profile') + 1]
  : null;

function mergeList(base = [], extra = []) {
  return [...new Set([...base, ...extra])];
}

function loadSources() {
  const base = JSON.parse(readFileSync(join(here, 'sources.json'), 'utf8'));
  if (profileArg !== 'frontier') return base;
  const extra = JSON.parse(readFileSync(join(here, 'sources-frontier.json'), 'utf8'));
  return {
    ...base,
    reddit: {
      ...base.reddit,
      subreddits: mergeList(base.reddit.subreddits, extra.reddit?.subreddits),
      queries: mergeList(base.reddit.queries, extra.reddit?.queries),
      postsPerQuery: Math.max(base.reddit.postsPerQuery, extra.reddit?.postsPerQuery ?? 0),
      commentsPerPost: Math.max(base.reddit.commentsPerPost, extra.reddit?.commentsPerPost ?? 0),
    },
    hackernews: {
      ...base.hackernews,
      queries: mergeList(base.hackernews?.queries, extra.hackernews?.queries),
      storiesPerQuery: Math.max(base.hackernews?.storiesPerQuery ?? 10, extra.hackernews?.storiesPerQuery ?? 0),
      commentsPerStory: Math.max(base.hackernews?.commentsPerStory ?? 8, extra.hackernews?.commentsPerStory ?? 0),
    },
    rss: [...(base.rss ?? []), ...(extra.rss ?? [])],
    youtube: {
      ...base.youtube,
      queries: mergeList(base.youtube.queries, extra.youtube?.queries),
      videosPerQuery: Math.max(base.youtube.videosPerQuery, extra.youtube?.videosPerQuery ?? 0),
    },
    missionCompanies: extra.missionCompanies ?? [],
  };
}

const sources = loadSources();

const UA =
  'ChamiNextIntelBot/1.0 (interview prep research; contact: hello@chaminext.example)';

const onlySource = process.argv.includes('--source')
  ? process.argv[process.argv.indexOf('--source') + 1]
  : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, extraHeaders = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, ...extraHeaders } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

// djb2; the whole URL must contribute to the id (prefix-sliced base64 collides).
const hashId = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

const stripHtml = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const docs = [];
const pushDoc = (doc) => {
  if (!doc.text || doc.text.length < 200) return;
  docs.push({ ...doc, text: doc.text.slice(0, 12000) });
};

/* ── Reddit (via PullPush archive API; reddit.com JSON blocks bots) ─ */
async function scrapeReddit() {
  const cfg = sources.reddit;
  for (const sub of cfg.subreddits) {
    for (const query of cfg.queries) {
      const url = `https://api.pullpush.io/reddit/search/submission/?subreddit=${sub}&q=${encodeURIComponent(
        query
      )}&size=${cfg.postsPerQuery}&score=%3E${cfg.minPostScore}&sort_type=score&sort=desc`;
      try {
        const data = await fetchJson(url);
        const posts = data?.data ?? [];
        for (const p of posts) {
          if (!p?.title || (p.score ?? 0) < cfg.minPostScore) continue;
          if (p.selftext === '[removed]' || p.selftext === '[deleted]') continue;
          let text = `${p.title}\n\n${p.selftext || ''}`;
          // Pull top comments; interview threads often carry detail there.
          try {
            const thread = await fetchJson(
              `https://api.pullpush.io/reddit/search/comment/?link_id=${p.id}&size=${cfg.commentsPerPost}&score=%3E${cfg.minCommentScore}&sort_type=score&sort=desc`
            );
            for (const c of (thread?.data ?? []).slice(0, cfg.commentsPerPost)) {
              if (c?.body && c.body !== '[removed]' && (c.score ?? 0) >= cfg.minCommentScore) {
                text += `\n\n[comment, score ${c.score}]\n${c.body}`;
              }
            }
          } catch {
            /* comments are best-effort */
          }
          pushDoc({
            id: `reddit-${p.id}`,
            source: 'reddit',
            url: `https://www.reddit.com${p.permalink ?? `/r/${sub}/comments/${p.id}`}`,
            title: p.title,
            text,
            meta: { subreddit: sub, score: p.score, createdUtc: p.created_utc },
          });
          await sleep(400);
        }
      } catch (err) {
        console.warn(`  reddit r/${sub} "${query}": ${err.message}`);
      }
      await sleep(800);
    }
    console.log(`  r/${sub} done (${docs.length} docs total)`);
  }
}

/* ── Hacker News (Algolia) ──────────────────────────────────────── */
async function scrapeHackerNews() {
  const cfg = sources.hackernews;
  for (const query of cfg.queries) {
    try {
      const data = await fetchJson(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
          query
        )}&tags=story&hitsPerPage=${cfg.storiesPerQuery}`
      );
      for (const hit of data.hits ?? []) {
        let text = `${hit.title}\n\n${hit.story_text ? stripHtml(hit.story_text) : ''}`;
        try {
          const item = await fetchJson(
            `https://hn.algolia.com/api/v1/items/${hit.objectID}`
          );
          const comments = (item.children ?? [])
            .filter((c) => c.text)
            .slice(0, cfg.commentsPerStory);
          for (const c of comments) {
            text += `\n\n[comment]\n${stripHtml(c.text)}`;
          }
        } catch {
          /* best-effort */
        }
        pushDoc({
          id: `hn-${hit.objectID}`,
          source: 'hn',
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          title: hit.title,
          text,
          meta: { points: hit.points, createdAt: hit.created_at },
        });
        await sleep(300);
      }
      console.log(`  hn "${query}" done (${docs.length} docs total)`);
    } catch (err) {
      console.warn(`  hn "${query}": ${err.message}`);
    }
  }
}

/* ── RSS blogs ──────────────────────────────────────────────────── */
function parseRssItems(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
  for (const block of blocks) {
    const pick = (tag) => {
      const m =
        block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i')) ||
        block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      return m ? m[1].trim() : '';
    };
    const linkAttr = block.match(/<link[^>]*href="([^"]+)"/i);
    items.push({
      title: stripHtml(pick('title')),
      link: linkAttr ? linkAttr[1] : stripHtml(pick('link')),
      content: stripHtml(pick('content:encoded') || pick('description') || pick('content') || pick('summary')),
      date: pick('pubDate') || pick('published') || pick('updated'),
    });
  }
  return items;
}

async function scrapeRss() {
  for (const feed of sources.rss) {
    try {
      const xml = await fetchText(feed.url);
      const items = parseRssItems(xml);
      for (const item of items) {
        let content = item.content;
        // Feeds often ship only a teaser; fetch the article for the full text.
        if (content.length < 600 && item.link?.startsWith('http')) {
          try {
            const articleHtml = await fetchText(item.link);
            const body =
              articleHtml.match(/<article[\s\S]*?<\/article>/i)?.[0] ??
              articleHtml.match(/<main[\s\S]*?<\/main>/i)?.[0] ??
              articleHtml;
            const full = stripHtml(body);
            if (full.length > content.length) content = full;
            await sleep(400);
          } catch {
            /* keep the teaser */
          }
        }
        pushDoc({
          id: `rss-${hashId(item.link)}`,
          source: 'blog',
          url: item.link,
          title: item.title,
          text: `${item.title}\n\n${content}`,
          meta: { feed: feed.name, date: item.date },
        });
      }
      console.log(`  rss "${feed.name}": ${items.length} items (${docs.length} docs total)`);
      await sleep(500);
    } catch (err) {
      console.warn(`  rss "${feed.name}": ${err.message}`);
    }
  }
}

/* ── YouTube (search page + caption transcripts, keyless) ───────── */
function extractInitialData(html) {
  const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function findVideoIds(node, out) {
  if (!node || typeof node !== 'object' || out.size >= 40) return;
  if (node.videoRenderer?.videoId && node.videoRenderer?.title) {
    const title = node.videoRenderer.title.runs?.map((r) => r.text).join('') ?? '';
    out.set(node.videoRenderer.videoId, title);
  }
  for (const v of Object.values(node)) findVideoIds(v, out);
}

// yt-dlp is the reliable path: YouTube's keyless timedtext endpoints now
// return empty bodies (proof-of-origin token requirement).
function hasYtDlp() {
  try {
    execFileSync('python3', ['-m', 'yt_dlp', '--version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function transcriptViaYtDlp(videoId) {
  const subDir = join(cacheDir, 'yt');
  if (!existsSync(subDir)) mkdirSync(subDir, { recursive: true });
  execFileSync(
    'python3',
    [
      '-m', 'yt_dlp',
      '--skip-download',
      '--write-auto-subs', '--write-subs',
      '--sub-langs', 'en.*',
      '--sub-format', 'json3',
      '-o', join(subDir, '%(id)s'),
      `https://www.youtube.com/watch?v=${videoId}`,
    ],
    { stdio: 'pipe', timeout: 60000 }
  );
  const file = readdirSync(subDir).find((f) => f.startsWith(videoId) && f.endsWith('.json3'));
  if (!file) return null;
  const data = JSON.parse(readFileSync(join(subDir, file), 'utf8'));
  const text = (data.events ?? [])
    .flatMap((e) => e.segs ?? [])
    .map((s) => s.utf8 ?? '')
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  rmSync(join(subDir, file), { force: true });
  return text || null;
}

async function fetchTranscriptHtml(videoId) {
  const html = await fetchText(`https://www.youtube.com/watch?v=${videoId}`);
  const m = html.match(/"captionTracks":(\[.*?\])/);
  if (!m) return null;
  const tracks = JSON.parse(m[1]);
  const track =
    tracks.find((t) => t.languageCode?.startsWith('en') && !t.kind) ||
    tracks.find((t) => t.languageCode?.startsWith('en')) ||
    tracks[0];
  if (!track?.baseUrl) return null;
  const xml = await fetchText(track.baseUrl.replace(/\\u0026/g, '&'));
  return stripHtml(xml.replace(/<\/text>/g, ' ')) || null;
}

async function scrapeYouTube() {
  const cfg = sources.youtube;
  const found = new Map(cfg.videoIds.map((id) => [id, '']));
  for (const query of cfg.queries) {
    try {
      const html = await fetchText(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      );
      const data = extractInitialData(html);
      const ids = new Map();
      if (data) findVideoIds(data, ids);
      let taken = 0;
      for (const [id, title] of ids) {
        if (taken >= cfg.videosPerQuery) break;
        if (!found.has(id)) {
          found.set(id, title);
          taken += 1;
        }
      }
      console.log(`  youtube "${query}": ${taken} new videos`);
      await sleep(800);
    } catch (err) {
      console.warn(`  youtube search "${query}": ${err.message}`);
    }
  }
  const useYtDlp = hasYtDlp();
  if (!useYtDlp) {
    console.warn('  yt-dlp not found; falling back to HTML caption fetch (often blocked).');
  }
  for (const [id, title] of found) {
    try {
      const transcript = useYtDlp ? transcriptViaYtDlp(id) : await fetchTranscriptHtml(id);
      if (transcript) {
        pushDoc({
          id: `yt-${id}`,
          source: 'youtube',
          url: `https://www.youtube.com/watch?v=${id}`,
          title: title || `YouTube video ${id}`,
          text: `${title}\n\n${transcript}`,
          meta: {},
        });
      }
      await sleep(900);
    } catch (err) {
      console.warn(`  youtube transcript ${id}: ${err.message}`);
    }
  }
  console.log(`  youtube done (${docs.length} docs total)`);
}

/* ── Main ───────────────────────────────────────────────────────── */
const run = async () => {
  if (!onlySource || onlySource === 'reddit') {
    console.log('Scraping Reddit…');
    await scrapeReddit();
  }
  if (!onlySource || onlySource === 'hn') {
    console.log('Scraping Hacker News…');
    await scrapeHackerNews();
  }
  if (!onlySource || onlySource === 'rss') {
    console.log('Scraping RSS feeds…');
    await scrapeRss();
  }
  if (!onlySource || onlySource === 'youtube') {
    console.log('Scraping YouTube…');
    await scrapeYouTube();
  }

  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
  const outPath = join(cacheDir, 'raw-docs.json');

  // Merge with any previous run so sources can be scraped incrementally.
  let previous = [];
  if (existsSync(outPath)) {
    try {
      previous = JSON.parse(readFileSync(outPath, 'utf8'));
    } catch {
      previous = [];
    }
  }
  const byId = new Map(previous.map((d) => [d.id, d]));
  docs.forEach((d) => byId.set(d.id, d));
  const merged = [...byId.values()];

  writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(`\nWrote ${merged.length} raw docs (${docs.length} new/updated) to ${outPath}`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
