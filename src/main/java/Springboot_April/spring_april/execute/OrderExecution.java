package Springboot_April.spring_april.execute;

import Springboot_April.spring_april.dto.OrderRequest;
import Springboot_April.spring_april.dto.OrderResponse;
import Springboot_April.spring_april.model.*;
import Springboot_April.spring_april.enums.KitchenStatus;
import Springboot_April.spring_april.enums.OrderStatus;
import Springboot_April.spring_april.enums.TableStatus;
import Springboot_April.spring_april.mapper.OrderMapper;
import Springboot_April.spring_april.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class OrderExecution {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final TableRepository tableRepository;
    private final StaffRepository staffRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse executeCreateOrder(OrderRequest request) {
        RestaurantTable table = tableRepository.findById(request.tableId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Table not found with ID: " + request.tableId() +
                        ". Call GET /api/tables to see available table IDs."));
        Staff staff = staffRepository.findById(request.staffId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Staff not found with ID: " + request.staffId() +
                        ". Call GET /api/staff to see available staff IDs."));

        RestaurantOrder order = RestaurantOrder.builder()
                .table(table)
                .staff(staff)
                .status(OrderStatus.open)
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        RestaurantOrder savedOrder = orderRepository.save(order);

        // Process items atomically
        if (request.items() != null) {
            for (OrderRequest.OrderItemRequest itemReq : request.items()) {
                MenuItem menuItem = menuItemRepository.findById(itemReq.menuItemId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Menu item not found with ID: " + itemReq.menuItemId() +
                                ". Call GET /api/menu/items to see available menu item IDs."));

                BigDecimal subtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity()));

                OrderItem orderItem = OrderItem.builder()
                        .order(savedOrder)
                        .menuItem(menuItem)
                        .quantity(itemReq.quantity())
                        .unitPrice(menuItem.getPrice())
                        .subtotalAmount(subtotal)
                        .note(itemReq.notes())
                        .kitchenStatus(KitchenStatus.pending)
                        .build();

                orderItemRepository.save(orderItem);
                savedOrder.getItems().add(orderItem);
            }
        }

        // Recalculate totals
        executeRecalculateTotals(savedOrder);

        // Table becomes occupied
        table.setStatus(TableStatus.occupied);
        tableRepository.save(table);

        return orderMapper.toResponse(savedOrder);
    }

    @Transactional
    public OrderResponse executeAddItem(Long orderId, OrderRequest.OrderItemRequest request) {
        RestaurantOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Order not found with ID: " + orderId));
        MenuItem menuItem = menuItemRepository.findById(request.menuItemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Menu item not found with ID: " + request.menuItemId() +
                        ". Call GET /api/menu/items to see available menu item IDs."));

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

        orderItemRepository.save(orderItem);
        
        // Refresh and re-calc
        RestaurantOrder currentOrder = orderRepository.findById(orderId).get();
        executeRecalculateTotals(currentOrder);
        
        return orderMapper.toResponse(currentOrder);
    }

    @Transactional
    public void executeRecalculateTotals(RestaurantOrder order) {
        BigDecimal total = orderItemRepository.findByOrder(order).stream()
                .map(OrderItem::getSubtotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        order.setFinalAmount(total.subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO));
        orderRepository.save(order);
    }
}
