package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.StaffStatus;

public record StaffRequest(
        Long roleId,
        String name,
        String phone,
        String email,
        String pinCode,
        StaffStatus status,
        String imagePath) {
}
