package Springboot_April.spring_april.dto;

import lombok.Builder;

@Builder
public record MenuCategoryResponse(
    Long id,
    String name,
    Integer sortOrder
) {}
