package com.booking.service;

import com.booking.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class ScheduledNotificationService {
    
    private static final Logger log = LoggerFactory.getLogger(ScheduledNotificationService.class);
    
    private final BookingService bookingService;
    private final NotificationService notificationService;
    
    public ScheduledNotificationService(BookingService bookingService, NotificationService notificationService) {
        this.bookingService = bookingService;
        this.notificationService = notificationService;
    }
    
    @Value("${booking.reminder.advance-hours:24}")
    private int advanceReminderHours;
    
    @Value("${booking.reminder.before-appointment-hours:1}")
    private int beforeAppointmentHours;
    
    /**
     * Chạy mỗi 5 phút để kiểm tra các lịch hẹn cần gửi thông báo nhắc nhở
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void sendReminderNotifications() {
        try {
            // Gửi thông báo nhắc nhở trước 24 giờ
            sendAdvanceReminders();
            
            // Gửi thông báo nhắc nhở trước 1 giờ
            sendBeforeAppointmentReminders();
            
        } catch (Exception e) {
            log.error("Error in scheduled notification service", e);
        }
    }
    
    /**
     * Gửi thông báo nhắc nhở trước 24 giờ (hoặc theo cấu hình)
     */
    private void sendAdvanceReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalTime currentTime = LocalTime.now();
        
        // Tìm tất cả các lịch hẹn ngày mai tại thời điểm hiện tại
        for (int hour = 0; hour < 24; hour++) {
            LocalTime appointmentTime = LocalTime.of(hour, 0);
            if (appointmentTime.isAfter(currentTime)) {
                continue; // Chỉ xử lý các lịch hẹn sau thời điểm hiện tại
            }
            
            try {
                var bookings = bookingService.findBookingsForReminder(tomorrow, appointmentTime);
                for (Booking booking : bookings) {
                    if (!booking.getReminderSent()) {
                        notificationService.sendBookingReminder(booking);
                        log.info("Sent advance reminder for booking ID: {}", booking.getId());
                    }
                }
            } catch (Exception e) {
                log.error("Error sending advance reminder for time: {}", appointmentTime, e);
            }
        }
    }
    
    /**
     * Gửi thông báo nhắc nhở trước 1 giờ
     */
    private void sendBeforeAppointmentReminders() {
        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        LocalTime oneHourFromNow = currentTime.plusHours(1);
        
        // Làm tròn xuống giờ để tìm các lịch hẹn trong 1 giờ tới
        LocalTime targetTime = LocalTime.of(oneHourFromNow.getHour(), 0);
        
        try {
            var bookings = bookingService.findBookingsForReminder(today, targetTime);
            for (Booking booking : bookings) {
                // Kiểm tra xem có cần gửi thông báo nhắc nhở cuối cùng không
                if (!booking.getReminderSent() || shouldSendFinalReminder(booking)) {
                    notificationService.sendBookingReminder(booking);
                    log.info("Sent final reminder for booking ID: {}", booking.getId());
                }
            }
        } catch (Exception e) {
            log.error("Error sending final reminder for time: {}", targetTime, e);
        }
    }
    
    /**
     * Kiểm tra xem có nên gửi thông báo nhắc nhở cuối cùng không
     */
    private boolean shouldSendFinalReminder(Booking booking) {
        LocalTime appointmentTime = booking.getTimeSlot().getStartTime();
        LocalTime currentTime = LocalTime.now();
        
        // Gửi thông báo nhắc nhở cuối cùng nếu còn 1 giờ hoặc ít hơn
        return currentTime.plusHours(1).isAfter(appointmentTime) && 
               currentTime.isBefore(appointmentTime);
    }
    
    /**
     * Chạy mỗi 10 phút để gửi thông báo xác nhận cho các lịch hẹn mới
     */
    @Scheduled(fixedRate = 600000) // 10 minutes
    @Transactional
    public void sendConfirmationNotifications() {
        try {
            var bookings = bookingService.findBookingsPendingConfirmation();
            for (Booking booking : bookings) {
                if (!booking.getConfirmationSent()) {
                    notificationService.sendBookingConfirmation(booking);
                    log.info("Sent confirmation notification for booking ID: {}", booking.getId());
                }
            }
        } catch (Exception e) {
            log.error("Error sending confirmation notifications", e);
        }
    }
    
    /**
     * Chạy hàng ngày lúc 9:00 AM để tạo báo cáo
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void generateDailyReport() {
        try {
            LocalDate today = LocalDate.now();
            var bookings = bookingService.findByDate(today);
            
            log.info("Daily booking report for {}: {} bookings", today, bookings.size());
            
            // Có thể gửi báo cáo cho admin qua email hoặc notification
            // implementation tùy theo yêu cầu
            
        } catch (Exception e) {
            log.error("Error generating daily report", e);
        }
    }
}
