package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.OrderRequest;
import Springboot_April.spring_april.model.*;
import Springboot_April.spring_april.enums.DiscountType;
import Springboot_April.spring_april.enums.OrderStatus;
import Springboot_April.spring_april.enums.TableStatus;
import Springboot_April.spring_april.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TableRepository tableRepository;
    private final StaffRepository staffRepository;
    private final MenuItemRepository menuItemRepository;
    private final DiscountRepository discountRepository;

    @Transactional
    public RestaurantOrder createOrder(OrderRequest request) {
        RestaurantTable table = tableRepository.findById(request.tableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));
        
        Staff staff = staffRepository.findById(request.staffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        RestaurantOrder order = RestaurantOrder.builder()
                .table(table)
                .staff(staff)
                .status(OrderStatus.open)
                .totalAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .build();

        RestaurantOrder savedOrder = orderRepository.save(order);

        // Update table status
        table.setStatus(TableStatus.occupied);
        tableRepository.save(table);

        if (request.items() != null) {
            for (OrderRequest.OrderItemRequest itemReq : request.items()) {
                addOrderItem(savedOrder.getId(), itemReq);
            }
        }

        return savedOrder;
    }

    @Transactional
    public OrderItem addOrderItem(Long orderId, OrderRequest.OrderItemRequest request) {
        RestaurantOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        MenuItem menuItem = menuItemRepository.findById(request.menuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .menuItem(menuItem)
                .quantity(request.quantity())
                .unitPrice(menuItem.getPrice())
                .note(request.notes())
                .build();

        OrderItem savedItem = orderItemRepository.save(orderItem);
        recalculateTotals(order);
        return savedItem;
    }

    @Transactional
    public void recalculateTotals(RestaurantOrder order) {
        BigDecimal total = orderItemRepository.findByOrderId(order.getId())
                .stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        
        if (order.getDiscount() != null) {
            applyDiscount(order, order.getDiscount());
        } else {
            order.setFinalAmount(total);
        }
        
        orderRepository.save(order);
    }

    @Transactional
    public void applyDiscount(RestaurantOrder order, Discount discount) {
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
        orderRepository.save(order);
    }
}
