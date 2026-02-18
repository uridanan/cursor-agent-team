import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';

const fakeEntries = [
  { id: 2, url: 'https://apps.apple.com/us/app/x/id123', name: 'App B', icon_url: 'b.png', bundle_id: 'com.b', store: 'apple', looked_up_at: '2026-02-18T10:00:00Z' },
  { id: 1, url: 'https://play.google.com/store/apps/details?id=com.a', name: 'App A', icon_url: 'a.png', bundle_id: 'com.a', store: 'google_play', looked_up_at: '2026-02-18T09:00:00Z' },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('useHistory', () => {
  it('returns history, refresh, removeEntry, clearAll', () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    const { result } = renderHook(() => useHistory());
    expect(result.current).toHaveProperty('history');
    expect(result.current).toHaveProperty('refresh');
    expect(result.current).toHaveProperty('removeEntry');
    expect(result.current).toHaveProperty('clearAll');
  });

  it('fetches history on mount', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(fakeEntries) });
    const { result } = renderHook(() => useHistory());
    await act(() => Promise.resolve());
    expect(global.fetch).toHaveBeenCalledWith('/api/history');
    expect(result.current.history).toEqual(fakeEntries);
  });

  it('removeEntry calls DELETE and refreshes', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation((url, opts) => {
      if (opts?.method === 'DELETE') return Promise.resolve({ ok: true });
      callCount++;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(callCount === 1 ? fakeEntries : [fakeEntries[1]]) });
    });
    const { result } = renderHook(() => useHistory());
    await act(() => Promise.resolve());
    await act(() => result.current.removeEntry(2));
    expect(global.fetch).toHaveBeenCalledWith('/api/history/2', { method: 'DELETE' });
  });

  it('clearAll calls DELETE and refreshes', async () => {
    global.fetch = vi.fn().mockImplementation((url, opts) => {
      if (opts?.method === 'DELETE') return Promise.resolve({ ok: true });
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
    const { result } = renderHook(() => useHistory());
    await act(() => Promise.resolve());
    await act(() => result.current.clearAll());
    expect(global.fetch).toHaveBeenCalledWith('/api/history', { method: 'DELETE' });
  });
});
