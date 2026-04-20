package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.StaffStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StaffResponse(
    Long id,
    Long roleId,
    String roleName,
    String name,
    String phone,
    String status,
    LocalDateTime createdAt
) {}
