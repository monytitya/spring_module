package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.PaymentResponse;
import Springboot_April.spring_april.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment entity) {
        if (entity == null) return null;
        return PaymentResponse.builder()
                .id(entity.getId())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .method(entity.getMethod())
                .amount(entity.getAmount())
                .discountAmount(entity.getDiscountAmount())
                .khqrRef(entity.getKhqrRef())
                .paidAt(entity.getPaidAt())
                .build();
    }
}
