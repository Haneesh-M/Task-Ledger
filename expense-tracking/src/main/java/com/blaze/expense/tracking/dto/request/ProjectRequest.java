package com.blaze.expense.tracking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ProjectRequest {
    @NotBlank
    private String name;
    
    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
