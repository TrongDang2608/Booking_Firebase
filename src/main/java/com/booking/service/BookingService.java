package com.booking.service;

import com.booking.entity.Booking;
// import com.booking.entity.Service; // Avoid conflict with @Service annotation
import com.booking.entity.TimeSlot;
import com.booking.entity.User;
import com.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final ServiceService serviceService;
    private final TimeSlotService timeSlotService;
    private final NotificationService notificationService;
    
    public BookingService(BookingRepository bookingRepository, UserService userService, 
                         ServiceService serviceService, TimeSlotService timeSlotService, 
                         NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.serviceService = serviceService;
        this.timeSlotService = timeSlotService;
        this.notificationService = notificationService;
    }
    
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }
    
    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<Booking> findByUser(User user) {
        return bookingRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<Booking> findByDate(LocalDate date) {
        return bookingRepository.findByTimeSlotDateOrderByTimeSlotStartTime(date);
    }
    
    public List<Booking> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findBookingsByDateRange(startDate, endDate);
    }
    
    public List<Booking> findByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public Booking createBooking(Long userId, Long serviceId, Long timeSlotId, String notes) {
        // Validate entities
        User user = userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        com.booking.entity.Service service = serviceService.findById(serviceId)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + serviceId));
        
        TimeSlot timeSlot = timeSlotService.findById(timeSlotId)
            .orElseThrow(() -> new RuntimeException("TimeSlot not found with id: " + timeSlotId));
        
        // Check if time slot is available
        if (!timeSlot.getIsAvailable()) {
            throw new RuntimeException("Khung giờ đã được đặt hoặc không khả dụng");
        }
        
        // Check if time slot is already booked
        Optional<Booking> existingBooking = bookingRepository.findByTimeSlotId(timeSlotId);
        if (existingBooking.isPresent() && 
            !existingBooking.get().getStatus().equals(Booking.BookingStatus.CANCELLED)) {
            throw new RuntimeException("Khung giờ đã được đặt bởi người khác");
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setTimeSlot(timeSlot);
        booking.setNotes(notes);
        booking.setStatus(Booking.BookingStatus.PENDING);
        
        Booking savedBooking = save(booking);
        
        // Mark time slot as unavailable
        timeSlotService.markAsUnavailable(timeSlotId);
        
        return savedBooking;
    }
    
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        
        if (!booking.getStatus().equals(Booking.BookingStatus.PENDING)) {
            throw new RuntimeException("Chỉ có thể xác nhận lịch hẹn đang chờ");
        }
        
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        Booking confirmedBooking = save(booking);
        
        // Send confirmation notification
        notificationService.sendBookingConfirmation(confirmedBooking);
        booking.setConfirmationSent(true);
        save(booking);
        
        return confirmedBooking;
    }
    
    public Booking cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus().equals(Booking.BookingStatus.CANCELLED)) {
            throw new RuntimeException("Lịch hẹn đã được hủy trước đó");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setNotes(booking.getNotes() + "\nLý do hủy: " + reason);
        Booking cancelledBooking = save(booking);
        
        // Mark time slot as available again
        timeSlotService.markAsAvailable(booking.getTimeSlot().getId());
        
        // Send cancellation notification
        notificationService.sendBookingCancellation(cancelledBooking, reason);
        
        return cancelledBooking;
    }
    
    public Booking rescheduleBooking(Long bookingId, Long newTimeSlotId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        
        TimeSlot newTimeSlot = timeSlotService.findById(newTimeSlotId)
            .orElseThrow(() -> new RuntimeException("TimeSlot not found with id: " + newTimeSlotId));
        
        if (!newTimeSlot.getIsAvailable()) {
            throw new RuntimeException("Khung giờ mới không khả dụng");
        }
        
        // Mark old time slot as available
        timeSlotService.markAsAvailable(booking.getTimeSlot().getId());
        
        // Update booking with new time slot
        booking.setTimeSlot(newTimeSlot);
        booking.setStatus(Booking.BookingStatus.RESCHEDULED);
        
        // Mark new time slot as unavailable
        timeSlotService.markAsUnavailable(newTimeSlotId);
        
        Booking rescheduledBooking = save(booking);
        
        // Send reschedule notification
        notificationService.sendBookingReschedule(rescheduledBooking);
        
        return rescheduledBooking;
    }
    
    public List<Booking> findBookingsForReminder(LocalDate date, LocalTime time) {
        return bookingRepository.findBookingsForReminder(date, time);
    }
    
    public List<Booking> findBookingsPendingConfirmation() {
        return bookingRepository.findBookingsPendingConfirmation();
    }
}
