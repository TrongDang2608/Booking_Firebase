package com.booking.repository;

import com.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.isAdmin = true")
    List<User> findAllAdmins();
    
    @Query("SELECT u FROM User u WHERE u.fcmToken IS NOT NULL")
    List<User> findUsersWithFcmTokens();
    
    @Query("SELECT u FROM User u WHERE u.id = :userId AND u.fcmToken IS NOT NULL")
    Optional<User> findByIdWithFcmToken(@Param("userId") Long userId);
}
