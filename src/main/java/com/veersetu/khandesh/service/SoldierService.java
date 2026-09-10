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

    @Transactional
    public Soldier submit(SoldierFormDto form, User submittedBy) {
        Soldier soldier = new Soldier();
        applyForm(soldier, form);
        soldier.setSubmittedBy(submittedBy);
        soldier.setApprovalStatus(ApprovalStatus.PENDING);
        soldier.setSubmittedAt(LocalDateTime.now());

        soldier.setPhotoPath(fileStorageService.store(form.getPhoto(), "photos"));
        soldier.setQrCodePath(fileStorageService.store(form.getQrCode(), "qrcodes"));

        return soldierRepository.save(soldier);
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
        applyForm(soldier, form);

        if (form.getPhoto() != null && !form.getPhoto().isEmpty()) {
            soldier.setPhotoPath(fileStorageService.store(form.getPhoto(), "photos"));
        }
        if (form.getQrCode() != null && !form.getQrCode().isEmpty()) {
            soldier.setQrCodePath(fileStorageService.store(form.getQrCode(), "qrcodes"));
        }

        soldier.setApprovalStatus(ApprovalStatus.PENDING);
        soldier.setRejectionReason(null);
        soldier.setReviewedAt(null);

        return soldierRepository.save(soldier);
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
