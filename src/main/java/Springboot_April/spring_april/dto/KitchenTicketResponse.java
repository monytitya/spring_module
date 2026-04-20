package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.KitchenStatus;
import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record KitchenTicketResponse(
    Long ticketId,
    Long orderId,
    String tableNumber,
    String itemName,
    Integer quantity,
    String notes,
    LocalDateTime sentAt,
    Long waitingMinutes,
    KitchenStatus status
) {}
