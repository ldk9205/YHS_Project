/**
 * S3 Service (Public Bucket - A안)
 * - Access Key 사용 안 함
 * - fetch 기반 PUT 업로드
 * - Public URL 생성
 */

/** =========================
 *  기본 설정값
 *  ========================= */
const BUCKET_NAME = "treatment-image";
const REGION = "ap-northeast-2";

/**
 * S3 퍼블릭 베이스 URL
 * 예:
 * https://treatment-image.s3.ap-northeast-2.amazonaws.com/
 */
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

/** =========================
 *  업로드
 *  ========================= */
/**
 * @param {File} file        - 업로드할 파일 객체
 * @param {string} fileName  - S3에 저장될 파일명
 *                            (YYYY-MM-DD HH-MM 고객성함.jpg)
 */
export const uploadFile = async (file, fileName) => {
  if (!file) {
    throw new Error("업로드할 파일이 없습니다.");
  }

  if (!fileName) {
    throw new Error("파일명이 지정되지 않았습니다.");
  }

  const uploadUrl = `${S3_BASE_URL}/${encodeURIComponent(fileName)}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type, // image/jpeg, image/png 등
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("S3 업로드 실패");
  }

  return {
    success: true,
    url: uploadUrl,
  };
};

/** =========================
 *  Public URL 생성
 *  ========================= */
/**
 * @param {string} fileName
 * @returns {string} public image url
 */
export const getPublicUrl = (fileName) => {
  return `${S3_BASE_URL}/${encodeURIComponent(fileName)}`;
};
