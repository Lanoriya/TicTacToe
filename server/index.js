const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tictactoeDB',
  password: 'artas',
  port: 5432,
});

app.use(cors());
app.use(express.json());

const secretKey = crypto.randomBytes(32).toString('hex');

app.post('/api/register', async (req, res) => {
  console.log('Received registration request');
  const { login, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id',
      [login, hashedPassword]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id, username: login }, secretKey, { expiresIn: '1h' });

    // Отправляем токен в ответе на успешную регистрацию
    res.status(200).json({ message: 'Registration successful', userId: newUser.rows[0].id, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Received login request');
  const { login, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (user.rows.length === 0) {
      // Логин не существует
      return res.status(401).send('Неверный логин');
    }

    const hashedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
      // Верный логин и пароль
      const token = jwt.sign({ userId: user.rows[0].id, username: login }, secretKey, { expiresIn: '1h' });
      res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });
      return res.status(200).json({ message: 'Login successful', userId: user.rows[0].id, token });
    } else {
      // Логин верный, но пароль неверный
      return res.status(401).send('Неверный пароль');
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/verify', (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authToken.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/saveGame', async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authToken.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const { playerX, playerO, winner, date, time } = req.body;
    console.log('Received game data:', playerX, playerO, winner, date, time);

    const query = {
      text: 'INSERT INTO games (player_x_name, player_o_name, winner, game_date, game_duration) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [playerX, playerO, winner, date, time],
    };

    const result = await pool.query(query);

    return res.status(200).json({ message: 'Game data saved successfully', gameId: result.rows[0].id });
  } catch (error) {
    console.error('Error during game data save:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Запрос для получения данных об играх
app.get('/api/games', async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authToken.split(' ')[1];

  try {
    // Здесь вы должны выполнить SQL-запрос для извлечения данных из таблицы "games" и вернуть их
    const query = 'SELECT * FROM games';

    const games = await pool.query(query);

    return res.status(200).json(games.rows);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}.`);
});
