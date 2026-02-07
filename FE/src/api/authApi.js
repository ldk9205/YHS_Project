const API_BASE_URL = "http://localhost:8080";

/**
 * 로그인
 * - 성공 시: Spring이 JWT를 HttpOnly Cookie로 내려줌
 * - React는 토큰을 직접 다루지 않음
 */
export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⭐ JWT Cookie 필수
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("로그인 실패");
  }

  // 보통 로그인 응답 바디는 없어도 됨
  // 필요하면 return response.json();
};

/**
 * 로그인 상태 확인
 * - 쿠키에 JWT가 있으면 200
 * - 없거나 만료되면 401
 */
export const checkLogin = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include", // ⭐ 필수
  });

  if (!response.ok) {
    throw new Error("인증되지 않은 사용자");
  }

  return response.json();
  // 예: { id, email, name }
};

export const signup = async ({ email, password, name, phone }) => {
  const res = await fetch("http://localhost:8080/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, phone }),
  });

  if (!res.ok) {
    throw new Error("회원가입 실패");
  }
};
/**
 * 로그아웃
 * - 서버에서 쿠키 만료 처리
 */
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("로그아웃 실패");
  }
};
