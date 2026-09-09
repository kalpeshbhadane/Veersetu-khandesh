package com.veersetu.khandesh.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

/**
 * Backing object for the "register a soldier" form used by both
 * family members and admins. Kept separate from the JPA entity so the
 * web layer never binds directly onto persistence internals.
 */
@Data
public class SoldierFormDto {

    @NotBlank(message = "Soldier's name is required")
    private String name;

    private Integer age;
    private LocalDate dateOfBirth;

    @NotBlank(message = "Please select the force")
    private String force;

    private String battalion;
    private String unit;
    private String rank;
    private String designation;
    private String serviceNumber;
    private String postingPlace;

    private LocalDate martyrdomDate;
    private String martyrdomPlace;
    private String operationName;
    private String story;

    @NotNull(message = "Please select a district")
    private String district;

    private String taluka;

    @NotBlank(message = "Village is required")
    private String village;

    private String address;
    private Double latitude;
    private Double longitude;

    private String familyContactName;
    private String familyContactPhone;
    private String familyContactEmail;

    private MultipartFile photo;
    private MultipartFile qrCode;
}
