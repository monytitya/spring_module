package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.KitchenTicketResponse;
import Springboot_April.spring_april.model.KitchenTicket;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class KitchenMapper {

    public KitchenTicketResponse toResponse(KitchenTicket entity) {
        if (entity == null) return null;

        Long waitingMinutes = Duration.between(entity.getSentAt(), LocalDateTime.now()).toMinutes();

        return KitchenTicketResponse.builder()
                .ticketId(entity.getId())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .tableNumber(entity.getOrder() != null && entity.getOrder().getTable() != null ? 
                             entity.getOrder().getTable().getTableNumber() : null)
                .itemName(entity.getOrderItem() != null && entity.getOrderItem().getMenuItem() != null ? 
                          entity.getOrderItem().getMenuItem().getName() : null)
                .quantity(entity.getOrderItem() != null ? entity.getOrderItem().getQuantity() : 0)
                .notes(entity.getOrderItem() != null ? entity.getOrderItem().getNote() : null)
                .sentAt(entity.getSentAt())
                .waitingMinutes(waitingMinutes)
                .status(entity.getStatus())
                .build();
    }
}
