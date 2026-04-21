package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    /** Returns ALL payments for a given order (multiple allowed). */
    List<Payment> findByOrderId(Long orderId);
}
