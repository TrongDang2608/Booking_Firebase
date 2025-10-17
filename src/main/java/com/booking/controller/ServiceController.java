package com.booking.controller;

import com.booking.entity.Service;
import com.booking.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    
    private final ServiceService serviceService;
    
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }
    
    @GetMapping
    public ResponseEntity<List<Service>> getAllActiveServices() {
        List<Service> services = serviceService.findAllActive();
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getService(@PathVariable Long id) {
        Optional<Service> service = serviceService.findById(id);
        if (service.isPresent()) {
            return ResponseEntity.ok(service.get());
        } else {
            return ResponseEntity.badRequest().body(new ErrorResponse("Service not found"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String name) {
        List<Service> services = serviceService.searchActiveServices(name);
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    public ResponseEntity<?> createService(@RequestBody ServiceRequest request) {
        try {
            Service service = serviceService.createService(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getDurationMinutes()
            );
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody ServiceRequest request) {
        try {
            Service service = serviceService.updateService(
                id,
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getDurationMinutes()
            );
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateService(@PathVariable Long id) {
        try {
            serviceService.deactivateService(id);
            return ResponseEntity.ok(new SuccessResponse("Service deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateService(@PathVariable Long id) {
        try {
            serviceService.activateService(id);
            return ResponseEntity.ok(new SuccessResponse("Service activated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    private static class ServiceRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private Integer durationMinutes;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        
        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    }
    
    private static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
    }
    
    private static class SuccessResponse {
        private String message;
        public SuccessResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
