package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.DiscountRequest;
import Springboot_April.spring_april.model.Discount;
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
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discount> getDiscount(@PathVariable Long id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }

    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody DiscountRequest request) {
        Discount discount = Discount.builder()
                .code(request.code())
                .type(request.type())
                .value(request.value())
                .validFrom(request.validFrom())
                .validUntil(request.validUntil())
                .active(request.active())
                .build();
        return ResponseEntity.ok(discountService.createDiscount(discount));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Discount> updateDiscount(@PathVariable Long id, @RequestBody DiscountRequest request) {
        Discount details = Discount.builder()
                .code(request.code())
                .type(request.type())
                .value(request.value())
                .validFrom(request.validFrom())
                .validUntil(request.validUntil())
                .active(request.active())
                .build();
        return ResponseEntity.ok(discountService.updateDiscount(id, details));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }
}
