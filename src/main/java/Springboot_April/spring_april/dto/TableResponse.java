package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.TableStatus;
import lombok.Builder;

@Builder
public record TableResponse(
    Long id,
    String tableNumber,
    Integer capacity,
    TableStatus status
) {}
