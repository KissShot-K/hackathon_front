import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersList from './users.js';

function Timeline() {
    const [content, setTweet] = useState('');
  const [error, setError] = useState(null);

 
  if (error) return <div>{error}</div>;
  // フォーム送信時のハンドラ
  const handleSubmit = async (e :any ) => {
    e.preventDefault(); // ページのリロードを防ぐ

    const newTweet = { content }; // 入力されたデータをオブジェクトとして作成

    try {
      // API に新しいtweetを追加するための POST リクエスト
      const response = await axios.post('http://localhost:8000/users', newTweet);
      console.log('Tweet added:', response.data);
      // フォームのリセット
      setTweet('');
    } catch (error) {
      console.error('Error adding tweet:', error);
    }
  };

  return (
      <div className="App">

        {/* ツイート追加フォーム */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tweet">Speak!:</label>
            <input
                type="text"
                id="tweet"
                value={content}
                onChange={(e) => setTweet(e.target.value)}
                required
            />
          </div>
          <button type="submit">Post</button>
        </form>
        <div>
          <h1>Response Data:</h1>
          <UsersList/>
        </div>
      </div>
  );
}

export default Timeline;