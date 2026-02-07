import { useState } from "react";
import {
  requestUploadPresignedUrl,
  uploadFileToS3,
} from "../services/api";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [hour, setHour] = useState("1");
  const [minute, setMinute] = useState("00");
  const [loading, setLoading] = useState(false);

  /**
   * YYYYMMDDHHMM 형식 생성
   */
  const buildDateTimeString = () => {
    if (!date) return null;

    let hh = parseInt(hour, 10);
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    const hhStr = hh.toString().padStart(2, "0");

    return `${date.replaceAll("-", "")}${hhStr}${minute}`;
  };

  const handleUpload = async () => {
    if (!file || !customerName || !date) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      setLoading(true);

      const dateTime = buildDateTimeString();
      if (!dateTime) throw new Error("날짜/시간 생성 실패");

      const extension = file.name.split(".").pop();
      const objectKey = `${dateTime}_${customerName}.${extension}`;

      // 1️⃣ BE에 presigned URL 요청
      const { presignedUrl } = await requestUploadPresignedUrl({
        fileName: objectKey,
        contentType: file.type,
      });

      // 2️⃣ S3로 직접 업로드
      await uploadFileToS3(presignedUrl, file);

      alert("업로드 완료!");

      // 초기화
      setFile(null);
      setCustomerName("");
      setDate("");
      setAmpm("AM");
      setHour("1");
      setMinute("00");

    } catch (error) {
      console.error(error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>사진 업로드</h2>

      <div>
        <label>날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>시간</label>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={ampm} onChange={(e) => setAmpm(e.target.value)}>
            <option value="AM">오전</option>
            <option value="PM">오후</option>
          </select>

          <select value={hour} onChange={(e) => setHour(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <select value={minute} onChange={(e) => setMinute(e.target.value)}>
            <option value="00">00</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div>
        <label>고객 성함</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="홍길동"
        />
      </div>

      <div>
        <label>사진 파일</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "업로드 중..." : "업로드"}
      </button>
    </div>
  );
};

export default FileUploader;
