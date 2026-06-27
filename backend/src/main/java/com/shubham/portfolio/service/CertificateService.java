package com.shubham.portfolio.service;

import com.shubham.portfolio.dto.CertificateDTO;
import com.shubham.portfolio.model.Certificate;
import com.shubham.portfolio.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public List<CertificateDTO> getAll() {
        return certificateRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<CertificateDTO> getByCategory(String category) {
        Certificate.Category cat = Certificate.Category.valueOf(category.toUpperCase());
        return certificateRepository.findByCategoryOrderByDisplayOrderAsc(cat)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CertificateDTO mapToDTO(Certificate c) {
        return new CertificateDTO(
                c.getId(),
                c.getTitle(),
                c.getIssuer(),
                c.getIssueDate(),
                c.getCredentialId(),
                c.getCredentialUrl(),
                c.getCategory(),
                c.getDisplayOrder()
        );
    }
}
