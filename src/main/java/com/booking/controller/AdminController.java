package com.booking.controller;

import com.booking.dto.BookingResponse;
import com.booking.dto.ServiceRequest;
import com.booking.dto.TimeSlotBulkRequest;
import com.booking.dto.UserResponse; // Thêm import này
import com.booking.entity.Booking;
import com.booking.entity.Service;
import com.booking.entity.TimeSlot;
import com.booking.entity.User;
import com.booking.service.BookingService;
import com.booking.service.ServiceService;
import com.booking.service.TimeSlotService;
import com.booking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingService bookingService;
    private final UserService userService;
    private final ServiceService serviceService;
    private final TimeSlotService timeSlotService;

    // Constructor
    public AdminController(BookingService bookingService, UserService userService, ServiceService serviceService, TimeSlotService timeSlotService) {
        this.bookingService = bookingService;
        this.userService = userService;
        this.serviceService = serviceService;
        this.timeSlotService = timeSlotService;
    }

    // Lớp nội bộ để trả về lỗi
    private static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
    }

    // --- API THỐNG KÊ ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        Map<String, Long> stats = Map.of(
                "totalBookings", bookingService.countAllBookings(),
                "pendingBookings", bookingService.countBookingsByStatus(Booking.BookingStatus.PENDING),
                "todaysBookings", bookingService.countBookingsByDate(LocalDate.now())
        );
        return ResponseEntity.ok(stats);
    }

    // --- API ĐỌC DỮ LIỆU ---
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.findAll().stream()
                .map(BookingResponse::fromBooking).collect(Collectors.toList()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll().stream()
                .map(UserResponse::fromUser).collect(Collectors.toList()));
    }

    @GetMapping("/services")
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    @GetMapping("/timeslots")
    public ResponseEntity<List<TimeSlot>> getAllTimeSlots() {
        return ResponseEntity.ok(timeSlotService.findAll());
    }

    // --- API THAO TÁC BOOKING ---
    @PutMapping("/bookings/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            bookingService.confirmBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, @RequestParam String reason) {
        try {
            bookingService.cancelBookingByAdmin(id, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        try {
            bookingService.completeBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // --- API CRUD CHO DỊCH VỤ (SERVICES) ---
    @PostMapping("/services")
    public ResponseEntity<Service> createService(@Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.createService(request));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.updateService(id, request));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }

    // --- API CRUD CHO KHUNG GIỜ (TIMESLOTS) ---
    @PostMapping("/timeslots/bulk")
    public ResponseEntity<?> createBulkTimeSlots(@Valid @RequestBody TimeSlotBulkRequest request) {
        timeSlotService.createTimeSlotsForDate(request.getDate(), request.getTimeRanges());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/timeslots/{id}")
    public ResponseEntity<?> deleteTimeSlot(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.ok().build();
    }
}