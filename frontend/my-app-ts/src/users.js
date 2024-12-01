import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TweetsList = () => {
    const [tweets, setTweets] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [replies, setReplies] = useState([]);
    const [selectedTweet, setSelectedTweet] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tweet'); // バックエンド API へのリクエスト
                setTweets(response.data); // 取得したデータをステートに設定
            } catch (error) {
                console.error('Error fetching tweets:', error); // エラーハンドリング
            }
        };

        fetchUsers().then((data) => {
            console.log(data);
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }); // fetchUsers 関数を呼び出し

    }, []); // 初回レンダリング時にのみ実行
    const handleLike = async (tweetId) => {
        try {
            const response = await axios.post(`http://localhost:8000/tweet/like?id=${tweetId}`);
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

    const fetchReplies = async (tweetId) => {
        try {
            const response = await axios.get(`http://localhost:8000/tweet/replies?id=${tweetId}`);
            setSelectedTweet(response.data.parent_tweet);
            setReplies(response.data.replies);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleReplySubmit = async () => {
        try {
            await axios.post('http://localhost:8000/tweet/reply', {
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
        <div>
            <h1>tweet List</h1>
            <ul>
                {tweets.map(tweet => (
                    <li key={tweet.id}>
                      <p>{tweet.content}</p>
                        <p>Likes: {tweet.likes_count}</p>
                        <button onClick={() => handleLike(tweet.id)}>Like</button> {/* いいねボタン */}  
                        <button onClick={() => fetchReplies(tweet.id)}>View Replies</button>
                    </li>
                ))}
            </ul>
            {selectedTweet && (
                <div>
                    <h2>{selectedTweet.content}</h2>
                    <ul>
                        {replies.map(reply => (
                            <li key={reply.id}>{reply.content} (Likes: {reply.likes_count})</li>
                        ))}
                    </ul>
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <button onClick={handleReplySubmit}>Reply</button>
                    </div>
            )}
        </div>
    );
};

export default TweetsList;