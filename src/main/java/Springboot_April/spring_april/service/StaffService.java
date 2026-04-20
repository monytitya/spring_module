package Springboot_April.spring_april.service;

import Springboot_April.spring_april.mapper.StaffMapper;
import Springboot_April.spring_april.model.Staff;
import Springboot_April.spring_april.model.StaffShift;
import Springboot_April.spring_april.enums.ShiftStatus;
import Springboot_April.spring_april.enums.StaffStatus;
import Springboot_April.spring_april.repository.StaffRepository;
import Springboot_April.spring_april.repository.StaffShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final StaffShiftRepository staffShiftRepository;
    private final Springboot_April.spring_april.repository.ShiftRepository shiftRepository;
    private final Springboot_April.spring_april.repository.RoleRepository roleRepository;
    private final StaffMapper staffMapper;
    private final Springboot_April.spring_april.mapper.StaffShiftMapper staffShiftMapper;

    public List<Springboot_April.spring_april.dto.StaffResponse> getAllActiveStaff() {
        return staffRepository.findAll().stream()
                .filter(s -> s.getDeletedAt() == null)
                .map(staffMapper::toResponse)
                .toList();
    }

    public Springboot_April.spring_april.dto.StaffResponse getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        return staffMapper.toResponse(staff);
    }

    @Transactional
    public Springboot_April.spring_april.dto.StaffResponse createStaff(Springboot_April.spring_april.dto.StaffRequest request) {
        if (request.roleId() == null) {
            throw new RuntimeException("Role ID is required for new staff");
        }
        
        Springboot_April.spring_april.model.Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + request.roleId()));
                
        Staff staff = staffMapper.toEntity(request, role);
        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    public Springboot_April.spring_april.dto.StaffResponse updateStaff(Long id, Springboot_April.spring_april.dto.StaffRequest request) {
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

    public java.util.Optional<Springboot_April.spring_april.dto.StaffResponse> loginWithPin(String pinCode) {
        return staffRepository.findByPinCodeAndStatus(pinCode, StaffStatus.active)
                .map(staffMapper::toResponse);
    }

    @Transactional
    public Springboot_April.spring_april.dto.StaffShiftResponse clockIn(Long staffId, Long shiftId) {
        StaffShift shift = StaffShift.builder()
                .staff(staffRepository.getReferenceById(staffId))
                .shift(shiftRepository.getReferenceById(shiftId))
                .workDate(LocalDate.now())
                .clockIn(LocalDateTime.now())
                .status(ShiftStatus.ongoing)
                .build();
        return staffShiftMapper.toResponse(staffShiftRepository.save(shift));
    }

    @Transactional
    public Springboot_April.spring_april.dto.StaffShiftResponse clockOut(Long staffShiftId) {
        StaffShift shift = staffShiftRepository.findById(staffShiftId)
                .orElseThrow(() -> new RuntimeException("Shift record not found"));
        shift.setClockOut(LocalDateTime.now());
        shift.setStatus(ShiftStatus.completed);
        return staffShiftMapper.toResponse(staffShiftRepository.save(shift));
    }
}
