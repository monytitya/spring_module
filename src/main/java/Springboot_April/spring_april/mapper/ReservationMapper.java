package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.ReservationRequest;
import Springboot_April.spring_april.dto.ReservationResponse;
import Springboot_April.spring_april.model.Reservation;
import Springboot_April.spring_april.model.Customer;
import Springboot_April.spring_april.model.RestaurantTable;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public Reservation toEntity(ReservationRequest request, RestaurantTable table, Customer customer) {
        if (request == null) return null;
        
        return Reservation.builder()
                .table(table)
                .customer(customer)
                .reservedAt(request.reservedAt())
                .guestCount(request.guestCount())
                .status(request.status())
                .note(request.note())
                .build();
    }

    public ReservationResponse toResponse(Reservation entity) {
        if (entity == null) return null;
        return ReservationResponse.builder()
                .id(entity.getId())
                .tableId(entity.getTable() != null ? entity.getTable().getId() : null)
                .tableName(entity.getTable() != null ? entity.getTable().getTableNumber() : null)
                .customerId(entity.getCustomer() != null ? entity.getCustomer().getId() : null)
                .customerName(entity.getCustomer() != null ? entity.getCustomer().getName() : null)
                .reservedAt(entity.getReservedAt())
                .guestCount(entity.getGuestCount())
                .status(entity.getStatus())
                .note(entity.getNote())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
