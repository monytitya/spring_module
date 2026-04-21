package Springboot_April.spring_april.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import Springboot_April.spring_april.dto.PaymentRequest;
import Springboot_April.spring_april.dto.PaymentResponse;
import Springboot_April.spring_april.enums.OrderStatus;
import Springboot_April.spring_april.enums.TableStatus;
import Springboot_April.spring_april.mapper.PaymentMapper;
import Springboot_April.spring_april.model.Payment;
import Springboot_April.spring_april.model.RestaurantOrder;
import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.repository.OrderRepository;
import Springboot_April.spring_april.repository.PaymentRepository;
import Springboot_April.spring_april.repository.TableRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository   orderRepository;
    private final TableRepository   tableRepository;
    private final PaymentMapper     paymentMapper;

    // ────────────────────────────────────────────────────
    // READ
    // ────────────────────────────────────────────────────

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
        return paymentMapper.toResponse(payment);
    }

    /**
     * Returns ALL payment transactions for a given order.
     * Useful for showing the full split-payment history on the UI.
     */
    public List<PaymentResponse> getPaymentsByOrderId(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Order not found with ID: " + orderId);
        }
        return paymentRepository.findByOrderId(orderId).stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    // ────────────────────────────────────────────────────
    // PROCESS PAYMENT
    // ────────────────────────────────────────────────────

    /**
     * Records a single payment transaction against an order.
     *
     * Business rules enforced:
     *  1. Prevent payment on a CLOSED order          → 409 CONFLICT
     *  2. Amount must be > 0                          → 400 BAD_REQUEST
     *  3. Prevent overpayment                         → 400 BAD_REQUEST
     *  4. Partial payment  → order.status = partial
     *  5. Full payment     → order.status = closed
     *                        order.closedAt = now()
     *                        table.status   = available  (auto-release)
     */
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {

        // ── 1. Load order ──────────────────────────────
        RestaurantOrder order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Order not found with ID: " + request.orderId()));

        // ── 2. Guard: already closed ───────────────────
        if (order.getStatus() == OrderStatus.closed) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Order #" + order.getId() + " is already fully paid and closed");
        }

        // ── 3. Guard: amount must be positive ──────────
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Payment amount must be greater than zero");
        }

        // ── 4. Guard: prevent overpayment ──────────────
        BigDecimal currentPaid  = safeAmount(order.getPaidAmount());
        BigDecimal finalAmount  = safeAmount(order.getFinalAmount());
        BigDecimal remaining    = finalAmount.subtract(currentPaid);
        BigDecimal newPaidTotal = currentPaid.add(request.amount());

        if (newPaidTotal.compareTo(finalAmount) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Payment of %.2f exceeds remaining balance of %.2f",
                            request.amount(), remaining));
        }

        // ── 5. Save payment row ────────────────────────
        Payment payment = Payment.builder()
                .order(order)
                .method(request.method())
                .amount(request.amount())
                .discountAmount(safeAmount(request.discountAmount()))
                .khqrRef(request.khqrRef())
                .paidAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // ── 6. Update order paid amount ────────────────
        order.setPaidAmount(newPaidTotal);

        // ── 7. Auto-close + table auto-release ─────────
        if (newPaidTotal.compareTo(finalAmount) == 0) {
            order.setStatus(OrderStatus.closed);
            order.setClosedAt(LocalDateTime.now());

            // Table auto-release back to available
            RestaurantTable table = order.getTable();
            if (table != null) {
                table.setStatus(TableStatus.available);
                tableRepository.save(table);
            }
        } else {
            // Partial — still money owed
            order.setStatus(OrderStatus.partial);
        }

        orderRepository.save(order);

        // Return enriched response (includes remainingAmount + orderStatus)
        return paymentMapper.toResponse(payment);
    }

    // ────────────────────────────────────────────────────
    // DELETE
    // ────────────────────────────────────────────────────

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        RestaurantOrder order = payment.getOrder();

        // Reverse the paidAmount on the parent order
        BigDecimal restored = safeAmount(order.getPaidAmount()).subtract(payment.getAmount()).max(BigDecimal.ZERO);
        order.setPaidAmount(restored);

        // Re-open order if it was closed (e.g. correcting a mistake)
        if (order.getStatus() == OrderStatus.closed) {
            order.setStatus(restored.compareTo(BigDecimal.ZERO) == 0
                    ? OrderStatus.open
                    : OrderStatus.partial);
            order.setClosedAt(null);

            // Re-occupy the table
            RestaurantTable table = order.getTable();
            if (table != null) {
                table.setStatus(TableStatus.occupied);
                tableRepository.save(table);
            }
        } else if (restored.compareTo(BigDecimal.ZERO) == 0) {
            order.setStatus(OrderStatus.open);
        }

        orderRepository.save(order);
        paymentRepository.deleteById(id);
    }

    // ────────────────────────────────────────────────────
    // HELPERS
    // ────────────────────────────────────────────────────

    private BigDecimal safeAmount(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}