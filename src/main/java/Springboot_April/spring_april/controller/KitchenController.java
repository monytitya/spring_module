package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.model.KitchenTicket;
import Springboot_April.spring_april.enums.KitchenStatus;
import Springboot_April.spring_april.service.KitchenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("/tickets/active")
    public ResponseEntity<List<KitchenTicket>> getActiveTickets() {
        return ResponseEntity.ok(kitchenService.getActiveTickets());
    }

    @PostMapping("/tickets/{orderItemId}")
    public ResponseEntity<KitchenTicket> createTicket(@PathVariable Long orderItemId) {
        return ResponseEntity.ok(kitchenService.createTicket(orderItemId));
    }

    @PatchMapping("/tickets/{ticketId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long ticketId, 
            @RequestParam KitchenStatus status) {
        kitchenService.updateTicketStatus(ticketId, status);
        return ResponseEntity.ok().build();
    }
}
