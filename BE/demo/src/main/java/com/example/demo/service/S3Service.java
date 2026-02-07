package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.presign.upload-expiration-seconds}")
    private long uploadExpirationSeconds;

    @Value("${aws.s3.presign.download-expiration-seconds}")
    private long downloadExpirationSeconds;

    /**
     * S3 객체 목록 조회
     */
    public List<S3Object> listObjects() {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        return s3Client.listObjectsV2(request)
                .contents();
    }

    /**
     * 업로드용 Presigned URL 발급
     */
    public String generateUploadPresignedUrl(String objectKey) {

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(uploadExpirationSeconds))
                .putObjectRequest(putObjectRequest)
                .build();

        return s3Presigner.presignPutObject(presignRequest)
                .url()
                .toString();
    }

    /**
     * 다운로드용 Presigned URL 발급
     */
    public String generateDownloadPresignedUrl(String objectKey) {

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(downloadExpirationSeconds))
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest)
                .url()
                .toString();
    }

    /**
     * FileList용 데이터 가공 (Presigned URL 포함)
     */
    public List<FileInfo> getFileListWithPresignedUrls() {
        return listObjects().stream()
                .map(obj -> new FileInfo(
                        obj.key(),
                        obj.lastModified().toString(),
                        generateDownloadPresignedUrl(obj.key())
                ))
                .collect(Collectors.toList());
    }

    /**
     * FileList 응답용 DTO
     */
    public record FileInfo(
            String objectKey,
            String lastModified,
            String presignedUrl
    ) {}
}
