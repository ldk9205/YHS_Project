import { useEffect, useState } from "react";
import { fetchFileList } from "../api/fileApi";
import { useNavigate } from "react-router-dom";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchFileList();
        setFiles(data);
      } catch (error) {
        console.error(error);
        alert("파일 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  /**
   * 파일명 → 화면 표시용 텍스트 변환
   * 202602051530_홍길동.jpg
   * → 2026-02-05 15:30 홍길동 고객님
   */
  const formatDisplayText = (objectKey) => {
    const [dateTime, nameWithExt] = objectKey.split("_");
    const name = nameWithExt?.split(".")[0] ?? "";

    const year = dateTime.substring(0, 4);
    const month = dateTime.substring(4, 6);
    const day = dateTime.substring(6, 8);
    const hour = dateTime.substring(8, 10);
    const minute = dateTime.substring(10, 12);

    return `${year}-${month}-${day} ${hour}:${minute} ${name} 고객님`;
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <h2>저장된 사진 목록</h2>

      <button onClick={() => navigate("/")}>홈으로 돌아가기</button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
          marginTop: 20,
        }}
      >
        {files.map((file) => (
          <div
            key={file.objectKey}
            style={{
              border: "1px solid #ddd",
              padding: 8,
              textAlign: "center",
            }}
          >
            <img
              src={file.presignedUrl}
              alt={file.objectKey}
              style={{
                width: "100%",
                height: 360,
                objectFit: "contain",
              }}
            />
            <div style={{ marginTop: 8, fontSize: 12 }}>
              {formatDisplayText(file.objectKey)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
