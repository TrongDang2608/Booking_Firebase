package com.booking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller này chịu trách nhiệm hiển thị các trang giao diện người dùng
 * liên quan đến xác thực (đăng nhập, đăng ký).
 */
@Controller
public class AuthController {

    /**
     * Xử lý yêu cầu GET để hiển thị trang đăng nhập.
     * @return Tên của file HTML template (login.html)
     */
    @GetMapping("/login")
    public String showLoginPage() {
        return "login"; // Trả về view tên là "login"
    }

    /**
     * Xử lý yêu cầu GET để hiển thị trang đăng ký.
     * (Giả sử bạn có một trang đăng ký tên là register.html)
     * @return Tên của file HTML template (register.html)
     */
    @GetMapping("/register")
    public String showRegistrationPage() {
        // Bạn cần tạo một file register.html trong thư mục templates
        return "register"; 
    }
}

