import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import GameBoardTimer from './GameBoardTimer';
import TicTacToe from './TicTacToe';
import PlayerSetup from './PlayerSetup';

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

  useEffect(() => {
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

  const handleFirstMove = () => {
    setFirstMoveMade(true);
  };

  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinningSquares([]);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className='container'>
      {isModalVisible && (
      <div className='modal-window'>
        {!gameStarted && (
          <PlayerSetup
            onSetupComplete={handleSetupComplete}
            playerIndex={currentPlayerIndex}
            selectedPiece={currentPlayerIndex === 0 ? player1.selectedPiece : player2.selectedPiece}
          />
        )}
        </div>
      )}
      <div className='gamers-list aside-left'>
        <aside className='aside-gamers'>
          <div className='gamer'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="12" stroke="url(#paint0_radial_16_161)" strokeWidth="6" />
              <defs>
                <radialGradient id="paint0_radial_16_161" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15 15) rotate(90) scale(12)">
                  <stop stopColor="#EB0057" />
                  <stop offset="1" stopColor="#E38BAC" />
                </radialGradient>
              </defs>
            </svg>
            <div className='gamer-about'>
              <h2>{player1.name}</h2>
              <p>Играет: {player1.selectedPiece}</p>
              <p>63% побед</p>
            </div>
          </div>
          <div className='gamer'>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <g filter="url(#filter0_i_17_179)">
                <path d="M25.1747 0.843519C24.0743 -0.256903 22.2943 -0.256903 21.1939 0.843519L13.7078 8.3143C13.3172 8.70414 12.6846 8.70382 12.2943 8.31357L4.80608 0.825316C3.70566 -0.275105 1.92574 -0.275105 0.825316 0.825316C-0.275105 1.92574 -0.275105 3.70566 0.825316 4.80608L8.31213 12.2929C8.70265 12.6834 8.70265 13.3166 8.31213 13.7071L0.825317 21.1939C-0.275105 22.2943 -0.275105 24.0743 0.825316 25.1747C1.92574 26.2751 3.70566 26.2751 4.80608 25.1747L12.2929 17.6879C12.6834 17.2973 13.3166 17.2973 13.7071 17.6879L21.1939 25.1747C22.2943 26.2751 24.0743 26.2751 25.1747 25.1747C26.2751 24.0743 26.2751 22.2943 25.1747 21.1939L17.6879 13.7071C17.2973 13.3166 17.2973 12.6834 17.6879 12.2929L25.1747 4.80608C26.2569 3.72386 26.2569 1.92574 25.1747 0.843519Z" fill="#60C2AA" />
              </g>
              <defs>
                <filter id="filter0_i_17_179" x="0" y="0" width="27" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="1" dy="2" />
                  <feGaussianBlur stdDeviation="1" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.311889 0 0 0 0 0.612384 0 0 0 0 0.54168 0 0 0 0.6 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_17_179" />
                </filter>
              </defs>
            </svg>
            <div className='gamer-about'>
              <h2>{player2.name}</h2>
              <p>Играет: {player2.selectedPiece}</p>
              <p>23% побед</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="container container-content">
        <div className="board">
          <GameBoardTimer firstMoveMade={firstMoveMade} gameOver={gameOver} />
          <TicTacToe
            player1Name={player1.name}
            player2Name={player2.name}
            currentPlayerPiece={xIsNext ? player1.selectedPiece : player2.selectedPiece}
            handleFirstMove={handleFirstMove}
            firstMoveMade={firstMoveMade}
            gameOver={gameOver}
            setWinner={setWinner}
            board={board}
            setBoard={setBoard}
            winningSquares={winningSquares}
            setWinningSquares={setWinningSquares}
            setGameOver={setGameOver}
            xIsNext={xIsNext}
          />
          {gameOver && (
            <div className='modal-window'>
              <div className='modal-content'>
                <h2>Победитель: {winner}</h2>
                <button onClick={handleNewGame}>Новая игра</button>
              </div>
            </div>
          )}
          <div className="board-step"></div>
        </div>
      </div>
      <aside className='aside-right'>
        213123
      </aside>
    </div>
  );
}

export default GameBoard;
