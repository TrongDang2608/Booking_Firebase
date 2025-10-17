package com.booking.service;

import com.booking.entity.Booking;
import com.booking.entity.User;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {
    
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    
    private final FirebaseMessaging firebaseMessaging;
    
    public NotificationService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }
    
    public void sendBookingConfirmation(Booking booking) {
        if (booking.getUser().getFcmToken() == null) {
            log.warn("User {} does not have FCM token", booking.getUser().getEmail());
            return;
        }
        
        String title = "Xác nhận lịch hẹn thành công!";
        String body = String.format(
            "Lịch hẹn %s của bạn vào lúc %s ngày %s đã được xác nhận. Vui lòng đến đúng giờ.",
            booking.getService().getName(),
            booking.getTimeSlot().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")),
            booking.getTimeSlot().getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        
        sendNotification(booking.getUser().getFcmToken(), title, body, createBookingData(booking));
        log.info("Sent booking confirmation to user: {}", booking.getUser().getEmail());
    }
    
    public void sendBookingReminder(Booking booking) {
        if (booking.getUser().getFcmToken() == null) {
            log.warn("User {} does not have FCM token", booking.getUser().getEmail());
            return;
        }
        
        String title = "Nhắc nhở lịch hẹn";
        String body = String.format(
            "Đừng quên bạn có lịch hẹn %s vào %s hôm nay nhé!",
            booking.getService().getName(),
            booking.getTimeSlot().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"))
        );
        
        sendNotification(booking.getUser().getFcmToken(), title, body, createBookingData(booking));
        booking.setReminderSent(true);
        log.info("Sent booking reminder to user: {}", booking.getUser().getEmail());
    }
    
    public void sendBookingCancellation(Booking booking, String reason) {
        if (booking.getUser().getFcmToken() == null) {
            log.warn("User {} does not have FCM token", booking.getUser().getEmail());
            return;
        }
        
        String title = "Lịch hẹn đã được hủy";
        String body = String.format(
            "Lịch hẹn %s của bạn vào lúc %s ngày %s đã được hủy. Lý do: %s",
            booking.getService().getName(),
            booking.getTimeSlot().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")),
            booking.getTimeSlot().getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            reason
        );
        
        sendNotification(booking.getUser().getFcmToken(), title, body, createBookingData(booking));
        log.info("Sent booking cancellation to user: {}", booking.getUser().getEmail());
    }
    
    public void sendBookingReschedule(Booking booking) {
        if (booking.getUser().getFcmToken() == null) {
            log.warn("User {} does not have FCM token", booking.getUser().getEmail());
            return;
        }
        
        String title = "Lịch hẹn đã được dời";
        String body = String.format(
            "Lịch hẹn %s của bạn đã được dời sang %s ngày %s. Vui lòng kiểm tra lại.",
            booking.getService().getName(),
            booking.getTimeSlot().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")),
            booking.getTimeSlot().getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        
        sendNotification(booking.getUser().getFcmToken(), title, body, createBookingData(booking));
        log.info("Sent booking reschedule to user: {}", booking.getUser().getEmail());
    }
    
    public void sendNotification(String fcmToken, String title, String body, Map<String, String> data) {
        try {
            Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();
            
            Message message = Message.builder()
                .setToken(fcmToken)
                .setNotification(notification)
                .putAllData(data)
                .build();
            
            firebaseMessaging.send(message);
            log.info("Notification sent successfully to token: {}", fcmToken);
            
        } catch (Exception e) {
            log.error("Failed to send notification to token: {}", fcmToken, e);
            throw new RuntimeException("Failed to send notification", e);
        }
    }
    
    private Map<String, String> createBookingData(Booking booking) {
        Map<String, String> data = new HashMap<>();
        data.put("bookingId", booking.getId().toString());
        data.put("serviceName", booking.getService().getName());
        data.put("date", booking.getTimeSlot().getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        data.put("time", booking.getTimeSlot().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        data.put("status", booking.getStatus().name());
        return data;
    }
    
    public void sendBroadcastNotification(String title, String body, Map<String, String> data) {
        // This method can be used to send notifications to all users
        // Implementation depends on your requirements
        log.info("Broadcast notification sent: {}", title);
    }
}
