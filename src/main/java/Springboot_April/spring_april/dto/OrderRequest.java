package Springboot_April.spring_april.dto;

import java.util.List;

public record OrderRequest(
    Long tableId,
    Long staffId,
    Long staffShiftId,
    List<OrderItemRequest> items
) {
    public record OrderItemRequest(
        Long menuItemId,
        Integer quantity,
        String notes
    ) {}
}
