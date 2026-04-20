package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.ShiftRequest;
import Springboot_April.spring_april.dto.ShiftResponse;
import Springboot_April.spring_april.model.Shift;
import org.springframework.stereotype.Component;

@Component
public class ShiftMapper {

    public Shift toEntity(ShiftRequest request) {
        if (request == null) return null;
        return Shift.builder()
                .name(request.name())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .build();
    }

    public ShiftResponse toResponse(Shift entity) {
        if (entity == null) return null;
        return ShiftResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .build();
    }
}
