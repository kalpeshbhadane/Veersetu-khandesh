package com.veersetu.khandesh.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    private String phone;

    @NotBlank
    private String password; // stored as a BCrypt hash

    @Enumerated(EnumType.STRING)
    private Role role;

    // How the soldier is related to this family account, e.g. "Son", "Brother", "Wife"
    private String relationToSoldier;

    private LocalDateTime createdAt = LocalDateTime.now();
}
