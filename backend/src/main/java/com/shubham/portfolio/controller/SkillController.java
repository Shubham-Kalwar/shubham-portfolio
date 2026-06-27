package com.shubham.portfolio.controller;

import com.shubham.portfolio.dto.SkillDTO;
import com.shubham.portfolio.model.Skill;
import com.shubham.portfolio.service.SkillService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Tag(name = "Skills", description = "Portfolio skills grouped by category")
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<Map<Skill.Category, List<SkillDTO>>> getSkillsGrouped() {
        return ResponseEntity.ok(skillService.getSkillsGroupedByCategory());
    }
}
