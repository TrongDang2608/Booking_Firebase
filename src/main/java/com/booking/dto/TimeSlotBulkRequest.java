package com.booking.dto;

import java.time.LocalDate;
import java.util.List;

public class TimeSlotBulkRequest {
    private LocalDate date;
    private List<String> timeRanges;

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public List<String> getTimeRanges() { return timeRanges; }
    public void setTimeRanges(List<String> timeRanges) { this.timeRanges = timeRanges; }
}