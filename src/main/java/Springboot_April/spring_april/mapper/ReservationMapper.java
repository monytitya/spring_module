package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.ReservationRequest;
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
}
