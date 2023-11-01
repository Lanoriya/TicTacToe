import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import logo from './imgs/logo.svg'
import exit from './imgs/exit.svg'
import './Navigation.css'

function Navigation() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isRating = location.pathname === '/rating';
  const isLink = location.pathname === '/active-players';
  const isHistory = location.pathname === '/game-history';
  const isPlayers = location.pathname === '/players-list';

  const homeLinkClass = classnames({
    'active-link': isHome,
  });

  const ratingLinkClass = classnames({
    'active-link': isRating,
  });

  const activeLinkClass = classnames({
    'active-link': isLink,
  });

  const historyLinkClass = classnames({
    'active-link': isHistory,
  });

  const playersLinkClass = classnames({
    'active-link': isPlayers,
  });

  const handleExitClick = () => {
    localStorage.clear();
  };

  return (
    <header className='header'>
      <nav>
        <a href='/'>
          <img className="header-logo" src={logo} alt="logo" />
        </a>
        <ul className='header-ul'>
          <li><Link to="/" className={homeLinkClass}>Игровое поле</Link></li>
          <li><Link to="/rating" className={ratingLinkClass}>Рейтинг</Link></li>
          <li><Link to="/active-players" className={activeLinkClass}>Активные игроки</Link></li>
          <li><Link to="/game-history" className={historyLinkClass}>История игр</Link></li>
          <li><Link to="/players-list" className={playersLinkClass}>Список игроков</Link></li>
        </ul>
        <a href='/' onClick={handleExitClick}>
          <img className="exit-logo" src={exit} alt="exit-logo" />
        </a>
      </nav>
    </header>
  );
}

export default Navigation;