package com.veersetu.khandesh.controller;

import com.veersetu.khandesh.dto.ForgotPasswordDto;
import com.veersetu.khandesh.dto.RegisterDto;
import com.veersetu.khandesh.dto.ResetPasswordDto;
import com.veersetu.khandesh.dto.UserResponse;
import com.veersetu.khandesh.service.PasswordResetService;
import com.veersetu.khandesh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthApiController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    // Login itself is handled by Spring Security's formLogin at POST /api/auth/login (see SecurityConfig).

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto dto) {
        try {
            var user = userService.registerFamily(dto);
            return ResponseEntity.ok(UserResponse.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in."));
        }
        var user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@Valid @RequestBody com.veersetu.khandesh.dto.UpdateProfileDto dto,
                                       Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in."));
        }
        try {
            var user = userService.updateProfile(authentication.getName(), dto);
            return ResponseEntity.ok(UserResponse.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Always returns the same generic message, whether or not the email is registered,
    // so this can't be used to check who has an account.
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDto dto) {
        passwordResetService.requestReset(dto.getEmail());
        return ResponseEntity.ok(Map.of("message",
                "If an account exists for that email address, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDto dto) {
        try {
            passwordResetService.resetPassword(dto.getToken(), dto.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Your password has been reset. You can now log in."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
