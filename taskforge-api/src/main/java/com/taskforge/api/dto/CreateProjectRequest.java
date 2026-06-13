package com.taskforge.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 200, message = "Project name must be between 2 and 200 characters")
    private String name;

    private String description;
}