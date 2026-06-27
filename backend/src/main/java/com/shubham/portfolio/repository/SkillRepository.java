package com.shubham.portfolio.repository;

import com.shubham.portfolio.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByOrderByDisplayOrderAsc();

    List<Skill> findByCategoryOrderByDisplayOrderAsc(Skill.Category category);
}
