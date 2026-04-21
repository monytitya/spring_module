package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.OrderResponse;
import Springboot_April.spring_april.dto.PaymentResponse;
import Springboot_April.spring_april.model.OrderItem;
import Springboot_April.spring_april.model.RestaurantOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final PaymentMapper paymentMapper;

    @Autowired
    public OrderMapper(@Lazy PaymentMapper paymentMapper) {
        this.paymentMapper = paymentMapper;
    }

    public OrderResponse toResponse(RestaurantOrder order) {
        if (order == null) return null;

        BigDecimal paid      = safeAmount(order.getPaidAmount());
        BigDecimal finalAmt  = safeAmount(order.getFinalAmount());
        BigDecimal remaining = finalAmt.subtract(paid).max(BigDecimal.ZERO);

        List<PaymentResponse> paymentResponses = (order.getPayments() != null)
                ? order.getPayments().stream()
                        .map(paymentMapper::toResponse)
                        .collect(Collectors.toList())
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableName(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .staffId(order.getStaff() != null ? order.getStaff().getId() : null)
                .staffName(order.getStaff() != null ? order.getStaff().getName() : null)
                .status(order.getStatus().name())
                .totalAmount(safeAmount(order.getTotalAmount()))
                .discountAmount(safeAmount(order.getDiscountAmount()))
                .finalAmount(finalAmt)
                .paidAmount(paid)
                .remainingAmount(remaining)
                .createdAt(order.getCreatedAt())
                .items(order.getItems() != null
                        ? order.getItems().stream().map(this::toItemResponse).collect(Collectors.toList())
                        : List.of())
                .payments(paymentResponses)
                .build();
    }

    public OrderResponse.OrderItemResponse toItemResponse(OrderItem item) {
        if (item == null) return null;

        return OrderResponse.OrderItemResponse.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem() != null ? item.getMenuItem().getId() : null)
                .menuItemName(item.getMenuItem() != null ? item.getMenuItem().getName() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotalAmount(item.getSubtotalAmount())
                .note(item.getNote())
                .kitchenStatus(item.getKitchenStatus().name())
                .build();
    }

    private BigDecimal safeAmount(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
