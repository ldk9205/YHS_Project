package com.example.demo.controller;

import com.example.demo.domain.designer.Designer;
import com.example.demo.domain.designer.DesignerRepository;
import com.example.demo.dto.auth.AuthResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.SignupRequest;
import com.example.demo.security.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final DesignerRepository designerRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public void signup(@RequestBody SignupRequest request) {

        // 이메일 중복 체크
        if (designerRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("이미 존재하는 이메일");
        }

        Designer designer = Designer.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password())) // 🔐 암호화
                .name(request.name())
                .phone(request.phone())
                .build();

        designerRepository.save(designer);
    }

    // 로그인
    @PostMapping("/login")
    public void login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        Designer designer = designerRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계정"));

        if (!passwordEncoder.matches(request.password(), designer.getPassword())) {
            throw new RuntimeException("비밀번호 불일치");
        }

        String token = JwtProvider.generateToken(
                designer.getId(),
                designer.getEmail()
        );

        Cookie cookie = new Cookie("ACCESS_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1시간
        // cookie.setSecure(true); // HTTPS 환경에서 활성화

        response.addCookie(cookie);
    }

    // 로그인 상태 확인
    @GetMapping("/me")
    public AuthResponse me(
            @CookieValue(name = "ACCESS_TOKEN", required = false) String token
    ) {
        if (token == null) {
            throw new RuntimeException("인증 안 됨");
        }

        var claims = JwtProvider.parseToken(token);

        Long designerId = Long.valueOf(claims.getSubject());

        Designer designer = designerRepository.findById(designerId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        return new AuthResponse(
                designer.getId(),
                designer.getEmail(),
                designer.getName()
        );
    }

    // 로그아웃
    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("ACCESS_TOKEN", null);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료
        response.addCookie(cookie);
    }
}
