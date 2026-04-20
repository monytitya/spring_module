package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.DiscountRequest;
import Springboot_April.spring_april.dto.DiscountResponse;
import Springboot_April.spring_april.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiscountController {

    private final DiscountService discountService;

    @GetMapping
    public ResponseEntity<List<DiscountResponse>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscountResponse> getDiscount(@PathVariable Long id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<DiscountResponse> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(discountService.getByCode(code));
    }

    @PostMapping
    public ResponseEntity<DiscountResponse> createDiscount(@RequestBody DiscountRequest request) {
        return ResponseEntity.ok(discountService.createDiscount(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscountResponse> updateDiscount(@PathVariable Long id, @RequestBody DiscountRequest request) {
        return ResponseEntity.ok(discountService.updateDiscount(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }
}
