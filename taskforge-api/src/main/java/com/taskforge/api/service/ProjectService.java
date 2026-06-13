package com.taskforge.api.service;

import com.taskforge.api.dto.CreateProjectRequest;
import com.taskforge.api.dto.ProjectResponse;
import com.taskforge.api.entity.Project;
import com.taskforge.api.entity.User;
import com.taskforge.api.repository.ProjectRepository;
import com.taskforge.api.repository.TaskRepository;
import com.taskforge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public List<ProjectResponse> getProjectsForCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return projectRepository.findByOwnerId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToResponse(project);
    }

    public ProjectResponse createProject(CreateProjectRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.deleteById(id);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerId(project.getOwner().getId())
                .ownerName(project.getOwner().getDisplayName())
                .taskCount(taskRepository.findByProjectId(project.getId()).size())
                .createdAt(project.getCreatedAt())
                .build();
    }
}