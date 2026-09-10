package com.veersetu.khandesh.service;

import com.veersetu.khandesh.dto.SoldierFormDto;
import com.veersetu.khandesh.entity.ApprovalStatus;
import com.veersetu.khandesh.entity.District;
import com.veersetu.khandesh.entity.Soldier;
import com.veersetu.khandesh.entity.User;
import com.veersetu.khandesh.repository.SoldierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SoldierService {

    private final SoldierRepository soldierRepository;
    private final FileStorageService fileStorageService;
    private final QrCodeService qrCodeService;

    @Transactional
    public Soldier submit(SoldierFormDto form, User submittedBy) {
        Soldier soldier = new Soldier();
        applyForm(soldier, form);
        soldier.setSubmittedBy(submittedBy);
        soldier.setApprovalStatus(ApprovalStatus.PENDING);
        soldier.setSubmittedAt(LocalDateTime.now());

        soldier.setPhotoPath(fileStorageService.store(form.getPhoto(), "photos"));
        String uploadedQr = fileStorageService.store(form.getQrCode(), "qrcodes");
        soldier.setQrCodePath(uploadedQr);

        soldier = soldierRepository.save(soldier); // need the generated id before a QR can be generated

        if (uploadedQr == null) {
            generateQrIfPossible(soldier);
        }

        return soldier;
    }

    /**
     * A family member editing a record they already submitted (used by the
     * family dashboard's "Edit" flow). Every field can change, including a
     * replacement photo/QR code. Whatever the record's previous status, the
     * edit is treated as a fresh submission that needs an admin's eyes again
     * — it goes back to PENDING and drops off the public map until
     * re-approved, matching the "nothing goes public without review" rule.
     */
    @Transactional
    public Soldier update(Long id, SoldierFormDto form, User requester) {
        Soldier soldier = findOwnedById(id, requester);
        String previousUpiId = soldier.getFamilyUpiId();
        applyForm(soldier, form);

        boolean qrReplaced = false;
        if (form.getPhoto() != null && !form.getPhoto().isEmpty()) {
            soldier.setPhotoPath(fileStorageService.store(form.getPhoto(), "photos"));
        }
        if (form.getQrCode() != null && !form.getQrCode().isEmpty()) {
            soldier.setQrCodePath(fileStorageService.store(form.getQrCode(), "qrcodes"));
            qrReplaced = true;
        }

        soldier.setApprovalStatus(ApprovalStatus.PENDING);
        soldier.setRejectionReason(null);
        soldier.setReviewedAt(null);

        soldier = soldierRepository.save(soldier);

        // Keep the QR image in sync with a new/changed UPI ID, unless the
        // family just uploaded their own replacement image this time.
        boolean upiIdChanged = !java.util.Objects.equals(previousUpiId, soldier.getFamilyUpiId());
        if (!qrReplaced && (soldier.getQrCodePath() == null || upiIdChanged)) {
            generateQrIfPossible(soldier);
        }

        return soldier;
    }

    /**
     * Generates a scannable UPI QR from the soldier's familyUpiId, when set —
     * used both for a fresh submission with no uploaded QR image, and to keep
     * the QR in sync when a family updates their UPI ID without re-uploading
     * one. A failure here (e.g. QR encoding trouble) is non-fatal: the
     * "Pay via UPI" deep link on the public profile still works either way.
     */
    private void generateQrIfPossible(Soldier soldier) {
        if (soldier.getFamilyUpiId() == null || soldier.getFamilyUpiId().isBlank()) {
            return;
        }
        try {
            String path = qrCodeService.generateUpiQr(soldier.getFamilyUpiId(), soldier.getName(), soldier.getId());
            soldier.setQrCodePath(path);
            soldierRepository.save(soldier);
        } catch (Exception e) {
            System.out.println("Could not generate a UPI QR for soldier " + soldier.getId() + ": " + e.getMessage());
        }
    }

    private void applyForm(Soldier soldier, SoldierFormDto form) {
        soldier.setName(form.getName());
        soldier.setAge(form.getAge());
        soldier.setDateOfBirth(form.getDateOfBirth());
        soldier.setForce(form.getForce());
        soldier.setBattalion(form.getBattalion());
        soldier.setUnit(form.getUnit());
        soldier.setRank(form.getRank());
        soldier.setDesignation(form.getDesignation());
        soldier.setServiceNumber(form.getServiceNumber());
        soldier.setPostingPlace(form.getPostingPlace());
        soldier.setMartyrdomDate(form.getMartyrdomDate());
        soldier.setMartyrdomPlace(form.getMartyrdomPlace());
        soldier.setOperationName(form.getOperationName());
        soldier.setStory(form.getStory());
        soldier.setDistrict(District.valueOf(form.getDistrict()));
        soldier.setTaluka(form.getTaluka());
        soldier.setVillage(form.getVillage());
        soldier.setAddress(form.getAddress());
        soldier.setLatitude(form.getLatitude());
        soldier.setLongitude(form.getLongitude());
        soldier.setFamilyContactName(form.getFamilyContactName());
        soldier.setFamilyContactPhone(form.getFamilyContactPhone());
        soldier.setFamilyContactEmail(form.getFamilyContactEmail());
        soldier.setFamilyUpiId(form.getFamilyUpiId());
    }

    /** A soldier record, but only if it was submitted by the given user — otherwise "not found". */
    public Soldier findOwnedById(Long id, User user) {
        Soldier soldier = findById(id);
        if (soldier.getSubmittedBy() == null || !soldier.getSubmittedBy().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Soldier record not found");
        }
        return soldier;
    }

    public List<Soldier> findPending() {
        return soldierRepository.findByApprovalStatus(ApprovalStatus.PENDING);
    }

    public List<Soldier> findApproved() {
        return soldierRepository.findByApprovalStatus(ApprovalStatus.APPROVED);
    }

    public List<Soldier> findApprovedByDistrict(District district) {
        return soldierRepository.findByApprovalStatusAndDistrict(ApprovalStatus.APPROVED, district);
    }

    public List<Soldier> findApprovedByDistrictAndVillage(District district, String village) {
        return soldierRepository.findByApprovalStatusAndDistrictAndVillageIgnoreCase(
                ApprovalStatus.APPROVED, district, village);
    }

    public List<Soldier> findBySubmitter(User user) {
        return soldierRepository.findBySubmittedBy(user);
    }

    public Soldier findById(Long id) {
        return soldierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Soldier record not found"));
    }

    @Transactional
    public void approve(Long id) {
        Soldier soldier = findById(id);
        soldier.setApprovalStatus(ApprovalStatus.APPROVED);
        soldier.setReviewedAt(LocalDateTime.now());
        soldier.setRejectionReason(null);
        soldierRepository.save(soldier);
    }

    @Transactional
    public void reject(Long id, String reason) {
        Soldier soldier = findById(id);
        soldier.setApprovalStatus(ApprovalStatus.REJECTED);
        soldier.setRejectionReason(reason);
        soldier.setReviewedAt(LocalDateTime.now());
        soldierRepository.save(soldier);
    }

    public long countApproved() {
        return soldierRepository.countByApprovalStatus(ApprovalStatus.APPROVED);
    }

    public long countApprovedByDistrict(District district) {
        return soldierRepository.countByApprovalStatusAndDistrict(ApprovalStatus.APPROVED, district);
    }

    public long countPending() {
        return soldierRepository.countByApprovalStatus(ApprovalStatus.PENDING);
    }
}
