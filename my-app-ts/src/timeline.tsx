import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tweet,Reply,ParentTweet } from './interface/tweet';
import TweetsList from './users';


function Timeline() {
  const [content, setTweet] = useState('');
  const [error, setError] = useState(null);
  const [trigger, setTrigger]=useState(false);

 
  if (error) return <div>{error}</div>;
  // フォーム送信時のハンドラ
  const handleSubmit = async (e :any ) => {
    e.preventDefault(); // ページのリロードを防ぐ

    const newTweet = { content }; // 入力されたデータをオブジェクトとして作成

    try {
      // API に新しい tweet を追加するための POST リクエスト
      const response = await axios.post<Tweet>('http://localhost:8080/tweet', newTweet);
  
      // レスポンスから新しいツイートデータを取得
      const addedTweet = response.data;
      console.log('Tweet added:', addedTweet.content);
  
      // フォームのリセット
      setTweet('');
      setTrigger(!trigger)
  } catch (error) {
      console.error('Error adding tweet:', error);
  }
  
  };

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      {/* ツイート追加フォーム */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8"
      >
        <div className="mb-6">
          <label
            htmlFor="tweet"
            className="block text-gray-700 font-medium mb-3"
          >
            Speak!:
          </label>
          <input
            type="text"
            id="tweet"
            value={content}
            onChange={(e) => setTweet(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Post
        </button>
      </form>
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          
        </h1>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <TweetsList trigger={trigger} />
        </div>
      </div>
    </div>
  );
  
  
}

export default Timeline;