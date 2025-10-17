package com.booking.service;

import com.booking.entity.User;
import com.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String fullName, String email, String password, String phoneNumber) {
        if (existsByEmail(email)) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(password); // Trong thực tế nên mã hóa mật khẩu trước khi lưu
        user.setPhoneNumber(phoneNumber);
        user.setIsAdmin(false);

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (!user.getPassword().equals(password)) { // Trong thực tế nên so sánh mật khẩu đã mã hóa
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        return user;
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public List<User> findAllAdmins() {
        return userRepository.findAllAdmins();
    }
    
    public List<User> findUsersWithFcmTokens() {
        return userRepository.findUsersWithFcmTokens();
    }
    
    public User updateFcmToken(Long userId, String fcmToken) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setFcmToken(fcmToken);
        return userRepository.save(user);
    }
    
    public User createUser(String fullName, String email, String phoneNumber) {
        if (existsByEmail(email)) {
            throw new RuntimeException("Email đã được sử dụng: " + email);
        }
        
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setIsAdmin(false);
        
        return save(user);
    }
    
    public User createAdmin(String fullName, String email, String phoneNumber) {
        if (existsByEmail(email)) {
            throw new RuntimeException("Email đã được sử dụng: " + email);
        }
        
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setIsAdmin(true);
        
        return save(user);
    }
}
