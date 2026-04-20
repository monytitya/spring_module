package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.DiscountRequest;
import Springboot_April.spring_april.dto.DiscountResponse;
import Springboot_April.spring_april.mapper.DiscountMapper;
import Springboot_April.spring_april.model.Discount;
import Springboot_April.spring_april.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;

    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(discountMapper::toResponse)
                .toList();
    }

    public DiscountResponse getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found"));
        return discountMapper.toResponse(discount);
    }

    public DiscountResponse getByCode(String code) {
        Discount discount = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Discount not found with code: " + code));
        return discountMapper.toResponse(discount);
    }

    @Transactional
    public DiscountResponse createDiscount(DiscountRequest request) {
        Discount discount = discountMapper.toEntity(request);
        return discountMapper.toResponse(discountRepository.save(discount));
    }

    @Transactional
    public DiscountResponse updateDiscount(Long id, DiscountRequest request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found"));
        
        discount.setCode(request.code());
        discount.setType(request.type());
        discount.setValue(request.value());
        discount.setValidFrom(request.validFrom());
        discount.setValidUntil(request.validUntil());
        discount.setActive(request.active());
        
        return discountMapper.toResponse(discountRepository.save(discount));
    }

    @Transactional
    public void deleteDiscount(Long id) {
        if (!discountRepository.existsById(id)) {
            throw new RuntimeException("Discount not found");
        }
        discountRepository.deleteById(id);
    }
}
