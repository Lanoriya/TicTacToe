import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import Send from './imgs/send.svg';

function Chat({ players }) {
  const [message, setMessage] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSendMessage = () => {
    if (message && selectedPlayer) {
      const playerName = players[selectedPlayer].name || players[selectedPlayer].selectedPiece;
      const playerColor = players[selectedPlayer].selectedPiece === 'X' ? '#60C2AA' : '#E38BAC';
      const currentTime = getCurrentTime();
      const newMessage = {
        playerName,
        playerColor,
        message,
        time: currentTime,
      };
      const updatedMessages = [...chatMessages, newMessage];
      setChatMessages(updatedMessages);
      setMessage('');
      saveMessagesToLocalStorage(updatedMessages);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const saveMessagesToLocalStorage = (messages) => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  };

  const loadMessagesFromLocalStorage = () => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages));
    }
  };

  useEffect(() => {
    loadMessagesFromLocalStorage();
  }, []);

  return (
    <div className="chat">
      <div className="chat-messages" ref={messagesContainerRef}>
        {chatMessages.length > 0 ? (
          chatMessages.map((chatMessage, index) => (
            <div
              className="message"
              key={index}
              style={{
                marginLeft: chatMessage.playerColor === '#60C2AA' ? '0' : 'auto',
                borderRadius: chatMessage.playerColor === '#60C2AA' ? '16px 16px 16px 0px' : '16px 16px 0 16px',
              }}
            >
              <div className="message-about">
                <span style={{ color: chatMessage.playerColor }}>
                  {chatMessage.playerName}
                </span>
                <div className="message-time">{chatMessage.time}</div>
              </div>
              <div className="message-text">
                {chatMessage.message}
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">Сообщений еще нет.</div>
        )}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn" onClick={handleSendMessage}>
          <img className="sendImg" src={Send} alt="sendImg" />
        </button>
      </div>
      <div className="player-selection">
        {Object.keys(players).map((symbol) => (
          <button
            key={symbol}
            onClick={() => setSelectedPlayer(symbol)}
            style={{ color: players[symbol].selectedPiece === 'X' ? '#60C2AA' : '#E38BAC' }}
          >
            {players[symbol].name || players[symbol].selectedPiece}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Chat;
