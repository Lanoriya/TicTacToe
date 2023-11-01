import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameHistory.css';
import XIcon from './imgs/X.svg';
import OIcon from './imgs/O.svg';
import Trophy from './imgs/win-trophy.png';

function GameHistory() {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const [games, setGames] = useState([]);

  useEffect(() => {
    // Загрузка данных об играх из сервера
    axios
      .get('http://localhost:3001/api/games', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((response) => {
        // Обработайте полученные данные и обновите состояние вашего компонента
        setGames(response.data);
      })
      .catch((error) => {
        // Обработка ошибок
        console.error('Ошибка при получении данных об играх:', error);
      });
  }, []);

  return (
    <div className="container gameHistory">
      <h2>История игр</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="1">Игроки</th>
              <th colSpan="2">Дата</th>
              <th colSpan="2">Время игры</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={index}>
                <td colSpan="1" className="td-players">
                  <div className="name">
                    {game.winner === game.player_o_name ? (
                      <>
                        <img className="icon" src={OIcon} alt="Нолик" />
                        {game.player_o_name}
                        <img className="icon-win" src={Trophy} alt="Победитель" />
                      </>
                    ) : (
                      <>
                        <img className="icon" src={OIcon} alt="Нолик" />
                        {game.player_o_name}
                      </>
                    )}
                  </div>
                  <div className="vs">
                    <span style={{ fontWeight: 'bold' }}>против</span>
                  </div>
                  <div className="name">
                    {game.winner === game.player_x_name ? (
                      <>
                        <img className="icon" style={{width:"16px", height:"16px"}} src={XIcon} alt="Крестик" />
                        {game.player_x_name}
                        <img className="icon-win" src={Trophy} alt="Победитель" />
                      </>
                    ) : (
                      <>
                        <img className="icon" style={{width:"16px", height:"16px"}} src={XIcon} alt="Крестик" />
                        {game.player_x_name}
                      </>
                    )}
                  </div>
                </td>
                <td colSpan="2">
                  {new Date(game.game_date).getDate()}{' '}
                  {months[new Date(game.game_date).getMonth()]}{' '}
                  {new Date(game.game_date).getFullYear()}
                </td>
                <td colSpan="2">
                  {`${Math.floor(game.game_duration / 60)} мин ${game.game_duration % 60} сек`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameHistory;
