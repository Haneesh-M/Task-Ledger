package com.blaze.expense.tracking.repository;

import com.blaze.expense.tracking.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    
    List<Expense> findByTaskId(Long taskId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.task.id = :taskId AND e.type = 'EXPENSE'")
    BigDecimal getTotalExpenseByTaskId(@Param("taskId") Long taskId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.type = 'EXPENSE' AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year")
    BigDecimal getMonthlyExpenseSummary(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.type = 'INCOME' AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year")
    BigDecimal getMonthlyIncomeSummary(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
