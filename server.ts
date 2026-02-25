import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import db from './src/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get('/api/ideas', (req, res) => {
    try {
      const ideas = db.prepare('SELECT * FROM ideas').all();
      // Deserialize commits from JSON
      const parsedIdeas = ideas.map(idea => ({
        ...idea,
        commits: JSON.parse(idea.commits)
      }));
      res.json(parsedIdeas);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ideas' });
    }
  });

  app.post('/api/ideas', (req, res) => {
    try {
      const { text, status, priority, commits } = req.body;
      const result = db.prepare('INSERT INTO ideas (text, status, priority, commits) VALUES (?, ?, ?, ?)')
                       .run(text, status, priority, JSON.stringify(commits));
      const newIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(result.lastInsertRowid);
      newIdea.commits = JSON.parse(newIdea.commits);
      res.status(201).json(newIdea);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create idea' });
    }
  });

  app.put('/api/ideas/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { status, commits } = req.body;
      db.prepare('UPDATE ideas SET status = ?, commits = ? WHERE id = ?')
        .run(status, JSON.stringify(commits), id);
      res.status(200).json({ message: 'Idea updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update idea' });
    }
  });

  app.delete('/api/ideas/:id', (req, res) => {
    try {
      const { id } = req.params;
      db.prepare('DELETE FROM ideas WHERE id = ?').run(id);
      res.status(200).json({ message: 'Idea deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete idea' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
