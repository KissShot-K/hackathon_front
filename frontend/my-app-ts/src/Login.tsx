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
    <>
      <LoginForm />
      {/* ログインしていないと見られないコンテンツは、loginUserがnullの場合表示しない */}
      {loginUser ? 
      
      <BrowserRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/timeline">Timeline</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/timeline">
          <Timeline />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
      
      
      
      : null}
    </>
  );
};

export default Login;

function NotFound() {
    return <h2>Not Found Page</h2>;
  }

  function Home() {
    return <h2>Home</h2>;
  }
  
  