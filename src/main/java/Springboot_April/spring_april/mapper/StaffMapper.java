package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.StaffRequest;
import Springboot_April.spring_april.dto.StaffResponse;
import Springboot_April.spring_april.model.Staff;
import Springboot_April.spring_april.model.Role;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public Staff toEntity(StaffRequest request, Role role) {
        if (request == null) return null;
        
        return Staff.builder()
                .role(role)
                .name(request.name())
                .phone(request.phone())
                .pinCode(request.pinCode())
                .status(request.status())
                .build();
    }

    public StaffResponse toResponse(Staff staff) {
        if (staff == null) return null;

        return StaffResponse.builder()
                .id(staff.getId())
                .roleId(staff.getRole() != null ? staff.getRole().getId() : null)
                .roleName(staff.getRole() != null ? staff.getRole().getName() : null)
                .name(staff.getName())
                .phone(staff.getPhone())
                .status(staff.getStatus().name())
                .createdAt(staff.getCreatedAt())
                .build();
    }
}
