package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ActiveOrderResponse(
    Long orderId,
    String tableNumber,
    String waiter,
    OrderStatus status,
    LocalDateTime openedAt,
    Long totalItems,
    BigDecimal runningTotal
) {}
