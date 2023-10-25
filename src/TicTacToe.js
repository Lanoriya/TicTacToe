import React, { useState, useEffect } from 'react';
import './TicTacToe.css';
import XIcon from './imgs/X.svg';
import OIcon from './imgs/O.svg';

function TicTacToe({
  player1Name,
  player2Name,
  handleFirstMove,
  firstMoveMade,
  gameOver,
  setGlobalWinner,
  board,
  setGlobalGameOver,
  handleNewGame,
}) {
  const [winningSquares, setWinningSquares] = useState([]);
  const [newBoard, setNewBoard] = useState([...board]);
  const [currentPlayerPiece, setCurrentPlayerPiece] = useState('X');
  const [isDraw, setIsDraw] = useState(false);

  const calculateWinningSquares = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }

    return [];
  };

  const calculateDraw = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }
  
    return board.every((square) => square);
  };

  const calculateWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  useEffect(() => {
    if (calculateDraw(board)) {
      setIsDraw(true);
      setGlobalGameOver(true);
      setGlobalWinner(null);
    }
  }, [board]);

  const handleClick = (i) => {
    const updatedBoard = [...newBoard];
    let winner = null;

    if (calculateWinner(updatedBoard) || updatedBoard[i] || gameOver) return;

    if (!gameOver && !firstMoveMade) {
      handleFirstMove();
    }

    if (updatedBoard.every((square) => square)) {
      setIsDraw(true);
      const winningSquares = calculateWinningSquares(updatedBoard);
      setWinningSquares(winningSquares);
      setGlobalGameOver(true);
      setGlobalWinner(winner);
    }

    updatedBoard[i] = currentPlayerPiece;
    setNewBoard(updatedBoard);
    setCurrentPlayerPiece(currentPlayerPiece === 'X' ? 'O' : 'X')

    winner = calculateWinner(updatedBoard);
    if (winner) {
      setIsDraw(false);
      setGlobalGameOver(true);
      setGlobalWinner(winner);
    } else {
      setCurrentPlayerPiece(currentPlayerPiece === 'X' ? 'O' : 'X');
    }
  };

  const renderSquare = (i) => {
    const isWinningSquare = winningSquares.includes(i);
    const isWinningPiece = isWinningSquare && newBoard[i] === 'O';

    return (
      <button
        className={`board-cell ${isWinningSquare ? 'win-x' : ''} ${
          isWinningPiece ? 'win-o' : ''
        }`}
        onClick={() => handleClick(i)}
      >
        {newBoard[i] === 'X' ? (
          <span>
            <img className="icon" src={XIcon} alt="X" />
          </span>
        ) : newBoard[i] === 'O' ? (
          <span>
            <img className="icon" src={OIcon} alt="O" />
          </span>
        ) : null}
      </button>
    );
  };

  useEffect(() => {
    if (gameOver) {
      setNewBoard([...Array(9).fill(null)]);
      setCurrentPlayerPiece('X');
      setWinningSquares([]);
    }
  }, [gameOver]);

  if (!gameOver) {
    return (
      <div className="board-game">
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
        <div className="board-turn">
          <h2>Ходит</h2>
          {currentPlayerPiece === 'X' ? (
            <img className="icon-step" src={XIcon} alt="X" />
          ) : (
            <img className="icon-step" src={OIcon} alt="O" />
          )}
          <h2>{currentPlayerPiece === 'X' ? player2Name : player1Name}</h2>
        </div>
      </div>
    );
  } 
  else if (gameOver && isDraw) {
    console.log('1233333')
    return (
      <div className="board-game">
        <div className="modal-contenter">
          <h2>Ничья!</h2>
          <button className='new-game' onClick={handleNewGame}>Новая игра</button>
          <button className='back-to-menu' onClick={() => {localStorage.clear(); window.location.reload()}}>Выйти в главное меню</button>
        </div>
      </div>
    );
  }
}

export default TicTacToe;
