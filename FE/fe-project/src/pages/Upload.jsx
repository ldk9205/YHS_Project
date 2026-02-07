import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const Upload = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate("/")}>
          ← 홈으로
        </button>
        <h1 style={styles.title}>파일 업로드</h1>
      </div>

      {/* 여기서 FileUploader를 실제로 렌더링 */}
      <FileUploader />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: "#f8fafc",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  backButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
  },
};

export default Upload;
