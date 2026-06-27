package com.shubham.portfolio.repository;

import com.shubham.portfolio.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findAllByOrderByDisplayOrderAsc();

    List<Experience> findByTypeOrderByDisplayOrderAsc(Experience.Type type);
}
