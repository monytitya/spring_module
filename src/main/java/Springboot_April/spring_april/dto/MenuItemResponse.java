package Springboot_April.spring_april.dto;

import lombok.Builder;
import java.math.BigDecimal;

@Builder
public record MenuItemResponse(
    Long id,
    Long categoryId,
    String categoryName,
    String name,
    String description,
    BigDecimal price,
    Boolean available,
    String imagePath
) {}
