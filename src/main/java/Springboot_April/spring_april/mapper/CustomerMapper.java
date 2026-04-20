package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.CustomerRequest;
import Springboot_April.spring_april.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerRequest request) {
        if (request == null) return null;
        
        return Customer.builder()
                .name(request.name())
                .phone(request.phone())
                .email(request.email())
                .build();
    }
}
