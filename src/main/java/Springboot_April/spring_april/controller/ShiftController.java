package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.ShiftRequest;
import Springboot_April.spring_april.dto.ShiftResponse;
import Springboot_April.spring_april.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping
    public ResponseEntity<List<ShiftResponse>> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftResponse> getShift(@PathVariable Long id) {
        return ResponseEntity.ok(shiftService.getShiftById(id));
    }

    @PostMapping
    public ResponseEntity<ShiftResponse> createShift(@RequestBody ShiftRequest request) {
        return ResponseEntity.ok(shiftService.createShift(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShiftResponse> updateShift(@PathVariable Long id, @RequestBody ShiftRequest request) {
        return ResponseEntity.ok(shiftService.updateShift(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        shiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
