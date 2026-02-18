import Database from 'better-sqlite3';

export class HistoryRepository {
  /** @param {string} [dbPath] */
  constructor(dbPath = 'data/history.db') {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this._migrate();
  }

  _migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS lookup_history (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        url             TEXT NOT NULL,
        store           TEXT NOT NULL,
        icon_url        TEXT,
        name            TEXT,
        bundle_id       TEXT,
        short_description TEXT,
        developer_name  TEXT,
        developer_website TEXT,
        developer_email TEXT,
        looked_up_at    TEXT NOT NULL
      )
    `);
    this.db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_history_url ON lookup_history(url)
    `);
  }

  /**
   * @param {{ url: string, store: string, iconUrl: string, name: string, bundleId: string, shortDescription: string, developerName: string, developerWebsite?: string, developerEmail?: string }} entry
   */
  save(entry) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO lookup_history (url, store, icon_url, name, bundle_id, short_description, developer_name, developer_website, developer_email, looked_up_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(url) DO UPDATE SET
        store = excluded.store,
        icon_url = excluded.icon_url,
        name = excluded.name,
        bundle_id = excluded.bundle_id,
        short_description = excluded.short_description,
        developer_name = excluded.developer_name,
        developer_website = excluded.developer_website,
        developer_email = excluded.developer_email,
        looked_up_at = excluded.looked_up_at
    `);
    const result = stmt.run(
      entry.url,
      entry.store,
      entry.iconUrl ?? null,
      entry.name ?? null,
      entry.bundleId ?? null,
      entry.shortDescription ?? null,
      entry.developerName ?? null,
      entry.developerWebsite ?? null,
      entry.developerEmail ?? null,
      now,
    );
    const id = result.changes > 0
      ? this.db.prepare('SELECT id FROM lookup_history WHERE url = ?').get(entry.url).id
      : result.lastInsertRowid;
    return { id, ...entry, looked_up_at: now };
  }

  findAll() {
    return this.db.prepare('SELECT * FROM lookup_history ORDER BY id DESC').all();
  }

  /** @param {number} id  @returns {boolean} */
  deleteById(id) {
    const result = this.db.prepare('DELETE FROM lookup_history WHERE id = ?').run(id);
    return result.changes > 0;
  }

  deleteAll() {
    this.db.prepare('DELETE FROM lookup_history').run();
  }

  close() {
    this.db.close();
  }
}
