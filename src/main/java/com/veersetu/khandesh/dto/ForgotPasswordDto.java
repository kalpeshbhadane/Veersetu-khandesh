package com.veersetu.khandesh.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordDto {

    @NotBlank
    @Email(message = "Enter a valid email address")
    private String email;
}
