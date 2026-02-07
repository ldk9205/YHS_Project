package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtProvider {

    private static final String SECRET_KEY = "very-secret-key-very-secret-key-123456";
    private static final long EXPIRATION_MS = 1000 * 60 * 60; // 1시간

    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public static String generateToken(Long designerId, String email) {
        return Jwts.builder()
                .setSubject(String.valueOf(designerId))
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
