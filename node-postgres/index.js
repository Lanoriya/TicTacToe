const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const db = require('./db'); // Подключение к базе данных

app.use(cors());
app.use(express.json());

app.get('/users', (req, res) => {
  db.getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post('/users', (req, res) => {
  const user = req.body;

  if (!user.name || !user.age || user.gender === undefined) {
    return res.status(400).send('Пожалуйста, укажите имя, возраст и пол пользователя.');
  }

  db.createUser(user.name, user.age, user.gender)
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.deleteUser(userId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}.`);
});
