package com.taskforge.api.service;

import com.taskforge.api.dto.AuthResponse;
import com.taskforge.api.dto.LoginRequest;
import com.taskforge.api.dto.RegisterRequest;
import com.taskforge.api.entity.User;
import com.taskforge.api.repository.UserRepository;
import com.taskforge.api.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getDisplayName(),
                user.getRole()
        );
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .role("USER")
                .build();

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getDisplayName(),
                user.getRole()
        );
    }
}