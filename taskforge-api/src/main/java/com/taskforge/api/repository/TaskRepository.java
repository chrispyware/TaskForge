package com.taskforge.api.repository;

import com.taskforge.api.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedId(Long userId);
    List<Task> findByProjectIdAndStatus(Long projectId, String status);
}
