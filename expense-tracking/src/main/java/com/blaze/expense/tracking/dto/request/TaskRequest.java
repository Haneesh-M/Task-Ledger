package com.blaze.expense.tracking.dto.request;

import com.blaze.expense.tracking.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    private TaskStatus status;
    
    private LocalDate dueDate;
    
    @NotNull
    private Long projectId;
    
    private Long assignedUserId;
}
