package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.OrderRequest;
import Springboot_April.spring_april.dto.PaymentRequest;
import Springboot_April.spring_april.model.OrderItem;
import Springboot_April.spring_april.model.Payment;
import Springboot_April.spring_april.model.RestaurantOrder;
import Springboot_April.spring_april.execute.OrderExecution;
import Springboot_April.spring_april.execute.PaymentExecution;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderExecution orderExecution;
    private final PaymentExecution paymentExecution;

    @PostMapping
    public ResponseEntity<RestaurantOrder> createOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderExecution.executeCreateOrder(request));
    }

    @PostMapping("/{orderId}/items")
    public ResponseEntity<OrderItem> addItemToOrder(
            @PathVariable Long orderId, 
            @RequestBody OrderRequest.OrderItemRequest request) {
        return ResponseEntity.ok(orderExecution.executeAddItem(orderId, request));
    }

    @PostMapping("/{orderId}/pay")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long orderId, 
            @RequestBody PaymentRequest request) {
        // Ensure request has correct orderId
        if (!orderId.equals(request.orderId())) {
             return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(paymentExecution.executePayment(request));
    }
}
