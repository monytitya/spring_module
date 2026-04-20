package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.PaymentMethod;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record PaymentResponse(
    Long id,
    Long orderId,
    PaymentMethod method,
    BigDecimal amount,
    BigDecimal discountAmount,
    String khqrRef,
    LocalDateTime paidAt
) {}
