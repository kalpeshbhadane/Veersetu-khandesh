package com.veersetu.khandesh.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank
    @Email(message = "Enter a valid email address")
    private String email;

    private String phone;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String relationToSoldier;
}
