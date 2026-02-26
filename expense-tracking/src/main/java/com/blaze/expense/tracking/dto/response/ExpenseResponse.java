package com.blaze.expense.tracking.dto.response;

import com.blaze.expense.tracking.entity.ExpenseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private BigDecimal amount;
    private ExpenseType type;
    private String category;
    private LocalDate date;
    private String description;
    private Long userId;
    private Long taskId;
    private String taskTitle;
}
