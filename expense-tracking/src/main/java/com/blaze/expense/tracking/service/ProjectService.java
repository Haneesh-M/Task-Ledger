package com.blaze.expense.tracking.service;

import com.blaze.expense.tracking.entity.Project;
import com.blaze.expense.tracking.entity.User;
import com.blaze.expense.tracking.repository.ProjectRepository;
import com.blaze.expense.tracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public Project createProject(String name, String description, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setUser(user);

        Project savedProject = projectRepository.save(project);
        activityLogService.logActivity("Created project: " + savedProject.getName(), user);
        return savedProject;
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Project not found."));

        projectRepository.delete(project);
        activityLogService.logActivity("Deleted project: " + project.getName(), project.getUser());
    }
}
