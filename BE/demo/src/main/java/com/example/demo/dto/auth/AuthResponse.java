package com.example.demo.dto.auth;

public record AuthResponse(
        Long id,
        String email,
        String name
) {}
