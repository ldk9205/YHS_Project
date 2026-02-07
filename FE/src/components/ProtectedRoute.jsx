import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkLogin } from "../api/authApi";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await checkLogin(); // 200이면 로그인 상태
        setIsAuthenticated(true);
      } catch (error) {
        console.error("로그인 확인 실패:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyLogin();
  }, []);

  // 로그인 상태 확인 중
  if (loading) {
    return <div>인증 확인 중...</div>;
  }

  // 로그인 안 되어 있으면 로그인 페이지로 이동
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 로그인 되어 있으면 하위 라우트 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
