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

    public Project createProject(String name, String description, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setUser(user);

        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public void deleteProject(Long id, Long userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Project not found."));

        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to delete this project.");
        }

        projectRepository.delete(project);
    }
}
