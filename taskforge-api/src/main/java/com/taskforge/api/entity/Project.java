package com.taskforge.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.List;
import java.time.Instant;

@Entity
@Table(name = "PROJECTS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
    @SequenceGenerator(name = "project_seq", sequenceName = "SEQ_PROJECTS", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Lob
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OWNER_ID", nullable = false)
    private Long owner;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private Instant createdAt;
}
