package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.ReservationStatus;
import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record ReservationResponse(
    Long id,
    Long tableId,
    String tableName,
    Long customerId,
    String customerName,
    LocalDateTime reservedAt,
    Integer guestCount,
    ReservationStatus status,
    String note,
    LocalDateTime createdAt
) {}
