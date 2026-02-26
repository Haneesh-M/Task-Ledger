package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.request.ProjectRequest;
import com.blaze.expense.tracking.entity.Project;
import com.blaze.expense.tracking.security.UserDetailsImpl;
import com.blaze.expense.tracking.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    private com.blaze.expense.tracking.dto.response.ProjectResponse mapToProjectResponse(Project project, String message) {
        return com.blaze.expense.tracking.dto.response.ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .userId(project.getUser().getId())
                .message(message)
                .build();
    }

    @PostMapping
    public ResponseEntity<com.blaze.expense.tracking.dto.response.ProjectResponse> createProject(@Valid @RequestBody ProjectRequest projectRequest) {
        Project project = projectService.createProject(
                projectRequest.getName(),
                projectRequest.getDescription(),
                getCurrentUserId()
        );
        return ResponseEntity.ok(mapToProjectResponse(project, "Project created successfully."));
    }

    @GetMapping
    public ResponseEntity<List<com.blaze.expense.tracking.dto.response.ProjectResponse>> getAllProjects() {
        List<com.blaze.expense.tracking.dto.response.ProjectResponse> projects = projectService.getProjectsByUser(getCurrentUserId())
                .stream()
                .map(project -> mapToProjectResponse(project, null))
                .toList();
        return ResponseEntity.ok(projects);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                                 .body(new com.blaze.expense.tracking.dto.response.MessageResponse("Error: Only Admins can delete projects."));
        }
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}
