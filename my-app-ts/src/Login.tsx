import { useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import {LoginForm} from "./LoginForm";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Timeline from './timeline'

const Login = () => {
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  
  // ログイン状態を監視して、stateをリアルタイムで更新する
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });
  
  return (
    <div className="text-center p-4 bg-green-100 min-h-screen text-black">
          <>
          
    
      <LoginForm />
      <br></br>
      {/* ログインしていないと見られないコンテンツは、loginUserがnullの場合表示しない */}
      {loginUser ? 
      
      <BrowserRouter>
      <ul>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8"
      > 
        <li>
                
      <div className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
       <Link to="/">Home</Link>
       </div>
          
        </li>
        <br></br>
        <li>
        <div className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <Link to="/timeline">Timeline</Link>
          </div>
        </li>
        </div>
      </ul>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/timeline">
          <Timeline />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
      
      
      
      : null}
    </>
    </div>
  );
};

export default Login;

function NotFound() {
    return <h2>Not Found Page</h2>;
  }

  function Home() {
    return <h2>Home</h2>;
  }
  
  