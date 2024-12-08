// App.js
import React, { useState, useEffect } from "react";
import { fireAuth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion } from 'framer-motion'
import {LoginForm} from "./LoginForm";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Timeline from './timeline'

const App = () => {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(fireAuth, provider);
      const { uid, displayName, email, photoURL } = result.user;

      // Firestoreの"user"コレクションにデータを保存
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid,
          displayName,
          email,
          photoURL,
          createdAt: new Date(),
        });
      }

      setUser(result.user);
    } catch (error) {
      console.error("Google Login Error: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center p-10 bg-white backdrop-blur-lg rounded-xl max-w-2xl w-full mx-10 mt-8"
      >
        
        
       
        {!user ? (
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Googleでログイン
          </button>
         
        ) : (
          <>
          <LoginForm />
            <BrowserRouter>
              <ul>
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                  <li>
                    <div className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <Link to="/">Home</Link>
                    </div>
                  </li>
                  <br />
                  <li>
                    <div className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <Link to="/timeline">Timeline</Link>
                    </div>
                  </li>
                </div>
              </ul>
              <Switch>
                <Route exact path="/">
                  <Home user={user} />
                </Route>
                <Route exact path="/timeline">
                  <Timeline />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </BrowserRouter>
          </>
        )}
      </motion.div>
    </div>
  );
};  

const Home = ({ user }) => {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-100 to-purple-200 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center p-10 bg-white bg-opacity-90 shadow-lg rounded-xl max-w-xl w-full mx-5"
          >
            <div className="flex flex-col items-center">
              <motion.img
                src={user.photoURL}
                alt="User Avatar"
                className="w-24 h-24 rounded-full shadow-md border-4 border-blue-300"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
              <h1 className="text-2xl font-semibold text-gray-800 mt-4">
                ホーム画面
              </h1>
              <p className="text-lg text-gray-600 mt-2">名前: {user.displayName}</p>
              <p className="text-lg text-gray-600">メール: {user.email}</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };
  

export default App;

function NotFound() {
    return <h2>Not Found Page</h2>;
  }
