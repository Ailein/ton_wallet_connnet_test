// App.tsx

import React, { useEffect, useState, useContext } from "react";
import { BackendTokenContext } from "./BackendTokenContext";
import Login from "./Login";

function App() {
  const { token } = useContext(BackendTokenContext);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return; // 确保 token 存在再建立连接

    const ws = new WebSocket("ws://http://localhost:9111"); // 替换为 WebSocket 服务器 URL

    ws.onopen = () => {
      console.log("WebSocket 连接已建立");

      // 发送 token 用于验证
      ws.send(
        JSON.stringify({
          type: "authenticate",
          token,
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "balance_updated") {
        setBalance(message.balance); // 更新余额状态
      } else if (message.type === "error") {
        console.error("WebSocket 错误:", message.message);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket 发生错误:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket 已断开连接");
    };

    return () => {
      ws.close(); // 组件卸载时关闭 WebSocket
    };
  }, [token]);

  return (
    <div>
      {token ? (
        <div>
          <h2>WebSocket 余额:</h2>
          <p>余额: {balance !== null ? balance : "加载中..."}</p>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
