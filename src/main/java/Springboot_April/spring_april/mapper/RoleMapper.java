package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.RoleResponse;
import Springboot_April.spring_april.model.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public RoleResponse toResponse(Role entity) {
        if (entity == null) return null;
        return RoleResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }
}
