package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.KitchenTicketResponse;
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

    @GetMapping("/active")
    public ResponseEntity<List<KitchenTicketResponse>> getActiveTickets() {
        return ResponseEntity.ok(kitchenService.getActiveTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KitchenTicketResponse> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(kitchenService.getTicketById(id));
    }

    @PostMapping("/order-item/{orderItemId}")
    public ResponseEntity<KitchenTicketResponse> createTicket(@PathVariable Long orderItemId) {
        return ResponseEntity.ok(kitchenService.createTicket(orderItemId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<KitchenTicketResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam KitchenStatus status) {
        return ResponseEntity.ok(kitchenService.updateTicketStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        kitchenService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
