import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import GameBoard from './GameBoard';
import Rating from './Rating';
import ActivePlayers from './ActivePlayers';
import GameHistory from './GameHistory';
import PlayersList from './PlayersList';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    fetch('http://localhost:3001/users')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Ошибка при получении пользователей:', error);
        setUsers([]);
      });
  }

  function createUser() {
    let surname = prompt('Фамилия');
    let name = prompt('Имя');
    let middlename = prompt('Отчество');

    // Проверка на существующего пользователя
    const existingUser = users.find(user => (
      user.surname === surname && user.name === name && user.middlename === middlename
    ));

    if (existingUser) {
      alert('Пользователь уже существует.');
      setCurrentUser(existingUser);
      return;
    }

    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ surname, name, middlename }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert('Пользователь успешно добавлен');
        setCurrentUser(data); // Устанавливаем текущего пользователя
        getUsers();
      })
      .catch(error => {
        console.error('Ошибка при создании пользователя:', error);
        alert('Ошибка при создании пользователя');
      });
  }

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={<GameBoard currentUser={currentUser} />} // Передаем currentUser в GameBoard
        />
        <Route path="/rating" element={<Rating />} />
        <Route path="/active-players" element={<ActivePlayers />} />
        <Route path="/game-history" element={<GameHistory />} />
        <Route path="/players-list" element={<PlayersList users={users} />} />
      </Routes>
    </Router>
  );
}

export default App;
