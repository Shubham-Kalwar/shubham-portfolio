package com.shubham.portfolio.service;

import com.shubham.portfolio.dto.ExperienceDTO;
import com.shubham.portfolio.model.Experience;
import com.shubham.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public List<ExperienceDTO> getAllExperience() {
        return experienceRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ExperienceDTO> getByType(Experience.Type type) {
        return experienceRepository.findByTypeOrderByDisplayOrderAsc(type)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private ExperienceDTO toDTO(Experience e) {
        List<String> bulletList = (e.getBullets() != null && !e.getBullets().isBlank())
                ? Arrays.stream(e.getBullets().split("\\|"))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        return new ExperienceDTO(
                e.getId(),
                e.getTitle(),
                e.getCompany(),
                e.getPeriod(),
                e.getType(),
                bulletList,
                e.getHighlight(),
                e.getDisplayOrder()
        );
    }
}
