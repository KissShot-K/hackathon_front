'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'
import { Heart, MessageCircle, User, Activity } from 'lucide-react'




interface Tweet {
    id: number;
    content: string;
    likes_count: number;
    parent_id: number;
    fire_rate: string;
}

interface Reply {
    id: number;
    content: string;
    likes_count: number;
}

interface ParentTweet {
    id: number;
    content: string;
}

interface TweetsListProps {
    trigger: boolean; // trigger プロパティの型定義
}

const TweetsList: React.FC <TweetsListProps> = ({ trigger }) => {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [replyContent, setReplyContent] = useState<string>('');
    const [replies, setReplies] = useState<Reply[]>([]);
    const [selectedTweet, setSelectedTweet] = useState<ParentTweet | null>(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get<Tweet[]>('https://hackathon-back-2-297083343142.us-central1.run.app/tweet'); // バックエンド API へのリクエスト
                setTweets(response.data); // 取得したデータをステートに設定
            } catch (error) {
                console.error('Error fetching tweets:', error); // エラーハンドリング
            }
        };

        fetchTweets()
            .then(() => {
                console.log('Tweets fetched successfully.');
            })
            .catch((error) => {
                console.error('Error fetching tweets:', error);
            });
    }, [trigger]); // 初回レンダリング時にのみ実行

    const handleLike = async (tweetId: number) => {
        try {
            const response = await axios.post<{ likes_count: number }>(
                `http://localhost:8080/tweet/like?id=${tweetId}`
            );
            // いいねが成功したら、更新されたツイートリストを取得
            setTweets((prevTweets) =>
                prevTweets.map((tweet) =>
                    tweet.id === tweetId ? { ...tweet, likes_count: response.data.likes_count } : tweet
                )
            );
        } catch (error) {
            console.error('Error liking tweet:', error); // エラーハンドリング
        }
    };

    const fetchReplies = async (tweetId: number) => {
        try {
            const response = await axios.get<{ parent_tweet: ParentTweet; replies: Reply[] }>(
                `http://localhost:8080/tweet/replies?id=${tweetId}`
            );
            setSelectedTweet(response.data.parent_tweet);
            setReplies(response.data.replies);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleReplySubmit = async () => {
        if (!selectedTweet) return;

        try {
            await axios.post('http://localhost:8080/tweet/reply', {
                content: replyContent,
                parent_id: selectedTweet.id,
            });
            setReplyContent('');
            fetchReplies(selectedTweet.id);
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    return (


        <div className="min-h-screen flex flex-col items-center justify-center bg-green-600">
          
          {selectedTweet && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center p-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl max-w-xl w-full mx-4 mt-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Selected Speech</h2>
              <p className="text-white mb-4">{selectedTweet.content}</p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Replies</h3>
                <ul className="space-y-2">
                  {[...replies].reverse().map((reply) => (
                    <li key={reply.id} className="bg-white bg-opacity-20 rounded p-3">
                      <p className="text-white">{reply.content}</p>
                      <div className="flex items-center text-sm text-white mt-2">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{reply.likes_count} likes</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 space-y-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                  rows={3}
                />
                <button 
                  onClick={handleReplySubmit}
                  className="w-full bg-white text-green-800 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Reply
                </button>
              </div>
            </motion.div>
          )}
    
          
            <h2 className="text-2xl font-bold text-white mb-4">All Speeches</h2>
            <ul className="space-y-4">
              {[...tweets].reverse().map((tweet) => (
                <motion.li
                  key={tweet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        
                        <p className="text-gray-200 mt-1">{tweet.content}</p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t border-white border-opacity-20">
                      <button 
                        className="flex items-center text-white hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                        onClick={() => handleLike(tweet.id)}
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        <span>{tweet.likes_count}</span>
                      </button>
                      <button 
                        className="flex items-center text-white hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                        onClick={() => fetchReplies(tweet.id)}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        <span>View Replies</span>
                      </button>
                      <p className="text-gray-200 mt-1">FireRate:</p>
                      <p className="text-gray-200 mt-1">{tweet.fire_rate}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          
    
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 text-center pb-8"
          >
          
          </motion.div>
        </div>
      );
};

export default TweetsList;
