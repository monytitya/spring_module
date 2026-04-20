package Springboot_April.spring_april.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record CustomerResponse(
    Long id,
    String name,
    String email,
    String phone,
    String address,
    LocalDateTime createdAt
) {}
