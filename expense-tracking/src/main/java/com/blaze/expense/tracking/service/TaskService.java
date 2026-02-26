package com.blaze.expense.tracking.service;

import com.blaze.expense.tracking.dto.request.TaskRequest;
import com.blaze.expense.tracking.entity.Project;
import com.blaze.expense.tracking.entity.Task;
import com.blaze.expense.tracking.entity.TaskStatus;
import com.blaze.expense.tracking.entity.User;
import com.blaze.expense.tracking.repository.ProjectRepository;
import com.blaze.expense.tracking.repository.TaskRepository;
import com.blaze.expense.tracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public Task createTask(TaskRequest request, Long userId) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Error: Project not found."));

        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to add tasks to this project.");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setProject(project);

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Error: Assigned user not found."));
            task.setAssignedUser(assignedUser);
        }

        Task savedTask = taskRepository.save(task);
        activityLogService.logActivity("Created task: " + savedTask.getTitle(), project.getUser());
        return savedTask;
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByProject(Long projectId, TaskStatus status, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Error: Project not found."));

        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to view tasks in this project.");
        }

        if (status != null) {
            return taskRepository.findByProjectIdAndStatus(projectId, status);
        }
        return taskRepository.findByProjectId(projectId);
    }

    public Task updateTask(Long taskId, TaskRequest request, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Error: Task not found."));

        if (!task.getProject().getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to modify this task.");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Error: Assigned user not found."));
            task.setAssignedUser(assignedUser);
        } else {
            task.setAssignedUser(null);
        }

        Task savedTask = taskRepository.save(task);
        activityLogService.logActivity("Updated task status to " + request.getStatus() + ": " + savedTask.getTitle(), task.getProject().getUser());
        return savedTask;
    }

    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Error: Task not found."));

        if (!task.getProject().getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to delete this task.");
        }

        taskRepository.delete(task);
        activityLogService.logActivity("Deleted task: " + task.getTitle(), task.getProject().getUser());
    }
}
