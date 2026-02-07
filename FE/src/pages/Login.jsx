import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, checkLogin } from "../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 이미 로그인 상태면 바로 /home 이동
  useEffect(() => {
    const checkAlreadyLogin = async () => {
      try {
        await checkLogin();
        navigate("/home", { replace: true });
      } catch {
        // 로그인 안 된 상태면 아무 것도 안 함
      }
    };

    checkAlreadyLogin();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate("/home");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "120px auto",
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>로그인</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      <div style={{ marginTop: 12, textAlign: "center" }}>
        <span>계정이 없으신가요? </span>
        <button
          onClick={() => navigate("/signup")}
          style={linkButton}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: 10,
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "10px 0",
  fontSize: 16,
  cursor: "pointer",
};

const linkButton = {
  background: "none",
  border: "none",
  color: "#007bff",
  cursor: "pointer",
  padding: 0,
};

export default Login;
