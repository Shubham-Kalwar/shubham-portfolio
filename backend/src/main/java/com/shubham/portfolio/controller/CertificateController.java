package com.shubham.portfolio.controller;

import com.shubham.portfolio.dto.CertificateDTO;
import com.shubham.portfolio.service.CertificateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "Certifications and achievements")
public class CertificateController {

    private final CertificateService certificateService;

    /** GET /api/certificates — returns all certificates ordered by displayOrder */
    @GetMapping
    public ResponseEntity<List<CertificateDTO>> getAll() {
        return ResponseEntity.ok(certificateService.getAll());
    }

    /** GET /api/certificates/{category} — returns certificates filtered by category (CERTIFICATION | ACHIEVEMENT) */
    @GetMapping("/{category}")
    public ResponseEntity<List<CertificateDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(certificateService.getByCategory(category));
    }
}
