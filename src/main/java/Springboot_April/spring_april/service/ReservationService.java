package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.ReservationRequest;
import Springboot_April.spring_april.dto.ReservationResponse;
import Springboot_April.spring_april.mapper.ReservationMapper;
import Springboot_April.spring_april.model.Reservation;
import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.model.Customer;
import Springboot_April.spring_april.repository.ReservationRepository;
import Springboot_April.spring_april.repository.TableRepository;
import Springboot_April.spring_april.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TableRepository tableRepository;
    private final CustomerRepository customerRepository;
    private final ReservationMapper reservationMapper;

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return reservationMapper.toResponse(reservation);
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        RestaurantTable table = tableRepository.findById(request.tableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Reservation reservation = reservationMapper.toEntity(request, table, customer);
        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationResponse updateReservation(Long id, ReservationRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (request.tableId() != null) {
            RestaurantTable table = tableRepository.findById(request.tableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            reservation.setTable(table);
        }
        
        if (request.customerId() != null) {
            Customer customer = customerRepository.findById(request.customerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            reservation.setCustomer(customer);
        }

        reservation.setReservedAt(request.reservedAt());
        reservation.setGuestCount(request.guestCount());
        reservation.setStatus(request.status());
        reservation.setNote(request.note());

        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found");
        }
        reservationRepository.deleteById(id);
    }
}
