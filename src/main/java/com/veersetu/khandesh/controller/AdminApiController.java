package com.veersetu.khandesh.controller;

import com.veersetu.khandesh.dto.SoldierFormDto;
import com.veersetu.khandesh.dto.SoldierResponse;
import com.veersetu.khandesh.entity.User;
import com.veersetu.khandesh.service.SoldierService;
import com.veersetu.khandesh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminApiController {

    private final SoldierService soldierService;
    private final UserService userService;

    @GetMapping("/soldiers/pending")
    public java.util.List<SoldierResponse> pending() {
        return soldierService.findPending().stream().map(SoldierResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/soldiers/{id}")
    public SoldierResponse get(@PathVariable Long id) {
        return SoldierResponse.from(soldierService.findById(id));
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
                "pending", soldierService.countPending(),
                "approved", soldierService.countApproved()
        );
    }

    @PostMapping("/soldiers/{id}/approve")
    public SoldierResponse approve(@PathVariable Long id) {
        soldierService.approve(id);
        return SoldierResponse.from(soldierService.findById(id));
    }

    @PostMapping("/soldiers/{id}/reject")
    public SoldierResponse reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        soldierService.reject(id, body.getOrDefault("reason", "Not specified"));
        return SoldierResponse.from(soldierService.findById(id));
    }

    // Admin can add a record directly; it is auto-approved.
    @PostMapping(value = "/soldiers", consumes = "multipart/form-data")
    public SoldierResponse addSoldier(@Valid @ModelAttribute SoldierFormDto form, Authentication authentication) {
        User admin = userService.findByEmail(authentication.getName());
        var soldier = soldierService.submit(form, admin);
        soldierService.approve(soldier.getId());
        return SoldierResponse.from(soldierService.findById(soldier.getId()));
    }
}
