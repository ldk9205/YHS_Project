package com.example.demo.domain.treatment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "treatment_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TreatmentImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 시술과의 연관관계 (N : 1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treatment_id", nullable = false)
    private Treatment treatment;

    // S3 이미지 URL
    @Column(nullable = false, length = 500)
    private String imageUrl;

    // 원본 파일명 (선택)
    @Column(length = 255)
    private String originalName;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
