/**
 * @param {string} iconUrl
 * @param {string} appName
 * @param {'jpg'|'png'} extension
 * @returns {Promise<void>}
 */
export async function downloadAppIcon(iconUrl, appName, extension) {
  const res = await fetch(iconUrl);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const safeName = `${String(appName).replace(/[/\\?%*:|"]/g, '-').trim() || 'icon'}.${extension}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
