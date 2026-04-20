package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.OrderResponse;
import Springboot_April.spring_april.mapper.OrderMapper;
import Springboot_April.spring_april.model.Discount;
import Springboot_April.spring_april.model.RestaurantOrder;
import Springboot_April.spring_april.enums.DiscountType;
import Springboot_April.spring_april.repository.DiscountRepository;
import Springboot_April.spring_april.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final DiscountRepository discountRepository;
    private final OrderMapper orderMapper;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    public OrderResponse getOrderById(Long id) {
        RestaurantOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse applyDiscount(Long orderId, Long discountId) {
        RestaurantOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found"));

        BigDecimal total = order.getTotalAmount();
        BigDecimal finalAmount;

        if (discount.getType() == DiscountType.percentage) {
            BigDecimal reduction = total.multiply(discount.getValue()).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            finalAmount = total.subtract(reduction);
        } else {
            finalAmount = total.subtract(discount.getValue()).max(BigDecimal.ZERO);
        }

        order.setDiscount(discount);
        order.setFinalAmount(finalAmount.setScale(2, RoundingMode.HALF_UP));
        
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(id);
    }
}
