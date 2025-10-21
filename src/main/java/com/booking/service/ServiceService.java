package com.booking.service;

// import com.booking.entity.Service; // Avoid conflict with @Service annotation
import com.booking.repository.ServiceRepository;
import com.booking.dto.ServiceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map; // <-- THÊM IMPORT NÀY
import java.util.HashMap; // <-- THÊM IMPORT NÀY
import java.util.Optional;

@Service
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final NotificationService notificationService; // <-- THÊM DÒNG NÀY

    public ServiceService(ServiceRepository serviceRepository, NotificationService notificationService) {
        this.serviceRepository = serviceRepository;
        this.notificationService = notificationService;
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

    public com.booking.entity.Service createService(ServiceRequest request) {
        com.booking.entity.Service service = new com.booking.entity.Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        //service.setIsActive(request.isActive());

        // 1. Lưu dịch vụ mới vào CSDL
        com.booking.entity.Service savedService = save(service);

        // 2. Gửi thông báo hàng loạt sau khi lưu thành công
        String title = "Dịch vụ mới tại phòng khám!";
        String body = String.format("Chúng tôi vừa ra mắt dịch vụ mới: %s. Hãy khám phá và đặt lịch ngay!", savedService.getName());
        Map<String, String> data = new HashMap<>();
        data.put("type", "NEW_SERVICE_ANNOUNCEMENT");
        data.put("serviceId", savedService.getId().toString());

        notificationService.sendBroadcastNotification(title, body, data);

        return savedService;
    }

    public com.booking.entity.Service updateService(Long id, ServiceRequest request) {
        com.booking.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setIsActive(request.isActive());
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

    // Thêm phương thức này để lấy tất cả dịch vụ
    public List<com.booking.entity.Service> findAll() {
        return serviceRepository.findAll();
    }

    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }
}
