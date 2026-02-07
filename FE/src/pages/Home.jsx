import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>S3 파일 관리</h1>
      <p style={styles.subTitle}>
        원하시는 기능을 선택하세요
      </p>

      <div style={styles.buttonGroup}>
        <button
          style={styles.primaryButton}
          onClick={() => navigate("/upload")}
        >
          📤 업로드하기
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => navigate("/files")}
        >
          📁 저장된 파일 보기
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  subTitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "40px",
  },
  buttonGroup: {
    display: "flex",
    gap: "20px",
  },
  primaryButton: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  secondaryButton: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #2563eb",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#2563eb",
  },
};

export default Home;
