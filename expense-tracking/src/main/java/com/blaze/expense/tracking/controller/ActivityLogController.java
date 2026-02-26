package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.ActivityLogResponse;
import com.blaze.expense.tracking.entity.ActivityLog;
import com.blaze.expense.tracking.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<List<ActivityLogResponse>> getRecentActivities() {
        List<ActivityLogResponse> responses = activityLogService.getRecentActivities().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private ActivityLogResponse mapToResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .message(log.getMessage())
                .timestamp(log.getTimestamp())
                .userName(log.getUser() != null ? log.getUser().getName() : "System")
                .build();
    }
}
