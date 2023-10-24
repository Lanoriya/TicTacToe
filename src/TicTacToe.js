import React, { useState } from 'react';
import './TicTacToe.css';
import XIcon from './imgs/X.svg';
import OIcon from './imgs/O.svg';

function TicTacToe({
  player1Name,
  player2Name,
  currentPlayerPiece,
  handleFirstMove,
  firstMoveMade,
  gameOver,
  setWinner,
  board,
  setGameOver,
}) {
  const [winningSquares, setWinningSquares] = useState([]);
  const [newBoard, setNewBoard] = useState([...board]);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    const updatedBoard = [...newBoard];

    if (calculateWinner(updatedBoard) || updatedBoard[i] || gameOver) return;

    if (!gameOver && !firstMoveMade) {
      handleFirstMove();
    }

    updatedBoard[i] = xIsNext ? 'X' : 'O';
    setNewBoard(updatedBoard);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(updatedBoard);
    if (winner) {
      const winningSquares = calculateWinningSquares(updatedBoard);
      setWinningSquares(winningSquares);
      setWinner(winner);
      setGameOver(true);
    }
  }

  const renderSquare = (i) => {
    const isWinningSquare = winningSquares.includes(i);

    return (
      <button className={`board-cell ${isWinningSquare ? (xIsNext ? 'win-x' : 'win-o') : ''}`} onClick={() => handleClick(i)}>
        {newBoard[i] === 'X' 
          ? 
          (<span><img className="icon" src={XIcon} alt="X" /></span>) : newBoard[i] === 'O' 
          ? 
          (<span><img className="icon" src={OIcon} alt="O" /></span>) : (null)}
      </button>
    );
  };

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

  let status;
  const winner = calculateWinner(newBoard);

  if (winner && !gameOver) {
    const newWinningSquares = calculateWinningSquares(newBoard);
    setWinningSquares(newWinningSquares);
    setGameOver(true);
    setWinner(winner);
  } else if (newBoard.every((square) => square)) {
    setGameOver(true);
    status = 'Ничья';
  } else {
    status = (
      <div className='board-turn'>
        <h2>Ходит</h2>
        {currentPlayerPiece === 'X' ? (
          <img className="icon-step" src={XIcon} alt="X" />
        ) : (
          <img className="icon-step" src={OIcon} alt="O" />
        )}
        <h2>{currentPlayerPiece === 'X' ? player1Name : player2Name}</h2>
      </div>
    );
  }

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
      <div className="status">{status}</div>
    </div>
  );
}

export default TicTacToe;
