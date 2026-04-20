package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.ReservationRequest;
import Springboot_April.spring_april.dto.ReservationResponse;
import Springboot_April.spring_april.service.ReservationService;
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

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservation(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponse> updateReservation(@PathVariable Long id, @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.updateReservation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
