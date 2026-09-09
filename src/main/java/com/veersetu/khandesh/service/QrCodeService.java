package com.veersetu.khandesh.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Generates a scannable QR code image from a UPI payment string
 * (upi://pay?pa=<vpa>&pn=<name>&am=<amount>) for families that give us a
 * UPI ID instead of uploading their own QR image.
 */
@Service
public class QrCodeService {

    @Value("${veersetu.upload-dir:uploads}")
    private String uploadDir;

    public String generateUpiQr(String upiId, String payeeName, Long soldierId) throws IOException, WriterException {
        String upiUri = "upi://pay?pa=" + upiId + "&pn=" + payeeName.replace(" ", "%20") + "&cu=INR";

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(upiUri, BarcodeFormat.QR_CODE, 350, 350);

        Path targetDir = Paths.get(uploadDir, "qrcodes");
        Files.createDirectories(targetDir);
        Path targetPath = targetDir.resolve("soldier-" + soldierId + "-upi.png");

        MatrixToImageWriter.writeToPath(matrix, "PNG", targetPath);
        return "/uploads/qrcodes/soldier-" + soldierId + "-upi.png";
    }
}
