package com.booking.dto;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {
    
    @NotNull(message = "User ID không được để trống")
    private Long userId;
    
    @NotNull(message = "Service ID không được để trống")
    private Long serviceId;
    
    @NotNull(message = "Time Slot ID không được để trống")
    private Long timeSlotId;
    
    private String notes;
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getServiceId() {
        return serviceId;
    }
    
    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
    
    public Long getTimeSlotId() {
        return timeSlotId;
    }
    
    public void setTimeSlotId(Long timeSlotId) {
        this.timeSlotId = timeSlotId;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
