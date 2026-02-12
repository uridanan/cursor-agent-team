import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AppLookupPage } from './AppLookupPage';

const mockResult = {
  iconUrl: 'https://example.com/icon.png',
  name: 'Test App',
  bundleId: 'com.test.app',
  shortDescription: 'A test app.',
  developer: { name: 'Test Developer' },
};

const mockUseAppLookup = vi.fn(() => ({
  fetchApp: vi.fn(),
  result: null,
  error: null,
}));

vi.mock('../hooks/useAppLookup', () => ({
  useAppLookup: () => mockUseAppLookup(),
}));

vi.mock('../utils/iconDownload', () => ({
  downloadAppIcon: vi.fn(),
}));

describe('AppLookupPage', () => {
  beforeEach(() => {
    mockUseAppLookup.mockReturnValue({
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

  it('when result is present, icon has download affordance (button or link with download in name)', () => {
    mockUseAppLookup.mockReturnValue({
      fetchApp: vi.fn(),
      result: mockResult,
      error: null,
    });
    render(<AppLookupPage />);
    const articles = screen.getAllByRole('article');
    const downloadControl = within(articles[0]).getByRole('button', { name: /download/i });
    expect(downloadControl).toBeTruthy();
  });

  it('clicking the icon triggers downloadAppIcon with result iconUrl and name', async () => {
    const { downloadAppIcon } = await import('../utils/iconDownload');
    mockUseAppLookup.mockReturnValue({
      fetchApp: vi.fn(),
      result: mockResult,
      error: null,
    });
    render(<AppLookupPage />);
    const articles = screen.getAllByRole('article');
    const downloadControl = within(articles[0]).getByRole('button', { name: /download/i });
    fireEvent.click(downloadControl);
    expect(downloadAppIcon).toHaveBeenCalledWith(mockResult.iconUrl, mockResult.name);
  });
});
