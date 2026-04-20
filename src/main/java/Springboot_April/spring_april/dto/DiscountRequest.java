package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.DiscountType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountRequest(
    String code,
    DiscountType type,
    BigDecimal value,
    LocalDateTime validFrom,
    LocalDateTime validUntil,
    Boolean active
) {}
