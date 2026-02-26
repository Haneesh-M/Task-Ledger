package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.response.UserResponse;
import com.blaze.expense.tracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .blocked(user.isBlocked())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleUserBlock(@PathVariable Long id) {
        com.blaze.expense.tracking.entity.User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setBlocked(!user.isBlocked());
        userRepository.save(user);
        
        String status = user.isBlocked() ? "blocked" : "unblocked";
        return ResponseEntity.ok("User successfully " + status);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserResponse> updateProfile(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.blaze.expense.tracking.security.UserDetailsImpl userDetails,
            @jakarta.validation.Valid @RequestBody com.blaze.expense.tracking.dto.request.UpdateProfileRequest request) {

        com.blaze.expense.tracking.entity.User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        userRepository.save(user);

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .blocked(user.isBlocked())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }
}
