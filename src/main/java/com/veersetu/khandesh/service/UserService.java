package com.veersetu.khandesh.service;

import com.veersetu.khandesh.dto.RegisterDto;
import com.veersetu.khandesh.entity.Role;
import com.veersetu.khandesh.entity.User;
import com.veersetu.khandesh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No account found for " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .build();
    }

    public User registerFamily(RegisterDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account already exists for this email address.");
        }
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRelationToSoldier(dto.getRelationToSoldier());
        user.setRole(Role.FAMILY);
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }
    public User updateProfile(String email, com.veersetu.khandesh.dto.UpdateProfileDto dto) {
        User user = findByEmail(email);
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setRelationToSoldier(dto.getRelationToSoldier());

        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null
                    || !passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
            if (dto.getNewPassword().length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters.");
            }
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        return userRepository.save(user);
    }
}
