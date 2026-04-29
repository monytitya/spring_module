package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.SupplierRequest;
import Springboot_April.spring_april.dto.SupplierResponse;
import Springboot_April.spring_april.service.SupplierService;
import Springboot_April.spring_april.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;
    private final FileUploadService fileUploadService;

    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getSupplier(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    public ResponseEntity<SupplierResponse> createSupplier(@RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable Long id,
            @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<SupplierResponse> uploadSupplierImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String imagePath = fileUploadService.storeFile(file);
        
        // I need to add updateSupplierImage to SupplierService
        return ResponseEntity.ok(supplierService.updateSupplierImage(id, imagePath));
    }
}
