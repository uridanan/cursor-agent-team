import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadAppIcon } from './iconDownload';

describe('downloadAppIcon', () => {
  const mockLink = { click: vi.fn(), href: '', download: '' };
  let createElementSpy;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockLink;
      return document.createElement(tag);
    });
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['x'], { type: 'image/png' })),
    });
    global.URL.createObjectURL = vi.fn(() => 'blob:mock');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches iconUrl and triggers download with app name and extension', async () => {
    await downloadAppIcon('https://example.com/icon.png', 'My App', 'png');
    expect(fetch).toHaveBeenCalledWith('https://example.com/icon.png');
    expect(mockLink.download).toMatch(/My App\.png$/);
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('uses jpg extension when requested', async () => {
    await downloadAppIcon('https://example.com/icon', 'AppName', 'jpg');
    expect(mockLink.download).toMatch(/\.jpg$/);
  });
});
