package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.SupplierRequest;
import Springboot_April.spring_april.dto.SupplierResponse;
import Springboot_April.spring_april.model.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {

    public Supplier toEntity(SupplierRequest request) {
        if (request == null)
            return null;

        return Supplier.builder()
                .name(request.name())
                .contactName(request.contactName())
                .phone(request.phone())
                .email(request.email())
                .address(request.address())
                .category(request.category())
                .status(request.status())
                .imagePath(request.imagePath())
                .build();
    }

    public SupplierResponse toResponse(Supplier supplier) {
        if (supplier == null)
            return null;

        return SupplierResponse.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactName(supplier.getContactName())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .category(supplier.getCategory())
                .status(supplier.getStatus())
                .imagePath(supplier.getImagePath())
                .createdAt(supplier.getCreatedAt())
                .build();
    }
}
