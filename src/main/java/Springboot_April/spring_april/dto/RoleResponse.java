package Springboot_April.spring_april.dto;

import lombok.Builder;

@Builder
public record RoleResponse(
    Long id,
    String name,
    String description
) {}
