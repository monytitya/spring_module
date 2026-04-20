package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.ShiftStatus;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record StaffShiftResponse(
    Long id,
    Long staffId,
    String staffName,
    Long shiftId,
    String shiftName,
    LocalDate workDate,
    LocalDateTime clockIn,
    LocalDateTime clockOut,
    ShiftStatus status,
    String note
) {}
