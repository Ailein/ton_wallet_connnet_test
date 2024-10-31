import  { useContext, useEffect, useState } from "react";
import { BackendTokenContext } from "./BackendTokenContext";
import WebApp from "@twa-dev/sdk"; // Assuming this is the Telegram Web App SDK
import "./Login.css"; // 引入CSS样式文件



function Login() {
  const { setToken } = useContext(BackendTokenContext);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [token, setLocalToken] = useState<string | null>(null); // 用于存储 token
  const [balance, setBalance] = useState<number | null>(null); // 用于存储余额
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 判断是否已登录
  const [userInfo, setUserInfo] = useState<any>(null); // 存储用户信息
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null); // 用于消息提示

  const handleLogin = async () => {
    const initData = WebApp.initData;
     // "user=%7B%22id%22%3A5160149730%2C%22first_name%22%3A%22Zo%22%2C%22last_name%22%3A%22YonLian%22%2C%22username%22%3A%22Zoyonlian%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-4974430574441768306&chat_type=sender&auth_date=1730357460&hash=80bac0b64bb2262b99f8aac7dfd00b005338dc0981a907ce3da44dbd031cc84a"; // Your initData here

    try {
      const response = await fetch("https://chop-api.jpegonapechain.meme/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (data.token) {
        setToken(data.token); // 存储到全局 context 中
        setLocalToken(data.token); // 存储在本地状态中
        setUserInfo(data.user); // 保存用户信息
        setBalance(data.user.balance); // 设置初始余额
        setIsLoggedIn(true); // 设置为登录状态
        showNotification("登录成功！", "success");
      } else {
        showNotification("登录失败，请重试。", "error");
      }
    } catch (error) {
      showNotification("登录请求错误，请检查网络连接。", "error");
    }
  };

  const connectWebSocket = () => {
    if (!token) {
      showNotification("Token 不可用，请先登录。", "error");
      return;
    }

    const webSocket = new WebSocket(`wss://chop-api.jpegonapechain.meme?token=${token}`);
    setWs(webSocket);

    

    webSocket.onopen = () => {
      showNotification("WebSocket 连接成功！", "success");
    };

    webSocket.onerror = (_error) => {
      showNotification("WebSocket 连接失败。", "error");
    };
  };

  const sendUpdateBalance = (amount: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "update_balance",
          amount,
        })
      );
    } else {
      showNotification("WebSocket 未连接，请先连接。", "error");
    }
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        
        if (data.type === "balance_updated") {
          setBalance(data.balance); // 更新余额
          showNotification("余额已更新！", "success");
        } else if (data.type === "error") {
          showNotification(data.message, "error");
        }
      };

      ws.onclose = () => {
        showNotification("WebSocket 已断开连接。", "error");
      };

      return () => {
        ws.close();
      };
    }
  }, [ws]);

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // 3秒后隐藏
  };

  return (
    <div className="login-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      {!isLoggedIn ? (
        <div className="login-panel">
          <button className="login-button" onClick={handleLogin}>登录</button>
        </div>
      ) : (
        <div className="user-info">
          <h2>欢迎, {userInfo?.firstName} {userInfo?.lastName}</h2>
          <p>用户名: {userInfo?.username}</p>
          <p>Telegram ID: {userInfo?.telegramId}</p>
          <p>当前余额: {balance !== null ? balance : "加载中..."}</p>
          <div className="action-buttons">
            <button onClick={connectWebSocket}>连接 WebSocket</button>
            <button onClick={() => sendUpdateBalance(10)}>增加余额 (+10)</button>
            <button onClick={() => sendUpdateBalance(-10)}>减少余额 (-10)</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;