import React, { useState } from 'react';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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
