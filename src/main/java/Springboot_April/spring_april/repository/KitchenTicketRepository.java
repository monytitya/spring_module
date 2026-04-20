package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.KitchenTicket;
import Springboot_April.spring_april.enums.KitchenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KitchenTicketRepository extends JpaRepository<KitchenTicket, Long> {
    List<KitchenTicket> findByStatusInOrderBySentAtAsc(List<KitchenStatus> statuses);
}
