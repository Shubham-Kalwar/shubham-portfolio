package com.shubham.portfolio.dto;

import com.shubham.portfolio.model.Experience;

import java.util.List;

public record ExperienceDTO(
        Long id,
        String title,
        String company,
        String period,
        Experience.Type type,
        List<String> bulletList,
        Boolean highlight,
        Integer displayOrder
) {}
