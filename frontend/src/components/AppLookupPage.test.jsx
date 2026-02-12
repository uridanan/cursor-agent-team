import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppLookupPage } from './AppLookupPage';
import { useAppLookup } from '../hooks/useAppLookup';

vi.mock('../hooks/useAppLookup');

const mockResult = {
  iconUrl: 'https://example.com/icon.png',
  name: 'Test App',
  bundleId: 'com.test.app',
  shortDescription: 'Short desc',
  developer: { name: 'Dev' },
};

describe('AppLookupPage', () => {
  beforeEach(() => {
    vi.mocked(useAppLookup).mockReturnValue({
      fetchApp: vi.fn(),
      result: null,
      error: null,
    });
  });

  it('renders url input and submit button', () => {
    render(<AppLookupPage />);
    expect(screen.getByRole('textbox', { name: /url|app/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /lookup|search|fetch/i })).toBeTruthy();
  });

  it('shows icon with download affordance when result is present', () => {
    vi.mocked(useAppLookup).mockReturnValue({
      fetchApp: vi.fn(),
      result: mockResult,
      error: null,
    });
    const mockDownload = vi.fn();
    const { container } = render(<AppLookupPage iconDownloadService={{ download: mockDownload }} />);
    const article = container.querySelector('article');
    const img = article?.querySelector('img');
    expect(img).toBeTruthy();
    const wrapper = img?.closest('a') || img?.closest('button') || img?.parentElement;
    expect(wrapper).toBeTruthy();
    const hasPointer = wrapper?.classList?.contains('cursor-pointer') ?? false;
    const hasTitle = wrapper?.getAttribute('title')?.toLowerCase().includes('download') ?? false;
    const hasAria = wrapper?.getAttribute('aria-label')?.toLowerCase().includes('download') ?? false;
    expect(hasPointer || hasTitle || hasAria).toBe(true);
  });

  it('clicking icon calls download with result iconUrl and name', () => {
    vi.mocked(useAppLookup).mockReturnValue({
      fetchApp: vi.fn(),
      result: mockResult,
      error: null,
    });
    const mockDownload = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<AppLookupPage iconDownloadService={{ download: mockDownload }} />);
    const article = container.querySelector('article');
    const img = article?.querySelector('img');
    const clickable = img?.closest('a') || img?.closest('button') || img?.parentElement;
    fireEvent.click(clickable ?? img);
    expect(mockDownload).toHaveBeenCalledWith(mockResult.iconUrl, mockResult.name);
  });
});
