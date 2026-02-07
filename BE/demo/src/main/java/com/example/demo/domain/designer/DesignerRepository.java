package com.example.demo.domain.designer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DesignerRepository extends JpaRepository<Designer, Long> {
    Optional<Designer> findByEmail(String email);
}
