import { getService as defaultGetService } from '../services/AppStoreLookupServiceFactory.js';

function detectStore(url) {
  if (/play\.google\.com/i.test(url)) return 'google_play';
  if (/apps\.apple\.com|itunes\.apple\.com/i.test(url)) return 'apple';
  return 'unknown';
}

/**
 * Factory: creates a lookup handler with optional history persistence.
 * @param {import('../repositories/HistoryRepository.js').HistoryRepository | null} historyRepo
 * @param {((url: string) => import('../services/IAppStoreLookupService.js').IAppStoreLookupService) | null} getServiceFn
 */
export function createLookupHandler(historyRepo = null, getServiceFn = null) {
  const resolve = getServiceFn || defaultGetService;

  return async function lookup(req, res) {
    const url = req.body?.url;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url in body' });
    }
    try {
      const service = resolve(url);
      const info = await service.getAppInfo(url);
      if (historyRepo) {
        try {
          historyRepo.save({
            url,
            store: detectStore(url),
            iconUrl: info.iconUrl,
            name: info.name,
            bundleId: info.bundleId,
            shortDescription: info.shortDescription,
            developerName: info.developer?.name,
            developerWebsite: info.developer?.website,
            developerEmail: info.developer?.email,
          });
        } catch { /* history save failure must not break lookup */ }
      }
      res.status(200).json(info);
    } catch (err) {
      const msg = err && typeof err.message === 'string' ? err.message : 'Lookup failed';
      const code = msg.includes('Invalid') || msg.includes('Unsupported') || msg.includes('not found') ? 400 : 500;
      res.status(code).json({ error: msg });
    }
  };
}

/** Backwards-compatible standalone handler (no history) */
export const lookup = createLookupHandler();
