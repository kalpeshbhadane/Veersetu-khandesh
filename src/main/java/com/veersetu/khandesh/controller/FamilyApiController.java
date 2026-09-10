package com.veersetu.khandesh.controller;

import com.veersetu.khandesh.dto.SoldierFormDto;
import com.veersetu.khandesh.dto.SoldierResponse;
import com.veersetu.khandesh.entity.User;
import com.veersetu.khandesh.service.SoldierService;
import com.veersetu.khandesh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyApiController {

    private final SoldierService soldierService;
    private final UserService userService;

    @GetMapping("/soldiers")
    public List<SoldierResponse> mySoldiers(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return soldierService.findBySubmitter(user).stream().map(SoldierResponse::from).collect(Collectors.toList());
    }

    // Full detail of one of your own submissions (used to prefill the edit form).
    @GetMapping("/soldiers/{id}")
    public ResponseEntity<?> mySoldier(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        try {
            return ResponseEntity.ok(SoldierResponse.from(soldierService.findOwnedById(id, user)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    // multipart/form-data: text fields + optional "photo" and "qrCode" files
    @PostMapping(value = "/soldiers", consumes = "multipart/form-data")
    public SoldierResponse submitSoldier(@Valid @ModelAttribute SoldierFormDto form, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return SoldierResponse.from(soldierService.submit(form, user));
    }

    // Edit a record you previously submitted — every field, including a
    // replacement photo/QR code. Sends it back to PENDING for re-review.
    @PutMapping(value = "/soldiers/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateSoldier(@PathVariable Long id, @Valid @ModelAttribute SoldierFormDto form,
                                            Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        try {
            return ResponseEntity.ok(SoldierResponse.from(soldierService.update(id, form, user)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }
}
