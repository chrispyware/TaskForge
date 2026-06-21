package com.taskforge.api.service;

import com.taskforge.api.dto.UserResponse;
import com.taskforge.api.entity.User;
import com.taskforge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public List<UserResponse> searchUsers(String query) {
        return userRepository.findByDisplayNameContainingIgnoreCase(query)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .build();
    }
}
