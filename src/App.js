import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [timer, setTimer] = useState(localStorage.getItem('timer') || 0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem('password', password);
    localStorage.setItem('timer', timer);
  }, [password, timer]);

  const startTimer = () => {
    setShowPassword(false);
    setTimeout(() => {
      setShowPassword(true);
    }, timer * 1000); // タイマーは秒単位で設定
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Time Locking App</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter timer in seconds"
          value={timer}
          onChange={(e) => setTimer(Number(e.target.value))}
        />
        <button onClick={startTimer}>Start Timer</button>
        {showPassword && <p>Your password is: {password}</p>}
      </header>
    </div>
  );
}

export default App;