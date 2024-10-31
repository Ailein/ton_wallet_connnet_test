import  { useContext } from "react";
import { BackendTokenContext } from "./BackendTokenContext";
import WebApp from "@twa-dev/sdk"; // 假设这是 Telegram Web App SDK

function Login() {
  const { setToken } = useContext(BackendTokenContext);

  const handleLogin = async () => {
    const initData = WebApp.initData; // 获取 initData

    try {
      const response = await fetch("https://a7f8-192-169-119-228.ngrok-free.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }), // 发送 initData 进行认证
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token); // 存储 token
      } else {
        console.error("登录失败");
      }
    } catch (error) {
      console.error("登录请求错误:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>登录</button>
    </div>
  );
}

export default Login;
