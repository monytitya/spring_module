package Springboot_April.spring_april.dto;

public record CustomerRequest(
    String name,
    String phone,
    String email
) {}
