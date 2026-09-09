package com.veersetu.khandesh.config;

import com.veersetu.khandesh.entity.Role;
import com.veersetu.khandesh.entity.User;
import com.veersetu.khandesh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a single default admin account on first startup so there is
 * always a way to log in and start approving submissions.
 *
 * Change ADMIN_PASSWORD (or better, log in and change it / manage users
 * directly in the database) before deploying this publicly.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${veersetu.admin.email:admin@veersetukhandesh.org}")
    private String adminEmail;

    @Value("${veersetu.admin.password:ChangeMe@123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }
        User admin = new User();
        admin.setFullName("Portal Administrator");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        System.out.println("=================================================");
        System.out.println(" VeerSetu Khandesh: default admin account created");
        System.out.println(" Email:    " + adminEmail);
        System.out.println(" Password: " + adminPassword);
        System.out.println(" Please log in and change this password.");
        System.out.println("=================================================");
    }
}
