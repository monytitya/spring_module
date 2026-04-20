package Springboot_April.spring_april.dto;

import java.math.BigDecimal;

public record MenuItemRequest(
    Long categoryId,
    String name,
    String description,
    BigDecimal price,
    Boolean available
) {}
