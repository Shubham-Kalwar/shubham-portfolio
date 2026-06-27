package com.shubham.portfolio.dto;

import com.shubham.portfolio.model.Skill;

public record SkillDTO(
        Long id,
        String name,
        Skill.Category category,
        Integer displayOrder
) {}
