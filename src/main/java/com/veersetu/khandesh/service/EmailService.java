package com.veersetu.khandesh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends transactional email (currently just password-reset links).
 *
 * Spring Boot only creates a {@link JavaMailSender} bean when
 * spring.mail.host is configured, so on a fresh checkout — or any
 * environment where no SMTP server has been set up — that dependency is
 * simply absent here. Rather than fail, this degrades to printing the link
 * to the console (same spirit as DataSeeder's admin-credentials banner),
 * which keeps the feature fully usable in development. Set the
 * SPRING_MAIL_HOST / SPRING_MAIL_USERNAME / SPRING_MAIL_PASSWORD /
 * SPRING_MAIL_PORT environment variables in production to send real email.
 */
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        if (mailSender == null) {
            printToConsole(toEmail, resetLink, null);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromAddress != null && !fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setTo(toEmail);
            message.setSubject("Reset your VeerSetu Khandesh password");
            message.setText(
                    "We received a request to reset your VeerSetu Khandesh account password.\n\n" +
                    "Click the link below to choose a new password. It expires in 30 minutes and can only be used once:\n\n" +
                    resetLink + "\n\n" +
                    "If you didn't request this, you can safely ignore this email — your password won't change.");
            mailSender.send(message);
        } catch (Exception e) {
            printToConsole(toEmail, resetLink, e);
        }
    }

    private void printToConsole(String toEmail, String resetLink, Exception failure) {
        System.out.println("=================================================");
        System.out.println(" VeerSetu Khandesh: password reset requested for " + toEmail);
        if (failure != null) {
            System.out.println(" Sending the email failed (" + failure.getMessage() + ") — link below instead:");
        } else {
            System.out.println(" No SMTP server configured (spring.mail.host) — link below instead of an email:");
        }
        System.out.println(" " + resetLink);
        System.out.println("=================================================");
    }
}
