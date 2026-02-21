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

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

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

        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public MonthlySummaryResponse getMonthlySummary(Long userId, int month, int year) {
        BigDecimal totalIncome = expenseRepository.getMonthlyIncomeSummary(userId, month, year);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpense = expenseRepository.getMonthlyExpenseSummary(userId, month, year);
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new MonthlySummaryResponse(month, year, totalIncome, totalExpense, balance);
    }

    public List<Expense> getExpensesByTask(Long taskId) {
        return expenseRepository.findByTaskId(taskId);
    }

    public BigDecimal getTotalExpenseForTask(Long taskId) {
        BigDecimal total = expenseRepository.getTotalExpenseByTaskId(taskId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
