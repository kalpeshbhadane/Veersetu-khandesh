package com.veersetu.khandesh.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Stores uploaded soldier photos and family QR-code images on local disk,
 * under the configured upload directory, and returns a web-accessible
 * relative path that WebConfig exposes as a static resource location.
 */
@Service
public class FileStorageService {

    @Value("${veersetu.upload-dir:uploads}")
    private String uploadDir;

    public String store(MultipartFile file, String subFolder) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            Path targetDir = Paths.get(uploadDir, subFolder);
            Files.createDirectories(targetDir);

            String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
            String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
            String storedName = UUID.randomUUID() + extension;

            Path targetPath = targetDir.resolve(storedName);
            Files.copy(file.getInputStream(), targetPath);

            return "/uploads/" + subFolder + "/" + storedName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store uploaded file: " + e.getMessage(), e);
        }
    }
}
