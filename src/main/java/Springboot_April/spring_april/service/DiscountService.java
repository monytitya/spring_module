package Springboot_April.spring_april.service;

import Springboot_April.spring_april.mapper.DiscountMapper;
import Springboot_April.spring_april.model.Discount;
import Springboot_April.spring_april.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    public Discount getDiscountById(Long id) {
        return discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found"));
    }

    @Transactional
    public Discount createDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    @Transactional
    public Discount updateDiscount(Long id, Discount details) {
        Discount discount = getDiscountById(id);
        discount.setCode(details.getCode());
        discount.setType(details.getType());
        discount.setValue(details.getValue());
        discount.setValidFrom(details.getValidFrom());
        discount.setValidUntil(details.getValidUntil());
        discount.setActive(details.getActive());
        return discountRepository.save(discount);
    }

    @Transactional
    public void deleteDiscount(Long id) {
        if (!discountRepository.existsById(id)) {
            throw new RuntimeException("Discount not found");
        }
        discountRepository.deleteById(id);
    }
}
