package com.booking.repository;

import com.booking.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    List<TimeSlot> findByDateAndIsAvailableTrueOrderByStartTime(LocalDate date);
    
    List<TimeSlot> findByDateBetweenAndIsAvailableTrueOrderByDateAscStartTimeAsc(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT ts FROM TimeSlot ts WHERE ts.date = :date AND ts.isAvailable = true " +
           "AND ts.startTime >= :startTime AND ts.endTime <= :endTime " +
           "ORDER BY ts.startTime")
    List<TimeSlot> findAvailableTimeSlotsByDateAndTimeRange(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
    
    @Query("SELECT ts FROM TimeSlot ts WHERE ts.date >= :startDate AND ts.isAvailable = true " +
           "ORDER BY ts.date, ts.startTime")
    List<TimeSlot> findAvailableTimeSlotsFromDate(@Param("startDate") LocalDate startDate);
    
    boolean existsByDateAndStartTimeAndEndTime(LocalDate date, LocalTime startTime, LocalTime endTime);
}
