package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.Reservation;
import Springboot_April.spring_april.enums.ReservationStatus;
import Springboot_April.spring_april.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByReservedAtBetweenAndStatusIn(LocalDateTime start, LocalDateTime end, List<ReservationStatus> status);
    List<Reservation> findByTable(RestaurantTable table);
}
