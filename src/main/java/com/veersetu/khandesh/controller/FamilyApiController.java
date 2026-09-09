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

import java.util.List;
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

    // multipart/form-data: text fields + optional "photo" and "qrCode" files
    @PostMapping(value = "/soldiers", consumes = "multipart/form-data")
    public SoldierResponse submitSoldier(@Valid @ModelAttribute SoldierFormDto form, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return SoldierResponse.from(soldierService.submit(form, user));
    }
}
