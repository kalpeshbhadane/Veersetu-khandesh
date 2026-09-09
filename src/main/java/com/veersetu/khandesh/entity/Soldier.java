package com.veersetu.khandesh.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "soldiers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Soldier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---- Identity ----
    @NotBlank
    private String name;

    private Integer age;

    private LocalDate dateOfBirth;

    private String photoPath; // uploaded portrait, e.g. /uploads/photos/xyz.jpg

    // ---- Service details ----
@Column(name = "force_name") // "force" is a reserved word in MySQL (FORCE INDEX)
private String force;        // Indian Army / Indian Navy / Indian Air Force / BSF / CRPF / etc.
    private String battalion;    // e.g. "4 Rajputana Rifles"
    private String unit;
    @Column(name = "soldier_rank") // "rank" is a reserved word in MySQL 8+
    private String rank;         // e.g. Naib Subedar, Sepoy, Havildar
    private String designation;  // role/post held
    private String serviceNumber;
    private String postingPlace; // where posted at the time

    // ---- Martyrdom details ----
    private LocalDate martyrdomDate;
    private String martyrdomPlace;
    private String operationName; // e.g. "Anti-terror operation, Poonch"

    @Column(length = 3000)
    private String story; // family/admin-written account of the soldier's service & sacrifice

    // ---- Native place (Khandesh) ----
    @Enumerated(EnumType.STRING)
    private District district;

    private String taluka;
    private String village;
    private String address;

    private Double latitude;  // village-level pin, optional; falls back to district centre
    private Double longitude;

    // ---- Family / help contact ----
    private String familyContactName;
    private String familyContactPhone;
    private String familyContactEmail;
    private String qrCodePath;   // uploaded UPI QR code image for direct donations

    // ---- Workflow ----
    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    private String rejectionReason;

    @ManyToOne
    @JoinColumn(name = "submitted_by_user_id")
    private User submittedBy;

    private LocalDateTime submittedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;
}
