package com.shubham.portfolio.dto;

import java.util.List;

public record ProjectDTO(
        Long id,
        String title,
        String shortDescription,
        String fullDescription,
        List<String> techStackList,
        String githubUrl,
        String liveUrl,
        String highlightBadge,
        Integer displayOrder,
        Boolean featured
) {}
