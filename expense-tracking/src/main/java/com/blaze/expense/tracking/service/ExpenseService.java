package com.blaze.expense.tracking.service;

import com.blaze.expense.tracking.dto.request.ExpenseRequest;
import com.blaze.expense.tracking.dto.response.MonthlySummaryResponse;
import com.blaze.expense.tracking.entity.Expense;
import com.blaze.expense.tracking.entity.Task;
import com.blaze.expense.tracking.entity.User;
import com.blaze.expense.tracking.repository.ExpenseRepository;
import com.blaze.expense.tracking.repository.TaskRepository;
import com.blaze.expense.tracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogService activityLogService;

    public Expense createExpense(ExpenseRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setType(request.getType());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setDescription(request.getDescription());
        expense.setUser(user);

        if (request.getTaskId() != null) {
            Task task = taskRepository.findById(request.getTaskId())
                    .orElseThrow(() -> new RuntimeException("Error: Task not found."));
            expense.setTask(task);
        }

        Expense savedExpense = expenseRepository.save(expense);
        
        String logMessage = "Logged " + request.getType().name() + " of $" + request.getAmount() + " for " + request.getCategory();
        activityLogService.logActivity(logMessage, user);

        return savedExpense;
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public MonthlySummaryResponse getMonthlySummary(Long userId, int month, int year) {
        BigDecimal totalIncome = expenseRepository.getMonthlyIncomeSummary(userId, month, year);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpense = expenseRepository.getMonthlyExpenseSummary(userId, month, year);
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new MonthlySummaryResponse(month, year, totalIncome, totalExpense, balance);
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByTask(Long taskId) {
        return expenseRepository.findByTaskId(taskId);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalExpenseForTask(Long taskId) {
        BigDecimal total = expenseRepository.getTotalExpenseByTaskId(taskId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public void deleteExpense(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Expense not found."));

        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to delete this expense.");
        }

        expenseRepository.delete(expense);
        String logMessage = "Deleted " + expense.getType().name() + " of $" + expense.getAmount() + " from " + expense.getCategory();
        activityLogService.logActivity(logMessage, expense.getUser());
    }
}
