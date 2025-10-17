package com.booking.repository;

import com.booking.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    List<Service> findByIsActiveTrueOrderByName();
    
    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.name LIKE %:name%")
    List<Service> findActiveServicesByNameContaining(@Param("name") String name);
}
