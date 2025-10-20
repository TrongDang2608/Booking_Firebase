package com.booking.repository;

import com.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserOrderByCreatedAtDesc(com.booking.entity.User user);
    
    List<Booking> findByTimeSlotDateOrderByTimeSlotStartTime(LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.timeSlot.date >= :startDate AND b.timeSlot.date <= :endDate " +
           "ORDER BY b.timeSlot.date, b.timeSlot.startTime")
    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.status = :status ORDER BY b.createdAt DESC")
    List<Booking> findByStatusOrderByCreatedAtDesc(@Param("status") Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status IN :statuses " +
           "ORDER BY b.timeSlot.date, b.timeSlot.startTime")
    List<Booking> findByUserIdAndStatusIn(@Param("userId") Long userId, @Param("statuses") List<Booking.BookingStatus> statuses);
    
    @Query("SELECT b FROM Booking b WHERE b.timeSlot.date = :date AND b.status = :status " +
           "ORDER BY b.timeSlot.startTime")
    List<Booking> findByDateAndStatus(@Param("date") LocalDate date, @Param("status") Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.reminderSent = false AND b.status = 'CONFIRMED' " +
           "AND b.timeSlot.date = :date AND b.timeSlot.startTime = :time")
    List<Booking> findBookingsForReminder(@Param("date") LocalDate date, @Param("time") java.time.LocalTime time);
    
    @Query("SELECT b FROM Booking b WHERE b.confirmationSent = false AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsPendingConfirmation();
    
    Optional<Booking> findByTimeSlotId(Long timeSlotId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.timeSlot.date = :date AND b.status IN :statuses")
    long countBookingsByDateAndStatus(@Param("date") LocalDate date, @Param("statuses") List<Booking.BookingStatus> statuses);

    long countByStatus(Booking.BookingStatus status);
    long countByTimeSlotDate(LocalDate date);
}
