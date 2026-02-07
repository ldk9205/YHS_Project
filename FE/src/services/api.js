const API_BASE_URL = "http://localhost:8080";

/**
 * 업로드용 Presigned URL 요청
 * @param {Object} payload
 * @param {string} payload.fileName - S3에 저장될 파일명 (object key)
 * @param {string} payload.contentType - 파일 MIME 타입
 */
export const requestUploadPresignedUrl = async ({ fileName, contentType }) => {
  const response = await fetch(`${API_BASE_URL}/files/presign/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
      contentType,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get upload presigned URL");
  }

  return response.json(); 
  // 예상 응답:
  // { presignedUrl: "https://s3...." }
};

/**
 * Presigned URL을 사용한 S3 업로드
 * @param {string} presignedUrl
 * @param {File} file
 */
export const uploadFileToS3 = async (presignedUrl, file) => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }
};

/**
 * 파일 리스트 조회 (Presigned URL 포함)
 */
export const fetchFileList = async () => {
  const response = await fetch(`${API_BASE_URL}/files`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch file list");
  }

  return response.json();
  // 예상 응답:
  // [
  //   {
  //     objectKey: "202602051530_홍길동.jpg",
  //     lastModified: "2026-02-05T15:30:00Z",
  //     presignedUrl: "https://s3..."
  //   }
  // ]
};
