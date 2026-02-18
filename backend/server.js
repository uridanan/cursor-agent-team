import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createLookupHandler } from './src/controllers/LookupController.js';
import { createHistoryRouter } from './src/controllers/HistoryController.js';
import { HistoryRepository } from './src/repositories/HistoryRepository.js';

const dataDir = path.resolve('data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const historyRepo = new HistoryRepository(path.join(dataDir, 'history.db'));

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/lookup', createLookupHandler(historyRepo));
app.use('/api/history', createHistoryRouter(historyRepo));

const PORT = process.env.PORT || 5679;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
