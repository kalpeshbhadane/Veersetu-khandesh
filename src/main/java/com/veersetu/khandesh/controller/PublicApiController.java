package com.veersetu.khandesh.controller;

import com.veersetu.khandesh.dto.SoldierResponse;
import com.veersetu.khandesh.entity.District;
import com.veersetu.khandesh.service.SoldierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * No login required. Only ever returns APPROVED soldier records — nothing
 * pending or rejected is exposed here.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicApiController {

    private final SoldierService soldierService;

    @GetMapping("/soldiers")
    public List<SoldierResponse> soldiers(@RequestParam(required = false) String district,
                                           @RequestParam(required = false) String village) {
        var soldiers = (district != null && village != null)
                ? soldierService.findApprovedByDistrictAndVillage(District.valueOf(district), village)
                : (district != null)
                    ? soldierService.findApprovedByDistrict(District.valueOf(district))
                    : soldierService.findApproved();

        return soldiers.stream().map(SoldierResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/soldiers/{id}")
    public SoldierResponse soldier(@PathVariable Long id) {
        return SoldierResponse.from(soldierService.findById(id));
    }

    @GetMapping("/districts")
    public List<Map<String, Object>> districts() {
        return java.util.Arrays.stream(District.values())
                .map(d -> Map.<String, Object>of(
                        "code", d.name(),
                        "name", d.getDisplayName(),
                        "lat", d.getLat(),
                        "lng", d.getLng(),
                        "count", soldierService.countApprovedByDistrict(d)
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
                "total", soldierService.countApproved(),
                "dhule", soldierService.countApprovedByDistrict(District.DHULE),
                "jalgaon", soldierService.countApprovedByDistrict(District.JALGAON),
                "nandurbar", soldierService.countApprovedByDistrict(District.NANDURBAR),
                "nashik", soldierService.countApprovedByDistrict(District.NASHIK)
        );
    }
}
