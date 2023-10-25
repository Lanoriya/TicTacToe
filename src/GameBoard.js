import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import GameBoardTimer from './GameBoardTimer';
import TicTacToe from './TicTacToe';
import PlayerSetup from './PlayerSetup';
import XIcon from './imgs/X.svg';
import OIcon from './imgs/O.svg';
import Trophy from './imgs/trophy.png';

function GameBoard() {
  const [player1, setPlayer1] = useState({ name: '', selectedPiece: '' });
  const [player2, setPlayer2] = useState({ name: '', selectedPiece: '' });
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(true);
  const [xIsNext, setXIsNext] = useState(true);
  const [firstMoveMade, setFirstMoveMade] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winningSquares, setWinningSquares] = useState([]);
  const [newGameStarted, setNewGameStarted] = useState(false);
  const isDraw = false;

  // Функция для установки победителя
  const handleGlobalWinner = (winner) => {
    setWinner(winner);
  };

  useEffect(() => {
    // Проверка сохраненных данных игроков в локальном хранилище
    const savedPlayer1 = JSON.parse(localStorage.getItem('player1Data'));
    const savedPlayer2 = JSON.parse(localStorage.getItem('player2Data'));

    if (savedPlayer1) {
      setPlayer1(savedPlayer1);
    }

    if (savedPlayer2) {
      setPlayer2(savedPlayer2);
      setGameStarted(true);
      setModalVisible(false);
    }
  }, []);

  // Функция для завершения настройки игрока
  const handleSetupComplete = (playerData) => {
    if (currentPlayerIndex === 0) {
      setPlayer1(playerData);
      setCurrentPlayerIndex(1);
      localStorage.setItem('player1Data', JSON.stringify(playerData));
    } else if (currentPlayerIndex === 1) {
      setPlayer2(playerData);
      setGameStarted(true);
      setModalVisible(false);
      localStorage.setItem('player2Data', JSON.stringify(playerData));
    }
  };

  // Функция для обработки первого хода
  const handleFirstMove = () => {
    setFirstMoveMade(true);
  };

  // Функция для начала новой игры
  const handleNewGame = () => {
    setBoard(Array(9).fill(null)); // Сбрасываем доску
    setXIsNext(true);
    setWinningSquares([]);
    setGameOver(false);
    setWinner(null);
    setFirstMoveMade(false);
    setNewGameStarted(true);
  };

  return (
    <div className="container">
      {isModalVisible && (
        <div className="modal-window">
          {!gameStarted && (
            <PlayerSetup
              onSetupComplete={handleSetupComplete}
              playerIndex={currentPlayerIndex}
              selectedPiece={
                currentPlayerIndex === 0 ? player1.selectedPiece : player2.selectedPiece
              }
            />
          )}
        </div>
      )}
      {gameOver && (
        <div className="modal-window">
          <div className="modal-content">
            <img className="icon" src={Trophy} alt="O" />
            <h2>{winner} Победил!</h2>
            <button onClick={handleNewGame}>Новая игра</button>
          </div>
        </div>
      )}
      <div className="gamers-list aside-left">
        <aside className="aside-gamers">
          <div className="gamer">
            <img className="icon" src={OIcon} alt="O" />
            <div className="gamer-about">
              <h2>{player1.name}</h2>
              <p>Играет: {player1.selectedPiece}</p>
              <p>63% побед</p>
            </div>
          </div>
          <div className="gamer">
            <img className="icon" src={XIcon} alt="X" />
            <div className="gamer-about">
              <h2>{player2.name}</h2>
              <p>Играет: {player2.selectedPiece}</p>
              <p>23% побед</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="container container-content">
        <div className="board">
          <GameBoardTimer firstMoveMade={firstMoveMade} gameOver={gameOver} onNewGameStart={handleNewGame}/>
          <TicTacToe
            player1Name={player1.name}
            player2Name={player2.name}
            handleFirstMove={handleFirstMove}
            firstMoveMade={firstMoveMade}
            gameOver={gameOver}
            setGlobalWinner={handleGlobalWinner}
            board={board}
            setGlobalGameOver={setGameOver}
            handleNewGame={handleNewGame}
            isDraw={isDraw}
          />
          <div className="board-step"></div>
        </div>
      </div>
      <aside className="aside-right">213123</aside>
    </div>
  );
}

export default GameBoard;
