package com.booking.controller;

import com.booking.entity.User;
import com.booking.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    // === THÊM LẠI PHƯƠNG THỨC NÀY ===
    /**
     * Xử lý yêu cầu GET để hiển thị trang admin.
     * Spring Security sẽ đảm bảo chỉ user có quyền ADMIN mới vào được đây.
     * @return Tên của file HTML template (admin.html)
     */
    @GetMapping("/admin")
    public String showAdminPage() {
        return "admin";
    }
    // ===================================

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute("user") User user, Model model) {
        try {
            userService.registerUser(
                    user.getFullName(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getPhoneNumber()
            );
            return "redirect:/login?success";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }
}