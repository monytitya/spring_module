package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.PaymentMethod;
import java.math.BigDecimal;

public record PaymentRequest(
    Long orderId,
    PaymentMethod method,
    BigDecimal amount,
    BigDecimal discountAmount,
    String khqrRef
) {}
