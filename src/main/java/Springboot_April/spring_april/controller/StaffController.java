package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.StaffLoginRequest;
import Springboot_April.spring_april.model.Staff;
import Springboot_April.spring_april.model.StaffShift;
import Springboot_April.spring_april.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllActiveStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaff(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PostMapping
    public ResponseEntity<Staff> createStaff(@RequestBody Springboot_April.spring_april.dto.StaffRequest request) {
        return ResponseEntity.ok(staffService.createStaff(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @RequestBody Springboot_April.spring_april.dto.StaffRequest request) {
        return ResponseEntity.ok(staffService.updateStaff(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Staff> login(@RequestBody StaffLoginRequest request) {
        return staffService.loginWithPin(request.pinCode())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/{staffId}/shifts/{shiftId}/clock-in")
    public ResponseEntity<StaffShift> clockIn(
            @PathVariable Long staffId,
            @PathVariable Long shiftId) {
        return ResponseEntity.ok(staffService.clockIn(staffId, shiftId));
    }

    @PostMapping("/shifts/{staffShiftId}/clock-out")
    public ResponseEntity<StaffShift> clockOut(@PathVariable Long staffShiftId) {
        return ResponseEntity.ok(staffService.clockOut(staffShiftId));
    }
}
