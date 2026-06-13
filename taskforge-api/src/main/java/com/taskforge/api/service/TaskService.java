package com.taskforge.api.service;

import com.taskforge.api.dto.CreateTaskRequest;
import com.taskforge.api.dto.TaskResponse;
import com.taskforge.api.dto.UpdateTaskRequest;
import com.taskforge.api.dto.UpdateTaskStatusRequest;
import com.taskforge.api.entity.Project;
import com.taskforge.api.entity.Task;
import com.taskforge.api.entity.User;
import com.taskforge.api.repository.ProjectRepository;
import com.taskforge.api.repository.TaskRepository;
import com.taskforge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getTasksForProject(Long projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return mapToResponse(task);
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignee = null;
        if (request.getAssignedToId() != null) {
            assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .assignedTo(assignee)
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignee);
        }

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateTaskStatus(Long id, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(request.getStatus());
        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .assignedToId(task.getAssignedTo() != null
                        ? task.getAssignedTo().getId() : null)
                .assigneeName(task.getAssignedTo() != null
                        ? task.getAssignedTo().getDisplayName() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}