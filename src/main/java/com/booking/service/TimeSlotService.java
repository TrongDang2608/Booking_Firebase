package com.booking.service;

import com.booking.entity.TimeSlot;
import com.booking.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TimeSlotService {
    
    private final TimeSlotRepository timeSlotRepository;
    
    public TimeSlotService(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }
    
    public TimeSlot save(TimeSlot timeSlot) {
        return timeSlotRepository.save(timeSlot);
    }
    
    public Optional<TimeSlot> findById(Long id) {
        return timeSlotRepository.findById(id);
    }
    
    public List<TimeSlot> findAvailableByDate(LocalDate date) {
        return timeSlotRepository.findByDateAndIsAvailableTrueOrderByStartTime(date);
    }
    
    public List<TimeSlot> findAvailableByDateRange(LocalDate startDate, LocalDate endDate) {
        return timeSlotRepository.findByDateBetweenAndIsAvailableTrueOrderByDateAscStartTimeAsc(startDate, endDate);
    }
    
    public List<TimeSlot> findAvailableByDateAndTimeRange(LocalDate date, LocalTime startTime, LocalTime endTime) {
        return timeSlotRepository.findAvailableTimeSlotsByDateAndTimeRange(date, startTime, endTime);
    }
    
    public List<TimeSlot> findAvailableFromDate(LocalDate startDate) {
        return timeSlotRepository.findAvailableTimeSlotsFromDate(startDate);
    }
    
    public TimeSlot createTimeSlot(LocalDate date, LocalTime startTime, LocalTime endTime) {
        if (timeSlotRepository.existsByDateAndStartTimeAndEndTime(date, startTime, endTime)) {
            throw new RuntimeException("Khung giờ đã tồn tại cho ngày " + date + " từ " + startTime + " đến " + endTime);
        }
        
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setDate(date);
        timeSlot.setStartTime(startTime);
        timeSlot.setEndTime(endTime);
        timeSlot.setIsAvailable(true);
        
        return save(timeSlot);
    }
    
    public void markAsUnavailable(Long timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
            .orElseThrow(() -> new RuntimeException("TimeSlot not found with id: " + timeSlotId));
        
        timeSlot.setIsAvailable(false);
        save(timeSlot);
    }
    
    public void markAsAvailable(Long timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
            .orElseThrow(() -> new RuntimeException("TimeSlot not found with id: " + timeSlotId));
        
        timeSlot.setIsAvailable(true);
        save(timeSlot);
    }
    
    public void createTimeSlotsForDate(LocalDate date, List<String> timeRanges) {
        for (String timeRange : timeRanges) {
            String[] times = timeRange.split("-");
            if (times.length == 2) {
                LocalTime startTime = LocalTime.parse(times[0].trim());
                LocalTime endTime = LocalTime.parse(times[1].trim());
                createTimeSlot(date, startTime, endTime);
            }
        }
    }
}
