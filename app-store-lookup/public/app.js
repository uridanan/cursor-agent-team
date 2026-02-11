const form = document.getElementById('form');
const urlInput = document.getElementById('url');
const submitBtn = document.getElementById('submit');
const hint = document.getElementById('hint');
const result = document.getElementById('result');
const error = document.getElementById('error');
const errorText = document.getElementById('error-text');
const loading = document.getElementById('loading');

const iconEl = document.getElementById('icon');
const appNameEl = document.getElementById('app-name');
const bundleIdEl = document.getElementById('bundle-id');
const descriptionEl = document.getElementById('description');
const devNameEl = document.getElementById('dev-name');
const devWebsiteEl = document.getElementById('dev-website');
const devEmailEl = document.getElementById('dev-email');
const rowWebsite = document.getElementById('row-website');
const rowEmail = document.getElementById('row-email');

const apiBase = '';

function showLoading(show) {
  loading.hidden = !show;
  submitBtn.disabled = show;
}

function showError(message) {
  error.hidden = !message;
  errorText.textContent = message || '';
}

function showResult(data) {
  if (!data) {
    result.hidden = true;
    return;
  }
  showError('');
  result.hidden = false;

  iconEl.src = data.iconUrl || '';
  iconEl.alt = data.name ? `${data.name} icon` : 'App icon';
  appNameEl.textContent = data.name || '—';
  bundleIdEl.textContent = data.bundleId || '—';
  descriptionEl.textContent = data.description || '—';

  const dev = data.developer || {};
  devNameEl.textContent = dev.name || '—';

  const hasWebsite = dev.website && dev.website.trim();
  rowWebsite.hidden = !hasWebsite;
  if (hasWebsite) {
    devWebsiteEl.href = dev.website;
    devWebsiteEl.textContent = dev.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  const hasEmail = dev.email && dev.email.trim();
  rowEmail.hidden = !hasEmail;
  if (hasEmail) {
    devEmailEl.href = `mailto:${dev.email}`;
    devEmailEl.textContent = dev.email;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  showError('');
  result.hidden = true;
  showLoading(true);

  try {
    const res = await fetch(`${apiBase}/api/lookup?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Something went wrong');
      return;
    }

    showResult(data);
  } catch (err) {
    showError('Network error. Please try again.');
  } finally {
    showLoading(false);
  }
});

urlInput.addEventListener('input', () => {
  const u = urlInput.value.trim();
  if (u.includes('play.google.com')) {
    hint.textContent = 'Google Play link detected';
  } else if (u.includes('apps.apple.com')) {
    hint.textContent = 'App Store link detected';
  } else {
    hint.textContent = '';
  }
});
