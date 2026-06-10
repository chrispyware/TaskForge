package com.taskforge.api.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTaskRequest {

    @Size(min = 1, max = 500, message = "Title must be between 1 and 500 characters")
    private String title;

    private String description;
    private String status;
    private String priority;
    private Long assignedToId;
    private LocalDate dueDate;
}