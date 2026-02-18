/**
 * @param {{ history: Array, onSelect: (entry: object) => void, onRemove: (id: number) => void, onClear: () => void }} props
 */
export function HistoryPanel({ history, onSelect, onRemove, onClear }) {
  if (!history.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Previous Lookups</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-stone-400 hover:text-red-500 transition-colors"
          aria-label="Clear all history"
        >
          Clear all
        </button>
      </div>
      <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        {history.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors group">
            <button
              type="button"
              onClick={() => onSelect(entry)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
              aria-label={`View ${entry.name}`}
            >
              {entry.icon_url && (
                <img src={entry.icon_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{entry.name}</p>
                <p className="text-xs text-stone-400 font-mono truncate">{entry.bundle_id}</p>
              </div>
            </button>
            <span className="text-xs text-stone-300 flex-shrink-0 hidden sm:block">
              {entry.store === 'google_play' ? 'Google Play' : 'App Store'}
            </span>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all flex-shrink-0 p-1"
              aria-label={`Remove ${entry.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
