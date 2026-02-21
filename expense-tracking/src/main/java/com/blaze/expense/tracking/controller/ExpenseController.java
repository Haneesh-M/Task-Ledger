package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.request.ExpenseRequest;
import com.blaze.expense.tracking.dto.response.MonthlySummaryResponse;
import com.blaze.expense.tracking.entity.Expense;
import com.blaze.expense.tracking.security.UserDetailsImpl;
import com.blaze.expense.tracking.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody ExpenseRequest expenseRequest) {
        return ResponseEntity.ok(expenseService.createExpense(expenseRequest, getCurrentUserId()));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getExpensesByUser(getCurrentUserId()));
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        
        LocalDate now = LocalDate.now();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        int targetYear = (year != null) ? year : now.getYear();

        return ResponseEntity.ok(expenseService.getMonthlySummary(getCurrentUserId(), targetMonth, targetYear));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Expense>> getExpensesByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(expenseService.getExpensesByTask(taskId));
    }

    @GetMapping("/task/{taskId}/total")
    public ResponseEntity<BigDecimal> getTotalExpenseForTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(expenseService.getTotalExpenseForTask(taskId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
}
