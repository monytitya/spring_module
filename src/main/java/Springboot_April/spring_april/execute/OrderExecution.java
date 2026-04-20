package Springboot_April.spring_april.execute;

import Springboot_April.spring_april.dto.OrderRequest;
import Springboot_April.spring_april.model.*;
import Springboot_April.spring_april.enums.KitchenStatus;
import Springboot_April.spring_april.service.OrderService;
import Springboot_April.spring_april.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class OrderExecution {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final TableRepository tableRepository;
    private final StaffRepository staffRepository;
    private final DiscountRepository discountRepository;

    @Transactional
    public RestaurantOrder executeCreateOrder(OrderRequest request) {
        RestaurantTable table = tableRepository.findById(request.tableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));
        Staff staff = staffRepository.findById(request.staffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        RestaurantOrder order = RestaurantOrder.builder()
                .table(table)
                .staff(staff)
                .status(Springboot_April.spring_april.enums.OrderStatus.open)
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .build();

        RestaurantOrder savedOrder = orderRepository.save(order);

        if (request.items() != null) {
            for (OrderRequest.OrderItemRequest itemReq : request.items()) {
                executeAddItem(savedOrder.getId(), itemReq);
            }
        }

        // Table becomes occupied
        table.setStatus(Springboot_April.spring_april.enums.TableStatus.occupied);
        tableRepository.save(table);

        return savedOrder;
    }

    @Transactional
    public OrderItem executeAddItem(Long orderId, OrderRequest.OrderItemRequest request) {
        RestaurantOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        MenuItem menuItem = menuItemRepository.findById(request.menuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        BigDecimal subtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(request.quantity()));

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .menuItem(menuItem)
                .quantity(request.quantity())
                .unitPrice(menuItem.getPrice())
                .subtotalAmount(subtotal)
                .note(request.notes())
                .kitchenStatus(KitchenStatus.pending)
                .build();

        OrderItem savedItem = orderItemRepository.save(orderItem);
        executeRecalculateTotals(order);
        
        return savedItem;
    }

    @Transactional
    public void executeRecalculateTotals(RestaurantOrder order) {
        BigDecimal total = orderItemRepository.findByOrder(order).stream()
                .map(OrderItem::getSubtotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        // Basic discount calculation logic...
        order.setFinalAmount(total.subtract(order.getDiscountAmount()));
        orderRepository.save(order);
    }
}
