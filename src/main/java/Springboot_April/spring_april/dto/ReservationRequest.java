package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.ReservationStatus;
import java.time.LocalDateTime;

public record ReservationRequest(
    Long tableId,
    Long customerId,
    LocalDateTime reservedAt,
    Integer guestCount,
    ReservationStatus status,
    String note
) {}
