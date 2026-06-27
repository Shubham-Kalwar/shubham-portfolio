package com.shubham.portfolio.config;

import com.shubham.portfolio.model.Certificate;
import com.shubham.portfolio.model.Experience;
import com.shubham.portfolio.model.Project;
import com.shubham.portfolio.model.Skill;
import com.shubham.portfolio.repository.CertificateRepository;
import com.shubham.portfolio.repository.ExperienceRepository;
import com.shubham.portfolio.repository.ProjectRepository;
import com.shubham.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificateRepository certificateRepository;

    @Override
    public void run(String... args) {
        if (projectRepository.count() > 0) {
            log.info("DataSeeder: data already exists, skipping seed.");
            return;
        }
        log.info("DataSeeder: seeding initial data...");
        seedProjects();
        seedSkills();
        seedExperience();
        seedCertificates();
        log.info("DataSeeder: seeding complete.");
    }

    // ------------------------------------------------------------------ //
    //  PROJECTS
    // ------------------------------------------------------------------ //
    private void seedProjects() {
        projectRepository.saveAll(List.of(
                Project.builder()
                        .title("DPI Engine -- Network Traffic Analyzer")
                        .shortDescription("Full-stack Deep Packet Inspection platform classifying real-time traffic across 18+ apps using Java virtual threads.")
                        .techStack("Java,Spring Boot,Angular,PostgreSQL,Redis,Pcap4J,WebSocket/STOMP,Docker")
                        .githubUrl("https://github.com/Shubham-Kalwar/dpi-engine")
                        .highlightBadge("18+ App Detection")
                        .featured(true)
                        .displayOrder(1)
                        .build(),

                Project.builder()
                        .title("NutriVision -- Food Calorie Estimation")
                        .shortDescription("Custom YOLOv4 model with 98.6% mAP accuracy for food detection with thumb-based pixel calibration for portion and calorie estimation.")
                        .techStack("Python,Flask,React,YOLOv4,OpenCV,SQLite,JWT")
                        .githubUrl("https://github.com/Shubham-Kalwar/nutrivision")
                        .highlightBadge("98.6% mAP Accuracy")
                        .featured(true)
                        .displayOrder(2)
                        .build(),

                Project.builder()
                        .title("Committee & Event Management System")
                        .shortDescription("Role-based platform (ADMIN, FACULTY, STUDENT) with QR attendance, event management, and Spring Boot REST APIs.")
                        .techStack("Java,Spring Boot,Angular,PostgreSQL,JWT,Tailwind CSS")
                        .githubUrl("https://github.com/Shubham-Kalwar/committee-management")
                        .highlightBadge("QR Attendance System")
                        .featured(true)
                        .displayOrder(3)
                        .build()
        ));
    }

    // ------------------------------------------------------------------ //
    //  SKILLS
    // ------------------------------------------------------------------ //
    private void seedSkills() {
        int order = 1;

        // LANGUAGE
        String[] languages = {"Java", "JavaScript", "Python", "SQL"};
        for (String name : languages) {
            skillRepository.save(Skill.builder().name(name).category(Skill.Category.LANGUAGE).displayOrder(order++).build());
        }

        // FRONTEND
        String[] frontend = {"Angular", "React", "HTML/CSS", "Bootstrap", "Tailwind CSS"};
        for (String name : frontend) {
            skillRepository.save(Skill.builder().name(name).category(Skill.Category.FRONTEND).displayOrder(order++).build());
        }

        // BACKEND
        String[] backend = {"Spring Boot", "Flask", "Node.js", "Express.js", "FastAPI"};
        for (String name : backend) {
            skillRepository.save(Skill.builder().name(name).category(Skill.Category.BACKEND).displayOrder(order++).build());
        }

        // DATABASE
        String[] databases = {"PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite"};
        for (String name : databases) {
            skillRepository.save(Skill.builder().name(name).category(Skill.Category.DATABASE).displayOrder(order++).build());
        }

        // DEVOPS
        String[] devops = {"Docker", "AWS", "Git", "Vercel", "Railway"};
        for (String name : devops) {
            skillRepository.save(Skill.builder().name(name).category(Skill.Category.DEVOPS).displayOrder(order++).build());
        }

        // TOOLS
        String[] tools = {"WebSocket/STOMP", "YOLOv4", "OpenCV", "Postman", "Swagger"};
        for (String name : tools) {
            skillRepository.save(Skill.builder().name(name).category(Skill.Category.TOOLS).displayOrder(order++).build());
        }
    }

    // ------------------------------------------------------------------ //
    //  EXPERIENCE  (internships only)
    // ------------------------------------------------------------------ //
    private void seedExperience() {
        experienceRepository.saveAll(List.of(
                Experience.builder()
                        .type(Experience.Type.INTERNSHIP)
                        .title("Web Development Intern")
                        .company("Elevate Labs")
                        .period("Aug 2025 - Sep 2025")
                        .highlight(true)
                        .bullets("Developed and maintained web applications using modern frontend and backend technologies" +
                                "|Recognized as Best Performer for exceptional contribution and professionalism")
                        .displayOrder(1)
                        .build(),

                Experience.builder()
                        .type(Experience.Type.INTERNSHIP)
                        .title("Human Resources Intern")
                        .company("Pracverse Private Limited")
                        .period("Dec 2025 - Feb 2026")
                        .highlight(false)
                        .bullets("Assisted in recruitment, candidate screening, and employee engagement operations" +
                                "|Demonstrated strong analytical and communication skills")
                        .displayOrder(2)
                        .build()
        ));
    }

    // ------------------------------------------------------------------ //
    //  CERTIFICATES
    // ------------------------------------------------------------------ //
    private void seedCertificates() {
        certificateRepository.saveAll(List.of(
                // ── CERTIFICATION (9 rows) ──────────────────────────────────────
                Certificate.builder().title("PLACEHOLDER - Certification 1").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-001").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(1).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 2").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-002").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(2).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 3").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-003").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(3).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 4").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-004").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(4).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 5").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-005").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(5).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 6").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-006").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(6).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 7").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-007").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(7).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 8").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-008").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(8).build(),
                Certificate.builder().title("PLACEHOLDER - Certification 9").issuer("PLACEHOLDER - Issuer").issueDate("PLACEHOLDER - Month Year").credentialId("PLACEHOLDER-ID-009").credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.CERTIFICATION).displayOrder(9).build(),

                // ── ACHIEVEMENT (5 rows) ────────────────────────────────────────
                Certificate.builder().title("PLACEHOLDER - Achievement 1").issuer("PLACEHOLDER - Org/Event").issueDate("PLACEHOLDER - Month Year").credentialId(null).credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.ACHIEVEMENT).displayOrder(1).build(),
                Certificate.builder().title("PLACEHOLDER - Achievement 2").issuer("PLACEHOLDER - Org/Event").issueDate("PLACEHOLDER - Month Year").credentialId(null).credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.ACHIEVEMENT).displayOrder(2).build(),
                Certificate.builder().title("PLACEHOLDER - Achievement 3").issuer("PLACEHOLDER - Org/Event").issueDate("PLACEHOLDER - Month Year").credentialId(null).credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.ACHIEVEMENT).displayOrder(3).build(),
                Certificate.builder().title("PLACEHOLDER - Achievement 4").issuer("PLACEHOLDER - Org/Event").issueDate("PLACEHOLDER - Month Year").credentialId(null).credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.ACHIEVEMENT).displayOrder(4).build(),
                Certificate.builder().title("PLACEHOLDER - Achievement 5").issuer("PLACEHOLDER - Org/Event").issueDate("PLACEHOLDER - Month Year").credentialId(null).credentialUrl("https://PLACEHOLDER.com").category(Certificate.Category.ACHIEVEMENT).displayOrder(5).build()
        ));
    }
}
