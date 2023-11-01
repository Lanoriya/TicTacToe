import React, { useState, useEffect } from 'react';
import './Login.css';
import loginLogo from './imgs/login.png';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  useEffect(() => {
    setIsInputEmpty(!login || !password); // Проверка, есть ли текст в полях ввода
  }, [login, password]);

  const handleLogin = async () => {
    setLoginError('');
    setPasswordError('');

    if (!login) {
      setLoginError('Неверный логин');
    }
  
    if (!password) {
      setPasswordError('Неверный пароль');
    }
  
    if (login && password) {
      try {
        // Отправить запрос на сервер для проверки логина и пароля
        const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, password }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          const authToken = data.token;
  
          // Сохраняем токен в локальном хранилище
          localStorage.setItem('auth_token', authToken);
          window.location.reload();
        } else if (response.status === 401) {
          const errorMessage = await response.text(); // Получите текст ошибки
          if (errorMessage === 'Неверный логин') {
            setLoginError('Неверный логин');
          } else if (errorMessage === 'Неверный пароль') {
            setPasswordError('Неверный пароль');
          }
        } else {
          // Обработка других ошибок аутентификации
          console.error('Authentication failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <div className='container-login'>
      <div className='login-box'>
        <img className='login-logo' width={'132px'} src={loginLogo} alt="loginLogo"/>
        <h2>Войдите в игру</h2>
        <form>
          <div>
            <input
              type="text"
              placeholder='Логин'
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              style={{ border: loginError ? '1px solid #E93E3E' : '' }}
            />
            {loginError && <p style={{ color: '#E93E3E' }}>{loginError}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder='Пароль'
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: passwordError ? '1px solid #E93E3E' : '' }}
            />
            {passwordError && <p style={{ color: '#E93E3E' }}>{passwordError}</p>}
          </div>
          <button type="button" onClick={handleLogin} style={{ background: isInputEmpty ? 'rgba(96, 194, 170, 0.30)' : '#60C2AA' }}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
