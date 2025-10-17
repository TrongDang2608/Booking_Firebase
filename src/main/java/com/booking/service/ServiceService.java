package com.booking.service;

// import com.booking.entity.Service; // Avoid conflict with @Service annotation
import com.booking.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServiceService {
    
    private final ServiceRepository serviceRepository;
    
    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    
    public com.booking.entity.Service save(com.booking.entity.Service service) {
        return serviceRepository.save(service);
    }
    
    public Optional<com.booking.entity.Service> findById(Long id) {
        return serviceRepository.findById(id);
    }
    
    public List<com.booking.entity.Service> findAllActive() {
        return serviceRepository.findByIsActiveTrueOrderByName();
    }
    
    public List<com.booking.entity.Service> searchActiveServices(String name) {
        return serviceRepository.findActiveServicesByNameContaining(name);
    }
    
    public com.booking.entity.Service createService(String name, String description, BigDecimal price, Integer durationMinutes) {
        com.booking.entity.Service service = new com.booking.entity.Service();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setDurationMinutes(durationMinutes);
        service.setIsActive(true);
        
        return save(service);
    }
    
    public com.booking.entity.Service updateService(Long id, String name, String description, BigDecimal price, Integer durationMinutes) {
        com.booking.entity.Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setDurationMinutes(durationMinutes);
        
        return save(service);
    }
    
    public void deactivateService(Long id) {
        com.booking.entity.Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        
        service.setIsActive(false);
        save(service);
    }
    
    public void activateService(Long id) {
        com.booking.entity.Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        
        service.setIsActive(true);
        save(service);
    }
}
