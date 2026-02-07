import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await signup({ email, password, name, phone });
      alert("회원가입 완료! 로그인해주세요.");
      navigate("/");
    } catch {
      alert("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2>회원가입</h2>

      <input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <input
        placeholder="전화번호 (선택)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={input}
      />

      <button onClick={handleSignup} disabled={loading} style={button}>
        {loading ? "가입 중..." : "회원가입"}
      </button>

      <button
        onClick={() => navigate("/")}
        style={{ ...linkButton, marginTop: 10 }}
      >
        로그인으로 돌아가기
      </button>
    </div>
  );
};

const container = {
  maxWidth: 360,
  margin: "120px auto",
  padding: 24,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const button = {
  width: "100%",
  padding: 10,
};

const linkButton = {
  background: "none",
  border: "none",
  color: "#007bff",
  cursor: "pointer",
};

export default Signup;
