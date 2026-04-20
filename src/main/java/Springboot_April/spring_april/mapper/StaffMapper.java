package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.StaffRequest;
import Springboot_April.spring_april.model.Staff;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public Staff toEntity(StaffRequest request, Springboot_April.spring_april.model.Role role) {
        if (request == null) return null;
        
        return Staff.builder()
                .role(role)
                .name(request.name())
                .phone(request.phone())
                .pinCode(request.pinCode())
                .status(request.status())
                .build();
    }
}
