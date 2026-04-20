package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.DiscountRequest;
import Springboot_April.spring_april.model.Discount;
import org.springframework.stereotype.Component;

@Component
public class DiscountMapper {

    public Discount toEntity(DiscountRequest request) {
        if (request == null) return null;
        
        return Discount.builder()
                .code(request.code())
                .type(request.type())
                .value(request.value())
                .validFrom(request.validFrom())
                .validUntil(request.validUntil())
                .active(request.active())
                .build();
    }
}
