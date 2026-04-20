package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.OrderResponse;
import Springboot_April.spring_april.model.OrderItem;
import Springboot_April.spring_april.model.RestaurantOrder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderResponse toResponse(RestaurantOrder order) {
        if (order == null) return null;

        return OrderResponse.builder()
                .id(order.getId())
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableName(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .staffId(order.getStaff() != null ? order.getStaff().getId() : null)
                .staffName(order.getStaff() != null ? order.getStaff().getName() : null)
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .createdAt(order.getCreatedAt())
                .items(order.getItems() != null ? order.getItems().stream().map(this::toItemResponse).collect(Collectors.toList()) : List.of())
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
}
