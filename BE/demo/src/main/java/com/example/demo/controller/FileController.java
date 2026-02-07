package com.example.demo.controller;

import com.example.demo.service.S3Service;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST}
)
public class FileController {

    private final S3Service s3Service;

    /**
     * 업로드용 Presigned URL 발급
     * React → 이 API 호출 → presignedUrl 수신
     */
    @PostMapping("/presign/upload")
    public Map<String, String> getUploadPresignedUrl(
            @Valid @RequestBody UploadPresignRequest request
    ) {
        if (!request.contentType().startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }
        String presignedUrl = s3Service.generateUploadPresignedUrl(request.fileName());
        return Map.of("presignedUrl", presignedUrl);
    }

    /**
     * 파일 리스트 조회 (Presigned URL 포함)
     * React → 이 API 호출 → 바로 렌더링
     */
    @GetMapping
    public List<S3Service.FileInfo> getFileList() {
        return s3Service.getFileListWithPresignedUrls();
    }

    /**
     * 업로드 Presign 요청 DTO
     */
    public record UploadPresignRequest(
            @NotBlank String fileName,
            @NotBlank String contentType
    ) {}
}
