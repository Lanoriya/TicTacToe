import React, { useState } from 'react';
import './GameBoard.css';
import XIcon from './imgs/X.svg';
import OIcon from './imgs/O.svg';
import PlayerSetup from './PlayerSetup';
import TicTacToe from './TicTacToe';
import Chat from './Chat';

function GameBoard() {
  // Загрузка данных игроков из localStorage
  const initialPlayers = JSON.parse(localStorage.getItem('players')) || {
    X: { name: null, selectedPiece: 'X' },
    O: { name: null, selectedPiece: 'O' },
  };

  const initialPlayerWins = JSON.parse(localStorage.getItem('playerWins')) || {
    X: 0,
    O: 0,
  };

  // Объединение initialPlayers и initialPlayerWins
  const initialCombinedPlayers = {
    X: {
      ...initialPlayers.X,
      wins: initialPlayers.X.wins + initialPlayerWins.X,
    },
    O: {
      ...initialPlayers.O,
      wins: initialPlayers.O.wins + initialPlayerWins.O,
    },
  };

  const [playerWins, setPlayerWins] = useState(initialPlayerWins);
  const totalGames = playerWins.X + playerWins.O;
  const playerXWinPercentage = totalGames > 0 ? ((initialCombinedPlayers.X.wins / totalGames) * 100).toFixed(2) : 0;
  const playerOWinPercentage = totalGames > 0 ? ((initialCombinedPlayers.O.wins / totalGames) * 100).toFixed(2) : 0;
  const [players, setPlayers] = useState(initialCombinedPlayers);

  // Определение, нужно ли показывать модальное окно для "X"
  const showPlayerInputModalX = !players.X.name && !players.O.name;

  // Определение, нужно ли показывать модальное окно для "O"
  const showPlayerInputModalO = !players.O.name && players.X.name;

  const handlePlayerInputSubmit = (name, symbol) => {
    // Обновление данных игроков, включая победы
    const updatedPlayers = {
      ...players,
      [symbol]: {
        ...players[symbol],
        name,
        wins: players[symbol].wins + initialPlayerWins[symbol],
      },
    };

    setPlayers(updatedPlayers);

    // Сохранение обновленных данных игроков в localStorage
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  }

  return (
    <div className='container'>
      {showPlayerInputModalX && (
        <PlayerSetup
          isOpen={showPlayerInputModalX}
          onClose={() => {}}
          onSetupComplete={(name) => handlePlayerInputSubmit(name, 'X')}
          piece="X"
        />
      )}
      {showPlayerInputModalO && (
        <PlayerSetup
          isOpen={showPlayerInputModalO}
          onClose={() => {}}
          onSetupComplete={(name) => handlePlayerInputSubmit(name, 'O')}
          piece="O"
        />
      )}
      <div className="gamers-list aside-left">
        <aside className="aside-gamers">
          {['X', 'O'].map((symbol) => (
            <div className="gamer" key={symbol}>
              <img className="icon" src={symbol === 'X' ? XIcon : OIcon} alt={symbol} />
              <div className="gamer-about">
                <h2>{players[symbol].name || `Игрок ${symbol}`}</h2>
                <p>{`${(players[symbol].wins !== null && players[symbol].wins !== undefined && !isNaN(players[symbol].wins)) ? players[symbol].wins : 0 } побед (${symbol === 'X' ? playerXWinPercentage : playerOWinPercentage}%)`}</p>
              </div>
            </div>  
          ))}
        </aside>
      </div>
      <div className="container container-content">
        <TicTacToe players={players}/>
      </div>
      <aside className="aside-right">
        <Chat players={players} />
      </aside>
    </div>
  );
}

export default GameBoard;
