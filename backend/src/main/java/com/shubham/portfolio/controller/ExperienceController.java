package com.shubham.portfolio.controller;

import com.shubham.portfolio.dto.ExperienceDTO;
import com.shubham.portfolio.model.Experience;
import com.shubham.portfolio.service.ExperienceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/experience")
@RequiredArgsConstructor
@Tag(name = "Experience", description = "Internships and achievements")
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<List<ExperienceDTO>> getAllExperience() {
        return ResponseEntity.ok(experienceService.getAllExperience());
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<ExperienceDTO>> getByType(@PathVariable String type) {
        Experience.Type experienceType = Experience.Type.valueOf(type.toUpperCase());
        return ResponseEntity.ok(experienceService.getByType(experienceType));
    }
}
