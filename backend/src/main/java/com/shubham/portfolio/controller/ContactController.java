package com.shubham.portfolio.controller;

import com.shubham.portfolio.dto.ContactRequestDTO;
import com.shubham.portfolio.dto.ContactResponseDTO;
import com.shubham.portfolio.service.ContactService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Portfolio contact form endpoint")
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponseDTO> submitContact(
            @Valid @RequestBody ContactRequestDTO dto) {
        return ResponseEntity.ok(contactService.handleContact(dto));
    }
}
