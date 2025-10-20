package com.booking.controller;

import com.booking.dto.BookingResponse;
import com.booking.entity.Service;
import com.booking.entity.TimeSlot;
import com.booking.entity.User;
import com.booking.service.BookingService;
import com.booking.service.ServiceService;
import com.booking.service.TimeSlotService;
import com.booking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin") // Tất cả API trong này sẽ bắt đầu bằng /api/admin
public class AdminController {

    private final BookingService bookingService;
    private final UserService userService;
    private final ServiceService serviceService;
    private final TimeSlotService timeSlotService;

    public AdminController(BookingService bookingService, UserService userService, ServiceService serviceService, TimeSlotService timeSlotService) {
        this.bookingService = bookingService;
        this.userService = userService;
        this.serviceService = serviceService;
        this.timeSlotService = timeSlotService;
    }

    // API để lấy tất cả các lịch hẹn
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.findAll()
                .stream()
                .map(BookingResponse::fromBooking)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    // API để lấy tất cả người dùng
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    // API để lấy tất cả dịch vụ
    @GetMapping("/services")
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    // API để lấy tất cả khung giờ
    @GetMapping("/timeslots")
    public ResponseEntity<List<TimeSlot>> getAllTimeSlots() {
        return ResponseEntity.ok(timeSlotService.findAll());
    }

    // API để xác nhận một lịch hẹn
    @PutMapping("/bookings/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            bookingService.confirmBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // API để hủy một lịch hẹn
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, @RequestParam String reason) {
        try {
            bookingService.cancelBookingByAdmin(id, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // API để đánh dấu một lịch hẹn là hoàn thành
    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        try {
            bookingService.completeBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}