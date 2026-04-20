package Springboot_April.spring_april.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record OrderResponse(
    Long id,
    Long tableId,
    String tableName,
    Long staffId,
    String staffName,
    String status,
    BigDecimal totalAmount,
    BigDecimal discountAmount,
    BigDecimal finalAmount,
    LocalDateTime createdAt,
    List<OrderItemResponse> items
) {
    @Builder
    public record OrderItemResponse(
        Long id,
        Long menuItemId,
        String menuItemName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotalAmount,
        String note,
        String kitchenStatus
    ) {}
}
