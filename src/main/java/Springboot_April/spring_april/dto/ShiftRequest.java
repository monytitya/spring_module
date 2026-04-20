package Springboot_April.spring_april.dto;

import lombok.Builder;
import java.time.LocalTime;

@Builder
public record ShiftRequest(
    String name,
    LocalTime startTime,
    LocalTime endTime
) {}
