package com.taskforge.api.service;

import com.taskforge.api.dto.CommentResponse;
import com.taskforge.api.dto.CreateCommentRequest;
import com.taskforge.api.entity.Task;
import com.taskforge.api.entity.TaskComment;
import com.taskforge.api.entity.User;
import com.taskforge.api.repository.TaskCommentRepository;
import com.taskforge.api.repository.TaskRepository;
import com.taskforge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final TaskCommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getCommentsForTask(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CommentResponse addComment(Long taskId, CreateCommentRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TaskComment comment = TaskComment.builder()
                .body(request.getBody())
                .task(task)
                .author(author)
                .build();

        return mapToResponse(commentRepository.save(comment));
    }

    private CommentResponse mapToResponse(TaskComment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .body(comment.getBody())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getDisplayName())
                .taskId(comment.getTask().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}