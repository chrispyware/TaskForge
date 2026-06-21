package com.taskforge.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    
    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 30, message = "Displayname must be between 2 and 30 characters")
    private String displayName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;
}
