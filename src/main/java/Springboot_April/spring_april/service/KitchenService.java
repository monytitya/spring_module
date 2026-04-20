package Springboot_April.spring_april.service;

import Springboot_April.spring_april.model.KitchenTicket;
import Springboot_April.spring_april.model.OrderItem;
import Springboot_April.spring_april.enums.KitchenStatus;
import Springboot_April.spring_april.repository.KitchenTicketRepository;
import Springboot_April.spring_april.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KitchenService {

    private final KitchenTicketRepository ticketRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public KitchenTicket createTicket(Long orderItemId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        KitchenTicket ticket = KitchenTicket.builder()
                .order(item.getOrder())
                .orderItem(item)
                .status(KitchenStatus.pending)
                .sentAt(LocalDateTime.now())
                .build();

        item.setKitchenStatus(KitchenStatus.pending);
        orderItemRepository.save(item);
        
        return ticketRepository.save(ticket);
    }

    @Transactional
    public void updateTicketStatus(Long ticketId, KitchenStatus status) {
        KitchenTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        if (status == KitchenStatus.ready) {
            ticket.setReadyAt(LocalDateTime.now());
        }
        
        // Also update the order item's status
        OrderItem item = ticket.getOrderItem();
        item.setKitchenStatus(status);
        
        ticketRepository.save(ticket);
        orderItemRepository.save(item);
    }

    public List<KitchenTicket> getActiveTickets() {
        return ticketRepository.findByStatusInOrderBySentAtAsc(
                Arrays.asList(KitchenStatus.pending, KitchenStatus.preparing)
        );
    }
}
