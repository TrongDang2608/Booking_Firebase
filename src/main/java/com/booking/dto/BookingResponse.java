package com.booking.dto;

import com.booking.entity.Booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponse {
    
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
    
    private Long serviceId;
    private String serviceName;
    private String serviceDescription;
    private BigDecimal servicePrice;
    private Integer serviceDuration;
    
    private Long timeSlotId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    
    private Booking.BookingStatus status;
    private String statusDisplayName;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static BookingResponse fromBooking(Booking booking) {
        BookingResponse response = new BookingResponse();
        
        response.setId(booking.getId());
        response.setUserId(booking.getUser().getId());
        response.setUserFullName(booking.getUser().getFullName());
        response.setUserEmail(booking.getUser().getEmail());
        response.setUserPhone(booking.getUser().getPhoneNumber());
        
        response.setServiceId(booking.getService().getId());
        response.setServiceName(booking.getService().getName());
        response.setServiceDescription(booking.getService().getDescription());
        response.setServicePrice(booking.getService().getPrice());
        response.setServiceDuration(booking.getService().getDurationMinutes());
        
        response.setTimeSlotId(booking.getTimeSlot().getId());
        response.setDate(booking.getTimeSlot().getDate());
        response.setStartTime(booking.getTimeSlot().getStartTime());
        response.setEndTime(booking.getTimeSlot().getEndTime());
        
        response.setStatus(booking.getStatus());
        response.setStatusDisplayName(booking.getStatus().getDisplayName());
        response.setNotes(booking.getNotes());
        
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        
        return response;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserFullName() {
        return userFullName;
    }
    
    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }
    
    public String getUserEmail() {
        return userEmail;
    }
    
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    
    public String getUserPhone() {
        return userPhone;
    }
    
    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }
    
    public Long getServiceId() {
        return serviceId;
    }
    
    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
    
    public String getServiceName() {
        return serviceName;
    }
    
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
    
    public String getServiceDescription() {
        return serviceDescription;
    }
    
    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }
    
    public BigDecimal getServicePrice() {
        return servicePrice;
    }
    
    public void setServicePrice(BigDecimal servicePrice) {
        this.servicePrice = servicePrice;
    }
    
    public Integer getServiceDuration() {
        return serviceDuration;
    }
    
    public void setServiceDuration(Integer serviceDuration) {
        this.serviceDuration = serviceDuration;
    }
    
    public Long getTimeSlotId() {
        return timeSlotId;
    }
    
    public void setTimeSlotId(Long timeSlotId) {
        this.timeSlotId = timeSlotId;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public Booking.BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(Booking.BookingStatus status) {
        this.status = status;
    }
    
    public String getStatusDisplayName() {
        return statusDisplayName;
    }
    
    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
