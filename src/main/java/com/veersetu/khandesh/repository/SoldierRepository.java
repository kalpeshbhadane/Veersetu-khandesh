package com.veersetu.khandesh.repository;

import com.veersetu.khandesh.entity.ApprovalStatus;
import com.veersetu.khandesh.entity.District;
import com.veersetu.khandesh.entity.Soldier;
import com.veersetu.khandesh.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SoldierRepository extends JpaRepository<Soldier, Long> {

    List<Soldier> findByApprovalStatus(ApprovalStatus status);

    List<Soldier> findByApprovalStatusAndDistrict(ApprovalStatus status, District district);

    List<Soldier> findByApprovalStatusAndDistrictAndVillageIgnoreCase(
            ApprovalStatus status, District district, String village);

    List<Soldier> findBySubmittedBy(User submittedBy);

    long countByApprovalStatus(ApprovalStatus status);

    long countByApprovalStatusAndDistrict(ApprovalStatus status, District district);
}
