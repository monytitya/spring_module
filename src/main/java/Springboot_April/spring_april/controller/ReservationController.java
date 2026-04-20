package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.ReservationRequest;
import Springboot_April.spring_april.model.Customer;
import Springboot_April.spring_april.model.Reservation;
import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.service.ReservationService;
import Springboot_April.spring_april.service.TableService;
import Springboot_April.spring_april.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;
    private final TableService tableService;
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequest request) {
        Reservation reservation = Reservation.builder()
                .table(tableService.getTableById(request.tableId()))
                .customer(customerService.getCustomerById(request.customerId()))
                .reservedAt(request.reservedAt())
                .guestCount(request.guestCount())
                .status(request.status())
                .note(request.note())
                .build();
        return ResponseEntity.ok(reservationService.createReservation(reservation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody ReservationRequest request) {
        Reservation details = Reservation.builder()
                .table(tableService.getTableById(request.tableId()))
                .customer(customerService.getCustomerById(request.customerId()))
                .reservedAt(request.reservedAt())
                .guestCount(request.guestCount())
                .status(request.status())
                .note(request.note())
                .build();
        return ResponseEntity.ok(reservationService.updateReservation(id, details));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
