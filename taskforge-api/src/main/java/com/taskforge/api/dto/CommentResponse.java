package com.taskforge.api.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String body;
    private Long authorId;
    private String authorName;
    private Long taskId;
    private Instant createdAt;
}