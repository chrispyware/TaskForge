package com.taskforge.api.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Long projectId;
    private String projectName;
    private Long assignedToId;
    private String assigneeName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}