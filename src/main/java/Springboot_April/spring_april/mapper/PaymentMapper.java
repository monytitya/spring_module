package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.PaymentResponse;
import Springboot_April.spring_april.model.Payment;
import Springboot_April.spring_april.model.RestaurantOrder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PaymentMapper {

    /**
     * Maps a Payment entity to a PaymentResponse.
     * Enriches with remainingAmount and orderStatus from the parent order.
     */
    public PaymentResponse toResponse(Payment entity) {
        if (entity == null) return null;

        RestaurantOrder order = entity.getOrder();
        BigDecimal paidAmount   = order != null ? safeAmount(order.getPaidAmount()) : BigDecimal.ZERO;
        BigDecimal finalAmount  = order != null ? safeAmount(order.getFinalAmount()) : BigDecimal.ZERO;
        BigDecimal remaining    = finalAmount.subtract(paidAmount).max(BigDecimal.ZERO);
        String     orderStatus  = order != null ? order.getStatus().name() : null;

        return PaymentResponse.builder()
                .id(entity.getId())
                .orderId(order != null ? order.getId() : null)
                .method(entity.getMethod())
                .amount(entity.getAmount())
                .discountAmount(safeAmount(entity.getDiscountAmount()))
                .khqrRef(entity.getKhqrRef())
                .paidAt(entity.getPaidAt())
                .totalPaidAmount(paidAmount)
                .remainingAmount(remaining)
                .orderStatus(orderStatus)
                .build();
    }

    private BigDecimal safeAmount(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
