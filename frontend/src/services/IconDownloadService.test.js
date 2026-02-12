import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IconDownloadService } from './IconDownloadService';

describe('IconDownloadService', () => {
  /** @type {IconDownloadService} */
  let service;

  beforeEach(() => {
    service = new IconDownloadService();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      blob: () => Promise.resolve(new Blob([''], { type: 'image/png' })),
    });
    vi.stubGlobal('URL', {
      createObjectURL: () => 'blob:mock',
      revokeObjectURL: vi.fn(),
    });
  });

  it('fetches iconUrl and triggers download with sanitized app name and extension', async () => {
    const origCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const el = origCreateElement(tagName);
      if (tagName === 'a') el.click = vi.fn();
      return el;
    });

    await service.download('https://example.com/icon.png', 'My App');

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/icon.png');
    const anchorCalls = createElementSpy.mock.results.filter((r) => r.value?.tagName === 'A');
    expect(anchorCalls.length).toBeGreaterThan(0);
    const anchor = anchorCalls[anchorCalls.length - 1].value;
    expect(anchor.download).toMatch(/My App\.(png|jpg)/);
  });

  it('uses .jpg when icon URL suggests jpeg', async () => {
    const origCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const el = origCreateElement(tagName);
      if (tagName === 'a') el.click = vi.fn();
      return el;
    });
    vi.mocked(global.fetch).mockResolvedValue({
      blob: () => Promise.resolve(new Blob([''], { type: 'image/jpeg' })),
    });

    await service.download('https://example.com/icon.jpg', 'App');

    const anchorCalls = createElementSpy.mock.results.filter((r) => r.value?.tagName === 'A');
    const anchor = anchorCalls[anchorCalls.length - 1].value;
    expect(anchor.download).toMatch(/App\.(jpg|jpeg)/);
  });
});
