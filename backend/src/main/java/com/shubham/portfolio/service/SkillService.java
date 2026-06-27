package com.shubham.portfolio.service;

import com.shubham.portfolio.dto.SkillDTO;
import com.shubham.portfolio.model.Skill;
import com.shubham.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    /**
     * Returns skills grouped by category in the fixed order:
     * LANGUAGE → FRONTEND → BACKEND → DATABASE → DEVOPS → TOOLS
     */
    public Map<Skill.Category, List<SkillDTO>> getSkillsGroupedByCategory() {
        List<SkillDTO> all = skillRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDTO)
                .toList();

        // Fixed insertion order
        Map<Skill.Category, List<SkillDTO>> grouped = new LinkedHashMap<>();
        for (Skill.Category category : List.of(
                Skill.Category.LANGUAGE,
                Skill.Category.FRONTEND,
                Skill.Category.BACKEND,
                Skill.Category.DATABASE,
                Skill.Category.DEVOPS,
                Skill.Category.TOOLS
        )) {
            List<SkillDTO> skills = all.stream()
                    .filter(s -> s.category() == category)
                    .toList();
            if (!skills.isEmpty()) {
                grouped.put(category, skills);
            }
        }
        return grouped;
    }

    private SkillDTO toDTO(Skill s) {
        return new SkillDTO(s.getId(), s.getName(), s.getCategory(), s.getDisplayOrder());
    }
}
