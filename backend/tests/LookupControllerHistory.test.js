import express from 'express';
import request from 'supertest';
import { createLookupHandler } from '../src/controllers/LookupController.js';
import { HistoryRepository } from '../src/repositories/HistoryRepository.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(__dirname, '__test_lookup_hist.db');

function cleanup() {
  try { fs.unlinkSync(TEST_DB); } catch { /* noop */ }
}

const fakeService = {
  getAppInfo: async () => ({
    iconUrl: 'https://icon.example/img.png',
    name: 'Test App',
    bundleId: 'com.test',
    shortDescription: 'A test app',
    developer: { name: 'Dev', website: null, email: null },
  }),
};

const fakeFactory = () => fakeService;

describe('LookupController saves to history', () => {
  let app;
  let repo;

  beforeEach(() => {
    cleanup();
    repo = new HistoryRepository(TEST_DB);
    app = express();
    app.use(express.json());
    app.post('/api/lookup', createLookupHandler(repo, fakeFactory));
  });

  afterEach(() => {
    repo.close();
    cleanup();
  });

  test('successful lookup is saved to history', async () => {
    await request(app)
      .post('/api/lookup')
      .send({ url: 'https://play.google.com/store/apps/details?id=com.test' })
      .expect(200);

    const history = repo.findAll();
    expect(history).toHaveLength(1);
    expect(history[0].name).toBe('Test App');
    expect(history[0].bundle_id).toBe('com.test');
  });

  test('failed lookup is not saved to history', async () => {
    const failFactory = () => ({ getAppInfo: async () => { throw new Error('not found'); } });
    const failApp = express();
    failApp.use(express.json());
    failApp.post('/api/lookup', createLookupHandler(repo, failFactory));

    await request(failApp)
      .post('/api/lookup')
      .send({ url: 'https://play.google.com/store/apps/details?id=com.bad' })
      .expect(400);

    expect(repo.findAll()).toHaveLength(0);
  });
});
