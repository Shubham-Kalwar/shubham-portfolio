package com.shubham.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certificate")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String issuer;

    @Column(name = "issue_date")
    private String issueDate;

    @Column(name = "credential_id")
    private String credentialId;

    @Column(name = "credential_url")
    private String credentialUrl;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(name = "display_order")
    private Integer displayOrder;

    public enum Category {
        CERTIFICATION,
        ACHIEVEMENT
    }
}
