package com.blaze.expense.tracking.service;

import com.blaze.expense.tracking.entity.ActivityLog;
import com.blaze.expense.tracking.entity.User;
import com.blaze.expense.tracking.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void logActivity(String message, User user) {
        ActivityLog log = ActivityLog.builder()
                .message(message)
                .timestamp(LocalDateTime.now())
                .user(user)
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
