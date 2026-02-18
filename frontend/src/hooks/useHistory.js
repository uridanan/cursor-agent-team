import { useState, useCallback, useEffect } from 'react';

export function useHistory() {
  const [history, setHistory] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) setHistory(await res.json());
    } catch { /* network failure — keep stale data */ }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const removeEntry = useCallback(async (id) => {
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    await refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    await fetch('/api/history', { method: 'DELETE' });
    await refresh();
  }, [refresh]);

  return { history, refresh, removeEntry, clearAll };
}
