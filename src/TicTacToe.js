import React, { useState, useEffect } from 'react';
import './TicTacToe.css';
import XIcon from './imgs/X.svg';
import OIcon from './imgs/O.svg';
import Trophy from './imgs/trophy.png';
import axios from 'axios';

function TicTacToe({ players }) {
  const [board, setBoard] = useState(Array(9).fill(null)); // Состояние игровой доски
  const [isXNext, setIsXNext] = useState(true); // Определение текущего игрока (X или O)
  const [isGameStarted, setIsGameStarted] = useState(false); // Состояние для отслеживания начала игры
  const [isGameOver, setIsGameOver] = useState(false);
  const [winningSquares, setWinningSquares] = useState([]); // Победные линии
  const [time, setTime] = useState(0);
  const [startDate, setStartDate] = useState(null);

  // Загрузка статистики побед из localStorage
  const initialWins = JSON.parse(localStorage.getItem('playerWins')) || {
    X: 0,
    O: 0,
  };

  const [playerWins, setPlayerWins] = useState(initialWins);

  useEffect(() => {
    let timer;

    if (isGameStarted && !isGameOver) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGameStarted, isGameOver]);

  const handleClick = (index) => {
    if (board[index] || isGameOver) {
      return; // Игра завершена или клетка уже заполнена
    }
  
    if (!isGameStarted) {
      setStartDate(new Date()); // Устанавливаем дату начала первой игры
      setIsGameStarted(true); // Устанавливаем, что игра началась при первом ходе
    }
  
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  
    // Проверка на завершение игры
    const { winner, squares } = calculateWinner(newBoard);
    if (winner || newBoard.every((square) => square)) {
      setIsGameOver(true);
      setWinningSquares(squares);
  
      // Обновление статистики побед
      if (winner) {
        const updatedPlayerWins = { ...playerWins, [winner]: playerWins[winner] + 1 };
        setPlayerWins(updatedPlayerWins);
        // Сохранение статистики побед в localStorage
        localStorage.setItem('playerWins', JSON.stringify(updatedPlayerWins));
      }
  
      // Сохранение данных об игре
      saveGameData(winner ? players[winner].name : '');
    }
  };

  const renderSquare = (index) => {
    const symbol = board[index];
    const isWinningSquare = winningSquares.includes(index);
    const squareClass = isWinningSquare ? `square winning ${symbol} board-cell` : 'square board-cell';

    return (
      <div className={squareClass} onClick={() => handleClick(index)}>
        {symbol === 'X' ? <img src={XIcon} className="icon" alt="X" /> : symbol === 'O' ? <img src={OIcon} className="icon" alt="O" /> : null}
      </div>
    );
  };

  const renderStatus = () => {
    if (winningSquares.length > 0) {
      const winnerSymbol = board[winningSquares[0]];
      const winnerName = players[winnerSymbol].name;

      return (
        <div className="modal-window">
          <div className="modal-content">
            <img className="icon" src={Trophy} alt="Трофей" />
            <h2>{winnerName} Победил!</h2>
            <button className='new-game' onClick={handleNewGame}>Новая игра</button>
            <button className='back-to-menu' onClick={handleMainMenu}>Выйти в главное меню</button>
          </div>
        </div>
      );
    } else if (isGameOver) {
      return (
        <div className="modal-window">
          <div className="modal-content">
            <h2>Ничья!</h2>
            <button className='new-game' onClick={handleNewGame}>Новая игра</button>
            <button className='back-to-menu' onClick={handleMainMenu}>Выйти в главное меню</button>
          </div>
        </div>
      );
    } else {
      const currentPlayerSymbol = isXNext ? 'X' : 'O';
      const currentPlayerName = players[currentPlayerSymbol].name;
      
      return (
        <div className="status">
          Ходит {currentPlayerSymbol === 'X' ? (
            <img src={XIcon} className="icon" alt="X" />
          ) : (
            <img src={OIcon} className="icon" alt="O" />
          )} {currentPlayerName}
        </div>
      );
    }
  };

  const handleNewGame = () => {
    let winnerName = '';
    if (winningSquares.length > 0) {
      const winnerSymbol = board[winningSquares[0]];
      winnerName = players[winnerSymbol].name;
    }
  
    if (isGameStarted && !isGameOver) {
      saveGameData(winnerName);
    }
  
    setStartDate(new Date());
  
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsGameOver(false);
    setWinningSquares([]);
    setTime(0);
  };

  const saveGameData = (winnerName) => {
    if (startDate) {
      const endDate = new Date();
      const gameTime = Math.round((endDate - startDate) / 1000); // Время игры в секундах

      // Формируем объект с данными об игре
      const gameData = {
        playerX: players.X.name,
        playerO: players.O.name,
        winner: winnerName,
        date: startDate.toISOString(), // Преобразуем дату в строку в формате ISO
        time: gameTime,
      };
      axios
      .post('http://localhost:3001/api/saveGame', gameData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((response) => {
        console.log('Game data saved successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error while saving game data:', error);
      });
    }
  };

  const handleMainMenu = () => {
    localStorage.clear();
    window.location.reload();
  };

  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  return (
    <div className="board-game">
      <div className="timer-container">
        <div className="board-timer">
          {minutes}:{seconds}
        </div>
      </div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {renderStatus()}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], squares: [a, b, c] };
    }
  }
  return { winner: null, squares: [] };
}

export default TicTacToe;
