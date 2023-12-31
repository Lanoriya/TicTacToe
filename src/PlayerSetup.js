import React, { useState } from 'react';
import './PlayerSetup.css';
import modalMan from './imgs/modal-man.png';
import modalWoman from './imgs/modal-woman.png';

function PlayerSetup({ isOpen, onClose, onSetupComplete, piece }) {
  const [playerData, setPlayerData] = useState({ name: '', selectedPiece: piece, age: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'age') {
      const ageValue = parseInt(value, 10);
  
      if (!isNaN(ageValue) && ageValue >= 1 && ageValue <= 99) {
        setPlayerData({
          ...playerData,
          [name]: ageValue,
        });
      }
    } else if (name === 'name') {
      const sanitizedValue = value.replace(/[^A-Za-zА-Яа-я\s]/g, '');
      const formattedValue = sanitizedValue.replace(/\s+/g, ' ');
      setPlayerData({
        ...playerData,
        [name]: formattedValue,
      });
    } else {
      setPlayerData({
        ...playerData,
        [name]: value,
      });
    }
  };

  const handleSetupClick = () => {
    onSetupComplete(playerData.name);
  };

  return (
    isOpen && (
      <div className='modal-window'>
        <div className="modal-player">
          <button className='modal-svg' onClick={(e) => { e.preventDefault(); onClose(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18.2997 5.71C17.9097 5.32 17.2797 5.32 16.8897 5.71L11.9997 10.59L7.10973 5.7C6.71973 5.31 6.08973 5.31 5.69973 5.7C5.30973 6.09 5.30973 6.72 5.69973 7.11L10.5897 12L5.69973 16.89C5.30973 17.28 5.30973 17.91 5.69973 18.3C6.08973 18.69 6.71973 18.69 7.10973 18.3L11.9997 13.41L16.8897 18.3C17.2797 18.69 17.9097 18.69 18.2997 18.3C18.6897 17.91 18.6897 17.28 18.2997 16.89L13.4097 12L18.2997 7.11C18.6797 6.73 18.6797 6.09 18.2997 5.71Z" fill="#373745" />
            </svg>
          </button>
          <h2>Добавьте {piece} игрока</h2>
          <div className="modal-block">
            <label htmlFor={`name${piece}`}>ФИО</label>
            <input
              type="text"
              placeholder="Иванов Иван Иванович"
              id={`name${piece}`}
              name="name"
              value={playerData.name}
              onChange={handleInputChange}
            />
            <div className='modal-settings'>
              <div className='age'>
                <p>Возраст</p>
                <input type='text' name='age' placeholder='0' value={playerData.age} onChange={handleInputChange} />
              </div>
              <div className='sex'>
                <p>Пол</p>
                <div className='sex-gender'>
                  <form>
                    <label htmlFor="woman" className="img-radio womanImg">
                      <input type="radio" id="woman" name="gender" value="жен" checked={playerData.gender === "жен"} onChange={handleInputChange} />
                      <img src={modalWoman} alt="Woman" />
                    </label>
                    <label htmlFor="man" className="img-radio manImg">
                      <input type="radio" id="man" name="gender" value="муж" checked={playerData.gender === "муж"} onChange={handleInputChange} />
                      <img src={modalMan} alt="Man" />
                    </label>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='registration'>
            <button onClick={handleSetupClick}>Добавить</button>
          </div>
        </div>
      </div>
    )
  );
}

export default PlayerSetup;
