package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.request.TaskRequest;
import com.blaze.expense.tracking.entity.Task;
import com.blaze.expense.tracking.entity.TaskStatus;
import com.blaze.expense.tracking.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import com.blaze.expense.tracking.security.UserDetailsImpl;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    private com.blaze.expense.tracking.dto.response.TaskResponse mapToTaskResponse(Task task) {
        return com.blaze.expense.tracking.dto.response.TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .projectId(task.getProject().getId())
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
                .build();
    }

    @PostMapping
    public ResponseEntity<com.blaze.expense.tracking.dto.response.TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest) {
        return ResponseEntity.ok(mapToTaskResponse(taskService.createTask(taskRequest, getCurrentUserId())));
    }

    @GetMapping
    public ResponseEntity<List<com.blaze.expense.tracking.dto.response.TaskResponse>> getTasks(
            @RequestParam Long projectId,
            @RequestParam(required = false) TaskStatus status) {
        List<com.blaze.expense.tracking.dto.response.TaskResponse> tasks = taskService.getTasksByProject(projectId, status, getCurrentUserId())
                .stream()
                .map(this::mapToTaskResponse)
                .toList();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.blaze.expense.tracking.dto.response.TaskResponse> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest taskRequest) {
        return ResponseEntity.ok(mapToTaskResponse(taskService.updateTask(id, taskRequest, getCurrentUserId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }
}
