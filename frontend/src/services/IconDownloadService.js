/**
 * @param {string} appName
 * @returns {string}
 */
function safeFilenameBase(appName) {
  return appName.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim() || 'app';
}

/**
 * @param {string} blobType
 * @param {string} iconUrl
 * @returns {'jpg' | 'png'}
 */
function extensionFromTypeOrUrl(blobType, iconUrl) {
  return blobType.includes('jpeg') || blobType.includes('jpg') || /\.jpe?g$/i.test(iconUrl) ? 'jpg' : 'png';
}

/**
 * @implements {import('./IIconDownloadService.js').IIconDownloadService}
 */
export class IconDownloadService {
  /**
   * @param {string} iconUrl
   * @param {string} appName
   * @returns {Promise<void>}
   */
  async download(iconUrl, appName) {
    const res = await fetch(iconUrl);
    const blob = await res.blob();
    const ext = extensionFromTypeOrUrl(blob.type || '', iconUrl);
    const filename = `${safeFilenameBase(appName)}.${ext}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
