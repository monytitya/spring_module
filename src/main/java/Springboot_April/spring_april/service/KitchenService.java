package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.KitchenTicketResponse;
import Springboot_April.spring_april.mapper.KitchenMapper;
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
@Transactional(readOnly = true)
public class KitchenService {

    private final KitchenTicketRepository ticketRepository;
    private final OrderItemRepository orderItemRepository;
    private final KitchenMapper kitchenMapper;

    @Transactional
    public KitchenTicketResponse createTicket(Long orderItemId) {
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
        
        return kitchenMapper.toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public KitchenTicketResponse updateTicketStatus(Long ticketId, KitchenStatus status) {
        KitchenTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        if (status == KitchenStatus.ready) {
            ticket.setReadyAt(LocalDateTime.now());
        }
        
        // Also update the order item's status
        OrderItem item = ticket.getOrderItem();
        if (item != null) {
            item.setKitchenStatus(status);
            orderItemRepository.save(item);
        }
        
        return kitchenMapper.toResponse(ticketRepository.save(ticket));
    }

    public List<KitchenTicketResponse> getActiveTickets() {
        return ticketRepository.findByStatusInOrderBySentAtAsc(
                Arrays.asList(KitchenStatus.pending, KitchenStatus.preparing)
        ).stream()
                .map(kitchenMapper::toResponse)
                .toList();
    }

    public KitchenTicketResponse getTicketById(Long id) {
        KitchenTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return kitchenMapper.toResponse(ticket);
    }

    @Transactional
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        ticketRepository.deleteById(id);
    }
}
