package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.PaymentRequest;
import Springboot_April.spring_april.model.Payment;
import Springboot_April.spring_april.model.RestaurantOrder;
import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.enums.OrderStatus;
import Springboot_April.spring_april.enums.TableStatus;
import Springboot_April.spring_april.repository.OrderRepository;
import Springboot_April.spring_april.repository.PaymentRepository;
import Springboot_April.spring_april.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    @Transactional
    public Payment processPayment(PaymentRequest request) {
        RestaurantOrder order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = Payment.builder()
                .order(order)
                .method(request.method())
                .amount(request.amount())
                .discountAmount(request.discountAmount())
                .khqrRef(request.khqrRef())
                .paidAt(LocalDateTime.now())
                .build();

        // Update order status
        order.setStatus(OrderStatus.closed);
        order.setClosedAt(LocalDateTime.now());
        
        // Update table status back to available
        RestaurantTable table = order.getTable();
        table.setStatus(TableStatus.available);

        orderRepository.save(order);
        tableRepository.save(table);
        return paymentRepository.save(payment);
    }
}
