package Springboot_April.spring_april.dto;

public record SupplierRequest(
        String name,
        String contactName,
        String phone,
        String email,
        String address,
        String category,
        String status,
        String imagePath) {
}
