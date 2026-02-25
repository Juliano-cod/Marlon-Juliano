import Database from 'better-sqlite3';

const db = new Database('ideas.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    commits TEXT NOT NULL
  );
`);

export default db;
