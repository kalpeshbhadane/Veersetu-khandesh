package com.veersetu.khandesh.repository;

import com.veersetu.khandesh.entity.PasswordResetToken;
import com.veersetu.khandesh.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
