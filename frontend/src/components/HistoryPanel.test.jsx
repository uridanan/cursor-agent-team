import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HistoryPanel } from './HistoryPanel';

afterEach(cleanup);

const entries = [
  { id: 1, name: 'App A', bundle_id: 'com.a', icon_url: 'a.png', store: 'google_play', url: 'https://play.google.com/store/apps/details?id=com.a' },
  { id: 2, name: 'App B', bundle_id: 'com.b', icon_url: 'b.png', store: 'apple', url: 'https://apps.apple.com/us/app/x/id456' },
];

describe('HistoryPanel', () => {
  it('renders nothing when history is empty', () => {
    const { container } = render(<HistoryPanel history={[]} onSelect={() => {}} onRemove={() => {}} onClear={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders entries with names and bundle ids', () => {
    render(<HistoryPanel history={entries} onSelect={() => {}} onRemove={() => {}} onClear={() => {}} />);
    expect(screen.getByText('App A')).toBeTruthy();
    expect(screen.getByText('com.b')).toBeTruthy();
  });

  it('calls onSelect when an entry is clicked', () => {
    const onSelect = vi.fn();
    render(<HistoryPanel history={entries} onSelect={onSelect} onRemove={() => {}} onClear={() => {}} />);
    fireEvent.click(screen.getByLabelText('View App A'));
    expect(onSelect).toHaveBeenCalledWith(entries[0]);
  });

  it('calls onClear when clear all is clicked', () => {
    const onClear = vi.fn();
    render(<HistoryPanel history={entries} onSelect={() => {}} onRemove={() => {}} onClear={onClear} />);
    fireEvent.click(screen.getByLabelText('Clear all history'));
    expect(onClear).toHaveBeenCalled();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<HistoryPanel history={entries} onSelect={() => {}} onRemove={onRemove} onClear={() => {}} />);
    fireEvent.click(screen.getByLabelText('Remove App B'));
    expect(onRemove).toHaveBeenCalledWith(2);
  });
});
