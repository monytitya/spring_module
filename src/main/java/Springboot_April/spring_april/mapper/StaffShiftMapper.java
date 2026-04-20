package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.StaffShiftResponse;
import Springboot_April.spring_april.model.StaffShift;
import org.springframework.stereotype.Component;

@Component
public class StaffShiftMapper {

    public StaffShiftResponse toResponse(StaffShift entity) {
        if (entity == null) return null;
        return StaffShiftResponse.builder()
                .id(entity.getId())
                .staffId(entity.getStaff() != null ? entity.getStaff().getId() : null)
                .staffName(entity.getStaff() != null ? entity.getStaff().getName() : null)
                .shiftId(entity.getShift() != null ? entity.getShift().getId() : null)
                .shiftName(entity.getShift() != null ? entity.getShift().getName() : null)
                .workDate(entity.getWorkDate())
                .clockIn(entity.getClockIn())
                .clockOut(entity.getClockOut())
                .status(entity.getStatus())
                .note(entity.getNote())
                .build();
    }
}
