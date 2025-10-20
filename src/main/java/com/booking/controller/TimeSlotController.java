package com.booking.controller;

import com.booking.dto.ErrorResponse;
import com.booking.dto.SuccessResponse;
import com.booking.dto.TimeSlotBulkRequest;
import com.booking.dto.TimeSlotRequest;
import com.booking.entity.TimeSlot;
import com.booking.service.TimeSlotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/time-slots")
@CrossOrigin(origins = "*")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    @GetMapping("/available/{date}")
    public ResponseEntity<List<TimeSlot>> getAvailableTimeSlots(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TimeSlot> timeSlots = timeSlotService.findAvailableByDate(date);
        return ResponseEntity.ok(timeSlots);
    }

    @GetMapping("/available/date-range")
    public ResponseEntity<List<TimeSlot>> getAvailableTimeSlotsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TimeSlot> timeSlots = timeSlotService.findAvailableByDateRange(startDate, endDate);
        return ResponseEntity.ok(timeSlots);
    }

    @GetMapping("/available/from-date")
    public ResponseEntity<List<TimeSlot>> getAvailableTimeSlotsFromDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        List<TimeSlot> timeSlots = timeSlotService.findAvailableFromDate(startDate);
        return ResponseEntity.ok(timeSlots);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTimeSlot(@PathVariable Long id) {
        Optional<TimeSlot> timeSlot = timeSlotService.findById(id);
        if (timeSlot.isPresent()) {
            return ResponseEntity.ok(timeSlot.get());
        } else {
            return ResponseEntity.badRequest().body(new ErrorResponse("TimeSlot not found"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createTimeSlot(@RequestBody TimeSlotRequest request) {
        try {
            TimeSlot timeSlot = timeSlotService.createTimeSlot(
                    request.getDate(),
                    request.getStartTime(),
                    request.getEndTime()
            );
            return ResponseEntity.ok(timeSlot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> createTimeSlotsForDate(@RequestBody TimeSlotBulkRequest request) {
        try {
            timeSlotService.createTimeSlotsForDate(request.getDate(), request.getTimeRanges());
            return ResponseEntity.ok(new SuccessResponse("Time slots created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/unavailable")
    public ResponseEntity<?> markTimeSlotUnavailable(@PathVariable Long id) {
        try {
            timeSlotService.markAsUnavailable(id);
            return ResponseEntity.ok(new SuccessResponse("Time slot marked as unavailable"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/available")
    public ResponseEntity<?> markTimeSlotAvailable(@PathVariable Long id) {
        try {
            timeSlotService.markAsAvailable(id);
            return ResponseEntity.ok(new SuccessResponse("Time slot marked as available"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}