import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Login';
import Navigation from './Navigation';
import GameBoard from './GameBoard';
import Rating from './Rating';
import ActivePlayers from './ActivePlayers';
import GameHistory from './GameHistory';
import PlayersList from './PlayersList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      // Отправьте запрос на сервер для проверки токена
      fetch('http://localhost:3001/api/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.userId) {
          setIsAuthenticated(true); // Устанавливаем isAuthenticated в true после успешной аутентификации
        }
      })
      .catch(error => {
        console.error('Error verifying token:', error);
      });
    }
  }, []);

  return (
    isAuthenticated ? (
      <>
        <Navigation />
        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/active-players" element={<ActivePlayers />} />
          <Route path="/game-history" element={<GameHistory />} />
          <Route path="/players-list" element={<PlayersList />} />
        </Routes>
      </>
    ) : (
      <Login />
    )
  );
}

export default App;
