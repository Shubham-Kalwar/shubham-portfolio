package com.shubham.portfolio.dto;

import com.shubham.portfolio.model.Certificate;

public record CertificateDTO(
        Long id,
        String title,
        String issuer,
        String issueDate,
        String credentialId,
        String credentialUrl,
        Certificate.Category category,
        Integer displayOrder
) {}
