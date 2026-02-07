package com.example.demo.domain.treatment;

import com.example.demo.domain.customer.Customer;
import com.example.demo.domain.designer.Designer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "treatments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 시술을 진행한 디자이너
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designer_id", nullable = false)
    private Designer designer;

    // 시술 대상 고객
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // 시술 날짜
    @Column(nullable = false)
    private LocalDate treatmentDate;

    // 시술 시간 (선택)
    private LocalTime treatmentTime;

    // 컷 / 펌 / 염색 등
    @Column(nullable = false, length = 50)
    private String category;

    // 스타일명 (선택)
    @Column(length = 100)
    private String styleName;

    // 시술 상세 메모
    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
