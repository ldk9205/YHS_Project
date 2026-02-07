package com.example.demo.domain.treatment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
    List<Treatment> findByDesignerId(Long designerId);
    List<Treatment> findByCustomerId(Long customerId);
}
