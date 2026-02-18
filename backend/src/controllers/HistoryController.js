import { Router } from 'express';

/**
 * @param {import('../repositories/HistoryRepository.js').HistoryRepository} repo
 * @returns {Router}
 */
export function createHistoryRouter(repo) {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(repo.findAll());
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const deleted = repo.deleteById(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  });

  router.delete('/', (_req, res) => {
    repo.deleteAll();
    res.status(204).end();
  });

  return router;
}
