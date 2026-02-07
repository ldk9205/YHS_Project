import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const Upload = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>업로드 페이지</h2>

      <button onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>

      <hr />

      <FileUploader />
    </div>
  );
};

export default Upload;
