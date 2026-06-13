package com.taskforge.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateTaskStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "TODO|IN_PROGRESS|REVIEW|DONE",
        message = "Status must be TODO, IN_PROGRESS, REVIEW, or DONE"
    )
    private String status;
}