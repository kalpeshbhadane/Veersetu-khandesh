package com.veersetu.khandesh.dto;

import com.veersetu.khandesh.entity.Soldier;

import java.time.LocalDate;

public record SoldierResponse(
        Long id,
        String name,
        Integer age,
        LocalDate dateOfBirth,
        String photoPath,
        String force,
        String battalion,
        String unit,
        String rank,
        String designation,
        String serviceNumber,
        String postingPlace,
        LocalDate martyrdomDate,
        String martyrdomPlace,
        String operationName,
        String story,
        String district,
        String districtDisplayName,
        String taluka,
        String village,
        String address,
        Double latitude,
        Double longitude,
        String familyContactName,
        String familyContactPhone,
        String familyContactEmail,
        String qrCodePath,
        String approvalStatus,
        String rejectionReason,
        String submittedByName,
        String submittedByEmail
) {
    public static SoldierResponse from(Soldier s) {
        double lat = s.getLatitude() != null ? s.getLatitude() : s.getDistrict().getLat();
        double lng = s.getLongitude() != null ? s.getLongitude() : s.getDistrict().getLng();
        return new SoldierResponse(
                s.getId(), s.getName(), s.getAge(), s.getDateOfBirth(), s.getPhotoPath(),
                s.getForce(), s.getBattalion(), s.getUnit(), s.getRank(), s.getDesignation(),
                s.getServiceNumber(), s.getPostingPlace(), s.getMartyrdomDate(), s.getMartyrdomPlace(),
                s.getOperationName(), s.getStory(),
                s.getDistrict().name(), s.getDistrict().getDisplayName(), s.getTaluka(), s.getVillage(),
                s.getAddress(), lat, lng,
                s.getFamilyContactName(), s.getFamilyContactPhone(), s.getFamilyContactEmail(),
                s.getQrCodePath(), s.getApprovalStatus().name(), s.getRejectionReason(),
                s.getSubmittedBy() != null ? s.getSubmittedBy().getFullName() : "Admin",
                s.getSubmittedBy() != null ? s.getSubmittedBy().getEmail() : null
        );
    }
}
