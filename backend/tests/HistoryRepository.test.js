import { HistoryRepository } from '../src/repositories/HistoryRepository.js';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(__dirname, '__test_history.db');

function cleanup() {
  try { fs.unlinkSync(TEST_DB); } catch { /* noop */ }
}

describe('HistoryRepository', () => {
  let repo;

  beforeEach(() => {
    cleanup();
    repo = new HistoryRepository(TEST_DB);
  });

  afterEach(() => {
    repo.close();
    cleanup();
  });

  const sampleEntry = {
    url: 'https://play.google.com/store/apps/details?id=com.example',
    store: 'google_play',
    iconUrl: 'https://icon.example/img.png',
    name: 'Example App',
    bundleId: 'com.example',
    shortDescription: 'An example app.',
    developerName: 'Dev Inc',
    developerWebsite: 'https://dev.example',
    developerEmail: 'dev@example.com',
  };

  test('save() persists an entry and returns it with id and timestamp', () => {
    const saved = repo.save(sampleEntry);
    expect(saved.id).toBeDefined();
    expect(typeof saved.id).toBe('number');
    expect(saved.looked_up_at).toBeDefined();
    expect(saved.name).toBe('Example App');
  });

  test('findAll() returns entries newest-first', () => {
    repo.save({ ...sampleEntry, url: 'https://play.google.com/store/apps/details?id=com.first', name: 'First' });
    repo.save({ ...sampleEntry, url: 'https://play.google.com/store/apps/details?id=com.second', name: 'Second' });
    const all = repo.findAll();
    expect(all).toHaveLength(2);
    expect(all[0].name).toBe('Second');
    expect(all[1].name).toBe('First');
  });

  test('findAll() returns empty array when no entries', () => {
    expect(repo.findAll()).toEqual([]);
  });

  test('deleteById() removes a specific entry', () => {
    const saved = repo.save(sampleEntry);
    repo.deleteById(saved.id);
    expect(repo.findAll()).toHaveLength(0);
  });

  test('deleteById() returns false for non-existent id', () => {
    const result = repo.deleteById(9999);
    expect(result).toBe(false);
  });

  test('deleteAll() clears all entries', () => {
    repo.save(sampleEntry);
    repo.save({ ...sampleEntry, name: 'Another' });
    repo.deleteAll();
    expect(repo.findAll()).toEqual([]);
  });

  test('save() deduplicates by url, keeping only the latest', () => {
    repo.save({ ...sampleEntry, name: 'Old Name' });
    repo.save({ ...sampleEntry, name: 'New Name' });
    const all = repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe('New Name');
  });
});
