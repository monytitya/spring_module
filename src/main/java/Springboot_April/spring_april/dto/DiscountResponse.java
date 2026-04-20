package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.DiscountType;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record DiscountResponse(
    Long id,
    String code,
    DiscountType type,
    BigDecimal value,
    LocalDateTime validFrom,
    LocalDateTime validUntil,
    Boolean active,
    LocalDateTime createdAt
) {}
