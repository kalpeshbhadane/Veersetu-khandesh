package com.veersetu.khandesh.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String relationToSoldier;

    private String currentPassword;
    private String newPassword;
}
