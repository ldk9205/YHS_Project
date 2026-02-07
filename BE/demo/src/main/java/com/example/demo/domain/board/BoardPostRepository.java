package com.example.demo.domain.board;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {

    List<BoardPost> findByDesignerId(Long designerId);

}
