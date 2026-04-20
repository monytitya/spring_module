package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.KitchenStatus;
import java.time.LocalDateTime;

public record KitchenTicketResponse(
    Long ticketId,
    String tableNumber,
    String itemName,
    Integer quantity,
    String notes,
    LocalDateTime sentAt,
    Long waitingMinutes,
    KitchenStatus status
) {}
