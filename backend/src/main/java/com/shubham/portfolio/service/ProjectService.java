package com.shubham.portfolio.service;

import com.shubham.portfolio.dto.ProjectDTO;
import com.shubham.portfolio.model.Project;
import com.shubham.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ProjectDTO> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private ProjectDTO toDTO(Project p) {
        List<String> techStackList = (p.getTechStack() != null && !p.getTechStack().isBlank())
                ? Arrays.stream(p.getTechStack().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        return new ProjectDTO(
                p.getId(),
                p.getTitle(),
                p.getShortDescription(),
                p.getFullDescription(),
                techStackList,
                p.getGithubUrl(),
                p.getLiveUrl(),
                p.getHighlightBadge(),
                p.getDisplayOrder(),
                p.getFeatured()
        );
    }
}
