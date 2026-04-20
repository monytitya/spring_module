package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.OrderRequest;
import Springboot_April.spring_april.dto.OrderResponse;
import Springboot_April.spring_april.execute.OrderExecution;
import Springboot_April.spring_april.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final OrderExecution orderExecution;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Atomic creation: Creates order and items in one request.
     * Prevents "double requests" from the frontend.
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderExecution.executeCreateOrder(request));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<OrderResponse> addItemToOrder(
            @PathVariable Long id,
            @RequestBody OrderRequest.OrderItemRequest request) {
        return ResponseEntity.ok(orderExecution.executeAddItem(id, request));
    }

    @PostMapping("/{id}/apply-discount/{discountId}")
    public ResponseEntity<OrderResponse> applyDiscount(
            @PathVariable Long id,
            @PathVariable Long discountId) {
        return ResponseEntity.ok(orderService.applyDiscount(id, discountId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
