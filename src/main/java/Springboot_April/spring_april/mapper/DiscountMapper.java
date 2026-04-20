package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.DiscountRequest;
import Springboot_April.spring_april.dto.DiscountResponse;
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

    public DiscountResponse toResponse(Discount entity) {
        if (entity == null) return null;
        return DiscountResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .type(entity.getType())
                .value(entity.getValue())
                .validFrom(entity.getValidFrom())
                .validUntil(entity.getValidUntil())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
