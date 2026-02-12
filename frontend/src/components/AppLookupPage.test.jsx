import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { useAppLookup } from '../hooks/useAppLookup';
import { AppLookupPage } from './AppLookupPage';

const mockResult = {
  iconUrl: 'https://example.com/icon.png',
  name: 'Test App',
  bundleId: 'com.test.app',
  shortDescription: 'A test app.',
  developer: { name: 'Dev' },
};

vi.mock('../hooks/useAppLookup', () => ({
  useAppLookup: vi.fn(() => ({ result: null, error: null, fetchApp: vi.fn() })),
}));

describe('AppLookupPage', () => {
  it('renders url input and submit button', () => {
    render(<AppLookupPage />);
    expect(screen.getByRole('textbox', { name: /url|app/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /lookup|search|fetch/i })).toBeTruthy();
  });

  it('shows no icon when result is absent', () => {
    render(<AppLookupPage />);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('shows icon with download affordance when result is present', () => {
    vi.mocked(useAppLookup).mockReturnValueOnce({ result: mockResult, error: null, fetchApp: vi.fn() });
    render(<AppLookupPage />);
    const article = screen.getByRole('article');
    const icon = within(article).getByRole('img');
    const title = icon.closest('a')?.getAttribute('title') ?? icon.getAttribute('title') ?? '';
    expect(String(title)).toMatch(/download/i);
  });

  it('calls downloadAppIcon when icon is clicked after result is loaded', () => {
    vi.mocked(useAppLookup).mockReturnValueOnce({ result: mockResult, error: null, fetchApp: vi.fn() });
    const downloadAppIcon = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<AppLookupPage downloadAppIcon={downloadAppIcon} />);
    const article = within(container).getByRole('article');
    const icon = within(article).getByRole('img');
    fireEvent.click(icon);
    expect(downloadAppIcon).toHaveBeenCalledWith(mockResult.iconUrl, mockResult.name, expect.stringMatching(/^(jpg|png)$/));
  });
});
