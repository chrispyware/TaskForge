package com.taskforge.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "TASKS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_seq")
    @SequenceGenerator(name = "task_seq", sequenceName = "SEQ_TASKS", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROJECT_ID", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSIGNED_TO")
    private User assignedTo;

    @Column(nullable = false, length = 500)
    private String title;

    @Lob
    private String description;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "TODO";

    @Builder.Default
    @Column(nullable = false, length = 10)
    private String priority = "MEDIUM";

    @Column(name = "DUE_DATE")
    private LocalDate dueDate;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskComment> comments;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
