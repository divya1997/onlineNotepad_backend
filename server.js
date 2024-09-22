const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 8000;

// Middleware
app.use(cors()); // Allow CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

// Connect to SQLite database
const db = new sqlite3.Database('./db/notes.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT
    )`);
  }
});

// API to get all notes
app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API to save a new note
app.post('/notes', (req, res) => {
  const note = req.body.note; // Get note from the request body
  if (!note) {
    res.status(400).json({ error: 'Note content is required' });
    return;
  }

  db.run(`INSERT INTO notes (content) VALUES (?)`, [note], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      content: note
    });
  });
});

// API to get a single note by ID
app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
