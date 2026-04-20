package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.ShiftRequest;
import Springboot_April.spring_april.dto.ShiftResponse;
import Springboot_April.spring_april.mapper.ShiftMapper;
import Springboot_April.spring_april.model.Shift;
import Springboot_April.spring_april.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final ShiftMapper shiftMapper;

    public List<ShiftResponse> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    public ShiftResponse getShiftById(Long id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
        return shiftMapper.toResponse(shift);
    }

    @Transactional
    public ShiftResponse createShift(ShiftRequest request) {
        Shift shift = shiftMapper.toEntity(request);
        return shiftMapper.toResponse(shiftRepository.save(shift));
    }

    @Transactional
    public ShiftResponse updateShift(Long id, ShiftRequest request) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
        shift.setName(request.name());
        shift.setStartTime(request.startTime());
        shift.setEndTime(request.endTime());
        return shiftMapper.toResponse(shiftRepository.save(shift));
    }

    @Transactional
    public void deleteShift(Long id) {
        if (!shiftRepository.existsById(id)) {
            throw new RuntimeException("Shift not found");
        }
        shiftRepository.deleteById(id);
    }
}
