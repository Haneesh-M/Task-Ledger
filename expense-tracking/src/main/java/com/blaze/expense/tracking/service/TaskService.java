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

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public Task createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Error: Project not found."));

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

        return taskRepository.save(task);
    }

    public List<Task> getTasksByProject(Long projectId, TaskStatus status) {
        if (status != null) {
            return taskRepository.findByProjectIdAndStatus(projectId, status);
        }
        return taskRepository.findByProjectId(projectId);
    }

    public Task updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Error: Task not found."));

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

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}
