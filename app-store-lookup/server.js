import express from 'express';
import cors from 'cors';
import gplay from 'google-play-scraper';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.static(join(__dirname, 'public')));

/**
 * Parse store URL and return { store: 'apple'|'google', id: string }
 */
function parseStoreUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('apps.apple.com')) {
      const match = u.pathname.match(/\/id(\d+)/);
      if (match) return { store: 'apple', id: match[1] };
    }
    if (u.hostname.includes('play.google.com')) {
      const id = u.searchParams.get('id');
      if (id) return { store: 'google', id };
    }
  } catch (_) {}
  return null;
}

/**
 * Shorten description to 2-3 lines (roughly ~200 chars)
 */
function shortDescription(text) {
  if (!text || typeof text !== 'string') return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const maxLen = 220;
  if (cleaned.length <= maxLen) return cleaned;
  const cut = cleaned.slice(0, maxLen).replace(/\s+\S*$/, '');
  return cut + (cut.length < cleaned.length ? '…' : '');
}

/**
 * Fetch App Store (Apple) app details via iTunes Lookup API
 */
async function fetchAppleApp(id) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=software`);
  const data = await res.json();
  const app = data?.results?.[0];
  if (!app) return null;

  const iconUrl = app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60;
  return {
    name: app.trackName || '',
    bundleId: app.bundleId || '',
    description: shortDescription(app.description || app.shortDescription || ''),
    iconUrl: iconUrl ? iconUrl.replace(/\/[0-9]+x[0-9]+bb\./, '/512x512bb.') : '',
    developer: {
      name: app.artistName || app.sellerName || '',
      website: app.sellerUrl || app.artistViewUrl || '',
      email: app.sellerEmail || '',
    },
  };
}

/**
 * Fetch Google Play app details
 */
async function fetchGoogleApp(id) {
  const data = await gplay.app({ appId: id });
  if (!data || !data.appId) return null;

  let iconUrl = data.icon || '';
  if (iconUrl && !iconUrl.startsWith('http')) iconUrl = 'https:' + iconUrl;
  if (iconUrl && iconUrl.includes('=w')) iconUrl = iconUrl.replace(/=w\d+/, '=w512');

  return {
    name: data.title || '',
    bundleId: data.appId || '',
    description: shortDescription(data.summary || data.description || ''),
    iconUrl,
    developer: {
      name: data.developer || '',
      website: data.developerWebsite || '',
      email: data.developerEmail || '',
    },
  };
}

app.get('/api/lookup', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  const parsed = parseStoreUrl(url);
  if (!parsed) {
    return res.status(400).json({
      error: 'Invalid URL. Use a Google Play or App Store app link.',
    });
  }

  try {
    const result =
      parsed.store === 'apple'
        ? await fetchAppleApp(parsed.id)
        : await fetchGoogleApp(parsed.id);

    if (!result) {
      return res.status(404).json({ error: 'App not found' });
    }

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message || 'Failed to fetch app details',
    });
  }
});

app.listen(PORT, () => {
  console.log(`App Store Lookup running at http://localhost:${PORT}`);
});
