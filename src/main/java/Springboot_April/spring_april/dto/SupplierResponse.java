package Springboot_April.spring_april.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record SupplierResponse(
        Long id,
        String name,
        String contactName,
        String phone,
        String email,
        String address,
        String category,
        String status,
        String imagePath,
        LocalDateTime createdAt) {
}
