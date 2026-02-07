import { useState } from "react";
import {
  requestUploadPresignedUrl,
  uploadFileToS3,
} from "../api/fileApi";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [hour, setHour] = useState("1");
  const [minute, setMinute] = useState("00");
  const [loading, setLoading] = useState(false);

  const buildDateTimeString = () => {
    if (!date) return null;

    let hh = parseInt(hour, 10);
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    return `${date.replaceAll("-", "")}${hh
      .toString()
      .padStart(2, "0")}${minute}`;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file || !customerName || !date) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const dateTime = buildDateTimeString();
      const extension = file.name.split(".").pop();
      const objectKey = `${dateTime}_${customerName}.${extension}`;

      const { presignedUrl } = await requestUploadPresignedUrl({
        fileName: objectKey,
        contentType: file.type,
      });

      await uploadFileToS3(presignedUrl, file);

      alert("업로드 완료!");

      // cleanup
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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
    <div style={container}>
      <h2 style={{ marginBottom: 20 }}>사진 업로드</h2>

      {previewUrl && (
        <div style={previewBox}>
          <img
            src={previewUrl}
            alt="미리보기"
            style={{
              maxWidth: "100%",
              maxHeight: 300,
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div style={field}>
        <label style={label}>날짜</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
      </div>

      <div style={field}>
        <label style={label}>시간</label>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={ampm} onChange={(e) => setAmpm(e.target.value)} style={select}>
            <option value="AM">오전</option>
            <option value="PM">오후</option>
          </select>

          <select value={hour} onChange={(e) => setHour(e.target.value)} style={select}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <select value={minute} onChange={(e) => setMinute(e.target.value)} style={select}>
            <option value="00">00</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div style={field}>
        <label style={label}>고객 성함</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="홍길동"
          style={input}
        />
      </div>

      <div style={field}>
        <label style={label}>사진 파일</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button onClick={handleUpload} disabled={loading} style={button}>
        {loading ? "업로드 중..." : "업로드"}
      </button>
    </div>
  );
};

/* styles */
const container = {
  maxWidth: 420,
  margin: "0 auto",
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const previewBox = {
  marginBottom: 16,
  padding: 10,
  border: "1px dashed #ccc",
  textAlign: "center",
};

const field = { marginBottom: 14 };
const label = { display: "block", marginBottom: 4, fontWeight: 600 };
const input = { width: "100%", padding: 8 };
const select = { padding: 6 };
const button = { width: "100%", padding: "12px 0", fontSize: 16 };

export default FileUploader;
