const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

const db = new Client({
  user: 'm1sfor2ne',
  host: 'localhost',
  database: 'TicTacToe',
  password: 'artas',
  port: 5432,
});

db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
  });

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users')
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
