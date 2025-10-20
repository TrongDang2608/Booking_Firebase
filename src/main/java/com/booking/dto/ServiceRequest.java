package com.booking.dto;

import java.math.BigDecimal;

public class ServiceRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private boolean isActive;

    // Getters
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getDurationMinutes() { return durationMinutes; }

    // PHƯƠNG THỨC BỊ THIẾU LÀ ĐÂY
    public boolean isActive() {
        return isActive;
    }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    // THÊM PHƯƠNG THỨC NÀY
    public void setActive(boolean active) {
        isActive = active;
    }
}