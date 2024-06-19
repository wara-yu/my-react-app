import React, { useState, useEffect } from 'react';
import './App.css';
import moment from 'moment';

function App() {
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [timerValue, setTimerValue] = useState(0);
  const [timerUnit, setTimerUnit] = useState('seconds');
  const [timerSeconds, setTimerSeconds] = useState(parseInt(localStorage.getItem('timerSeconds'), 10) || 0);
  const [showPassword, setShowPassword] = useState(localStorage.getItem('showPassword') === 'true');
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(parseInt(localStorage.getItem('startTime'), 10) || null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [disableStartButton, setDisableStartButton] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false); // タイマーが0になったフラグ

  const convertToSeconds = (value, unit) => {
    switch (unit) {
      case 'seconds':
        return value;
      case 'minutes':
        return value * 60;
      case 'hours':
        return value * 60 * 60;
      case 'days':
        return value * 60 * 60 * 24;
      default:
        return 0;
    }
  };

  const calculateTimerSeconds = () => {
    return convertToSeconds(timerValue, timerUnit);
  };

  useEffect(() => {
    localStorage.setItem('password', password);
    localStorage.setItem('timerSeconds', timerSeconds);
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('showPassword', showPassword);
  }, [password, timerSeconds, startTime, showPassword]);

  useEffect(() => {
    let timerInterval;

    if (timerRunning && startTime !== null) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(timerSeconds * 1000 - elapsedTime, 0);

      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        setShowPassword(true);
        setTimerRunning(false);
        setTimerFinished(true); // タイマーが0になったことを設定
        localStorage.removeItem('startTime'); // タイマー終了時にstartTimeを削除
      } else {
        timerInterval = setInterval(() => {
          setTimeLeft((prevTimeLeft) => Math.max(prevTimeLeft - 1000, 0));
        }, 1000);
      }
    }

    return () => clearInterval(timerInterval);
  }, [timerRunning, startTime, timerSeconds]);

  const startTimer = () => {
    if (timerRunning || disableStartButton) return; // タイマーが走っている間はボタンを無効化

    const confirmed = window.confirm(getConfirmationMessage());
    if (!confirmed) return;

    setShowPassword(false);
    const now = Date.now();
    setStartTime(now);
    setTimerSeconds(calculateTimerSeconds());
    setTimerRunning(true);
    setDisableStartButton(true); // タイマーが走り始めたらボタンを無効化
    localStorage.setItem('startTime', now); // タイマー開始時にstartTimeを保存
    localStorage.setItem('showPassword', false); // タイマーがスタートしたらパスワードを非表示に
    setTimerFinished(false); // タイマーがスタートしたらリセット可能状態にする
  };

  const getConfirmationMessage = () => {
    const endTime = moment(Date.now() + calculateTimerSeconds() * 1000).format('YYYY年MM月DD日 HH時mm分ss秒');
    return `タイマーを${formatTime(calculateTimerSeconds() * 1000)}セットします。\n終了時刻は${endTime}です。`;
  };

  const formatTime = (ms) => {
    if (ms === null) return '';
    const seconds = Math.ceil(ms / 1000);
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    let timeString = '';
    if (days > 0) timeString += `${days}日 `;
    if (hours > 0 || days > 0) timeString += `${hours}時間 `;
    if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}分 `;
    timeString += `${remainingSeconds}秒`;

    return `残り時間: ${timeString}`;
  };

  const resetTimer = () => {
    // タイマーが0の状態でのみリセット可能
    if (timerFinished) {
      setTimerValue(0);
      setTimerUnit('seconds');
      setTimerSeconds(0);
      setShowPassword(false);
      setTimerRunning(false);
      setDisableStartButton(false);
      setStartTime(null);
      setTimerFinished(false);
      localStorage.removeItem('startTime');
    }
  };

  useEffect(() => {
    const savedStartTime = parseInt(localStorage.getItem('startTime'), 10);
    if (savedStartTime) {
      const elapsedTime = Date.now() - savedStartTime;
      const remainingTime = Math.max(timerSeconds * 1000 - elapsedTime, 0);
      if (remainingTime > 0) {
        setStartTime(savedStartTime);
        setTimeLeft(remainingTime);
        setTimerRunning(true);
        setDisableStartButton(true); // タイマーが走っている間はボタンを無効化
      } else {
        setShowPassword(true); // タイマーが0秒になった時にパスワードを表示
        setTimerRunning(false);
        setTimerFinished(true); // タイマーが0になったことを設定
        localStorage.removeItem('startTime'); // タイマー終了時にstartTimeを削除
      }
    }
  }, [timerSeconds]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Time Locking App</h1>
        <input
          type="password"
          placeholder="パスワードを入力してください"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <input
            type="number"
            placeholder="時間を入力してください"
            value={timerValue}
            onChange={(e) => setTimerValue(parseInt(e.target.value, 10))}
            disabled={timerRunning} // タイマーが走っている間は無効化
          />
          <select 
            value={timerUnit} 
            onChange={(e) => setTimerUnit(e.target.value)} 
            disabled={timerRunning} // タイマーが走っている間は無効化
          >
            <option value="seconds">秒</option>
            <option value="minutes">分</option>
            <option value="hours">時間</option>
            <option value="days">日</option>
          </select>
        </div>
        <button onClick={startTimer} disabled={disableStartButton || timerRunning}>タイマーをスタート</button>
        <button onClick={resetTimer} disabled={!timerFinished}>リセット</button>
        {timerRunning && <p>{formatTime(timeLeft)}</p>}
        {showPassword && <p>あなたのパスワードは: {password}</p>}
      </header>
    </div>
  );
}

export default App;