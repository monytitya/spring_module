package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.SupplierRequest;
import Springboot_April.spring_april.dto.SupplierResponse;
import Springboot_April.spring_april.mapper.SupplierMapper;
import Springboot_April.spring_april.model.Supplier;
import Springboot_April.spring_april.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findByDeletedAtIsNull().stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return supplierMapper.toResponse(supplier);
    }

    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {
        Supplier supplier = supplierMapper.toEntity(request);
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setName(request.name());
        supplier.setContactName(request.contactName());
        supplier.setPhone(request.phone());
        supplier.setEmail(request.email());
        supplier.setAddress(request.address());
        supplier.setCategory(request.category());
        supplier.setStatus(request.status());
        supplier.setImagePath(request.imagePath());

        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setDeletedAt(LocalDateTime.now());
        supplierRepository.save(supplier);
    }

    @Transactional
    public SupplierResponse updateSupplierImage(Long id, String imagePath) {
        Supplier supplier = supplierRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setImagePath(imagePath);
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }
}
