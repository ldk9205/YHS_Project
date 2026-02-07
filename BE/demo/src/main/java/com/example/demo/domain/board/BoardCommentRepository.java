package com.example.demo.domain.board;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardCommentRepository
        extends JpaRepository<BoardComment, Long> {

    List<BoardComment> findByPostId(Long postId);
}
