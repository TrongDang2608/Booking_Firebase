package com.booking.dto;

import com.booking.entity.User;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private boolean isAdmin;

    // --- PHẦN BỊ THIẾU LÀ GETTERS VÀ SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
    // -----------------------------------------

    public static UserResponse fromUser(User user) {
        if (user == null) return null;
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAdmin(user.getIsAdmin());
        return dto;
    }
}