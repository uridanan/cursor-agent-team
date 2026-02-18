import express from 'express';
import request from 'supertest';
import { HistoryRepository } from '../src/repositories/HistoryRepository.js';
import { createHistoryRouter } from '../src/controllers/HistoryController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(__dirname, '__test_history_ctrl.db');

function cleanup() {
  try { fs.unlinkSync(TEST_DB); } catch { /* noop */ }
}

describe('HistoryController', () => {
  let app;
  let repo;

  beforeEach(() => {
    cleanup();
    repo = new HistoryRepository(TEST_DB);
    app = express();
    app.use(express.json());
    app.use('/api/history', createHistoryRouter(repo));
  });

  afterEach(() => {
    repo.close();
    cleanup();
  });

  const sampleEntry = {
    url: 'https://play.google.com/store/apps/details?id=com.example',
    store: 'google_play',
    iconUrl: 'https://icon.example/img.png',
    name: 'Test App',
    bundleId: 'com.example',
    shortDescription: 'Desc',
    developerName: 'Dev',
    developerWebsite: null,
    developerEmail: null,
  };

  test('GET /api/history returns empty list initially', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /api/history returns saved entries', async () => {
    repo.save(sampleEntry);
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Test App');
  });

  test('DELETE /api/history/:id removes entry', async () => {
    const saved = repo.save(sampleEntry);
    const res = await request(app).delete(`/api/history/${saved.id}`);
    expect(res.status).toBe(204);
    expect(repo.findAll()).toHaveLength(0);
  });

  test('DELETE /api/history/:id returns 404 for missing', async () => {
    const res = await request(app).delete('/api/history/9999');
    expect(res.status).toBe(404);
  });

  test('DELETE /api/history clears all entries', async () => {
    repo.save(sampleEntry);
    repo.save({ ...sampleEntry, name: 'Another', url: 'https://apps.apple.com/us/app/x/id123' });
    const res = await request(app).delete('/api/history');
    expect(res.status).toBe(204);
    expect(repo.findAll()).toEqual([]);
  });
});
