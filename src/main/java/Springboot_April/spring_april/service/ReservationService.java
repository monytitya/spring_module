package Springboot_April.spring_april.service;

import Springboot_April.spring_april.mapper.ReservationMapper;
import Springboot_April.spring_april.model.Reservation;
import Springboot_April.spring_april.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation updateReservation(Long id, Reservation details) {
        Reservation reservation = getReservationById(id);
        reservation.setTable(details.getTable());
        reservation.setCustomer(details.getCustomer());
        reservation.setReservedAt(details.getReservedAt());
        reservation.setGuestCount(details.getGuestCount());
        reservation.setStatus(details.getStatus());
        reservation.setNote(details.getNote());
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found");
        }
        reservationRepository.deleteById(id);
    }
}
