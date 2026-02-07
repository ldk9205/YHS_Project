package com.example.demo.domain.board;

import com.example.demo.domain.designer.Designer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "board_comments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BoardComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 댓글이 달린 게시글
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private BoardPost post;

    // 댓글 작성 디자이너
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designer_id", nullable = false)
    private Designer designer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

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
