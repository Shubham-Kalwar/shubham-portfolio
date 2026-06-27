package com.shubham.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "experience")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    private String period;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(columnDefinition = "TEXT")
    private String bullets;

    private Boolean highlight;


    @Column(name = "display_order")
    private Integer displayOrder;

    public enum Type {
        INTERNSHIP,
        ACHIEVEMENT
    }
}
