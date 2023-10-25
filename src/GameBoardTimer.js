import React, { useState, useEffect } from 'react';

function GameBoardTimer({ firstMoveMade, gameOver, onNewGameStart }) {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    let intervalId;

    if (firstMoveMade && !gameOver) {
      intervalId = setInterval(() => {
        setTotalSeconds(totalSeconds => totalSeconds + 1);
      }, 1000);
    } else if (gameOver) {
      clearInterval(intervalId); // Остановка таймера при окончании игры
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [firstMoveMade, totalSeconds, gameOver]);

  useEffect(() => {
    if (onNewGameStart) {
      setTotalSeconds(0); // Сброс таймера при старте новой игры
    }
  }, [onNewGameStart]);

  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return (
    <div className="timer-container">
      <div className='board-timer'>
        {minutes}:{seconds}
      </div>
    </div>
  );
}

export default GameBoardTimer;
