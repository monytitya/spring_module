package Springboot_April.spring_april.dto;

import Springboot_April.spring_april.enums.TableStatus;

public record TableRequest(
    String tableNumber,
    Integer capacity,
    TableStatus status
) {}
