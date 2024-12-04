import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { fireAuth } from "./firebase";
import { motion } from 'framer-motion'

export const LoginForm: React.FC = () => {
  /**
   * googleでログインする
   */
  const signInWithGoogle = (): void => {
    // Google認証プロバイダを利用する
    const provider = new GoogleAuthProvider();

    // ログイン用のポップアップを表示
    signInWithPopup(fireAuth, provider)
      .then(res => {
        const user = res.user;
        alert("ログインユーザー: " + user.displayName);
      })
      .catch(err => {
        const errorMessage = err.message;
        alert(errorMessage);
      });
  };

  /**
   * ログアウトする
   */
  const signOutWithGoogle = (): void => {
    signOut(fireAuth).then(() => {
      alert("ログアウトしました");
    }).catch(err => {
      alert(err);
    });
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-green-100">

      <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className=" text-center p-10 bg-white backdrop-blur-lg rounded-xl max-w-2xl w-full mx-10 mt-8"
            >
      <button onClick={signInWithGoogle} className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Googleでログイン
      </button>
      <br></br>
      <br></br>
      <button onClick={signOutWithGoogle} className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        ログアウト
      </button>
      </motion.div>
    </div>
    </div>
  );
};

