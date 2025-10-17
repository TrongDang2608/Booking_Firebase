package com.booking.controller;

import com.booking.entity.User;
import com.booking.service.NotificationService;
import com.booking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @PostMapping("/test")
    public ResponseEntity<?> testNotification(@RequestBody TestNotificationRequest request) {
        try {
            User user = userService.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getFcmToken() == null) {
                throw new RuntimeException("User has no FCM token registered");
            }

            Map<String, String> data = new HashMap<>();
            data.put("type", "test");
            data.put("message", request.getMessage());

            notificationService.sendNotification(
                user.getFcmToken(),
                "Test Notification",
                request.getMessage(),
                data
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}

class TestNotificationRequest {
    private Long userId;
    private String message;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}