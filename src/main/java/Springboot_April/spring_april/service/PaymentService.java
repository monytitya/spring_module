package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.PaymentRequest;
import Springboot_April.spring_april.dto.PaymentResponse;
import Springboot_April.spring_april.mapper.PaymentMapper;
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
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final PaymentMapper paymentMapper;

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return paymentMapper.toResponse(payment);
    }

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
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
        if (table != null) {
            table.setStatus(TableStatus.available);
            tableRepository.save(table);
        }

        orderRepository.save(order);
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    @Transactional
    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found");
        }
        paymentRepository.deleteById(id);
    }
}
