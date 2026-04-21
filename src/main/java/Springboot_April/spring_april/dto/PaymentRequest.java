package Springboot_April.spring_april.dto;

import java.math.BigDecimal;

import Springboot_April.spring_april.enums.PaymentMethod;

public record PaymentRequest(
        Long orderId,
        PaymentMethod method,
        BigDecimal amount,
        BigDecimal discountAmount,
        String khqrRef) {
}
