package com.taskforge.api.controller;

import com.taskforge.api.dto.CommentResponse;
import com.taskforge.api.dto.CreateCommentRequest;
import com.taskforge.api.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{taskId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsForTask(taskId));
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(commentService.addComment(taskId, request));
    }
}