package Springboot_April.spring_april.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record MenuItemRequest(
    @NotNull(message = "Category ID is required")
    Long categoryId,
    
    @NotBlank(message = "Name is required")
    String name,
    
    String description,
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    BigDecimal price,
    
    Boolean available,
    
    String imagePath
) {}
