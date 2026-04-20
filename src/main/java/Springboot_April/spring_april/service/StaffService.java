package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.StaffRequest;
import Springboot_April.spring_april.dto.StaffResponse;
import Springboot_April.spring_april.dto.StaffShiftResponse;
import Springboot_April.spring_april.mapper.StaffMapper;
import Springboot_April.spring_april.mapper.StaffShiftMapper;
import Springboot_April.spring_april.model.Staff;
import Springboot_April.spring_april.model.Shift;
import Springboot_April.spring_april.model.StaffShift;
import Springboot_April.spring_april.enums.StaffStatus;
import Springboot_April.spring_april.enums.ShiftStatus;
import Springboot_April.spring_april.repository.StaffRepository;
import Springboot_April.spring_april.repository.ShiftRepository;
import Springboot_April.spring_april.repository.StaffShiftRepository;
import Springboot_April.spring_april.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StaffService {

    private final StaffRepository staffRepository;
    private final RoleRepository roleRepository;
    private final ShiftRepository shiftRepository;
    private final StaffShiftRepository staffShiftRepository;
    private final StaffMapper staffMapper;
    private final StaffShiftMapper staffShiftMapper;

    public List<StaffResponse> getAllActiveStaff() {
        return staffRepository.findAll().stream()
                .filter(s -> s.getDeletedAt() == null)
                .map(staffMapper::toResponse)
                .toList();
    }

    public StaffResponse getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        return staffMapper.toResponse(staff);
    }

    @Transactional
    public StaffResponse createStaff(StaffRequest request) {
        Staff staff = staffMapper.toEntity(request, roleRepository.findById(request.roleId())
                .orElseThrow(() -> new RuntimeException("Role not found")));
        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    public StaffResponse updateStaff(Long id, StaffRequest request) {
        Staff staff = staffRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        if (request.roleId() != null) {
            staff.setRole(roleRepository.findById(request.roleId())
                    .orElseThrow(() -> new RuntimeException("Role not found")));
        }
        
        staff.setName(request.name());
        staff.setPhone(request.phone());
        staff.setPinCode(request.pinCode());
        staff.setStatus(request.status());
        
        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    public void deleteStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        staff.setDeletedAt(LocalDateTime.now());
        staffRepository.save(staff);
    }

    public java.util.Optional<StaffResponse> loginWithPin(String pinCode) {
        return staffRepository.findByPinCodeAndStatus(pinCode, StaffStatus.active)
                .map(staffMapper::toResponse);
    }

    @Transactional
    public StaffShiftResponse clockIn(Long staffId, Long shiftId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + staffId));
        
        Shift shiftEntity = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found with ID: " + shiftId));

        StaffShift staffShift = StaffShift.builder()
                .staff(staff)
                .shift(shiftEntity)
                .workDate(LocalDate.now())
                .clockIn(LocalDateTime.now())
                .status(ShiftStatus.ongoing)
                .build();
        
        return staffShiftMapper.toResponse(staffShiftRepository.save(staffShift));
    }

    @Transactional
    public StaffShiftResponse clockOut(Long staffShiftId) {
        StaffShift shift = staffShiftRepository.findById(staffShiftId)
                .orElseThrow(() -> new RuntimeException("Shift record not found"));
        shift.setClockOut(LocalDateTime.now());
        shift.setStatus(ShiftStatus.completed);
        return staffShiftMapper.toResponse(staffShiftRepository.save(shift));
    }
}
