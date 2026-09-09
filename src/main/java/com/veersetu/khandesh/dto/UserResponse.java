package com.veersetu.khandesh.dto;

import com.veersetu.khandesh.entity.User;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        String relationToSoldier
) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(),
                u.getRole().name(), u.getRelationToSoldier());
    }
}
