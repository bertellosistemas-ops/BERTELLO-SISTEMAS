const db = require('./database');

db.exec(`CREATE TABLE IF NOT EXISTS usuarios_claves (
  id TEXT PRIMARY KEY,
  hash TEXT
);`);

module.exports = db;
