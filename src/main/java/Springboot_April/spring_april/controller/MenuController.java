package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.MenuCategoryRequest;
import Springboot_April.spring_april.dto.MenuCategoryResponse;
import Springboot_April.spring_april.dto.MenuItemRequest;
import Springboot_April.spring_april.dto.MenuItemResponse;
import Springboot_April.spring_april.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;
    private final Springboot_April.spring_april.service.FileUploadService fileUploadService;

    @Autowired
    public MenuController(MenuService menuService, Springboot_April.spring_april.service.FileUploadService fileUploadService) {
        this.menuService = menuService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    @GetMapping("/categories/{categoryId}/items")
    public ResponseEntity<List<MenuItemResponse>> getItemsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(menuService.getItemsByCategory(categoryId));
    }

    @GetMapping("/items")
    public ResponseEntity<List<MenuItemResponse>> getAllItems() {
        return ResponseEntity.ok(menuService.getAllItems());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<MenuCategoryResponse> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getCategoryById(id));
    }

    @PostMapping("/categories")
    public ResponseEntity<MenuCategoryResponse> createCategory(@RequestBody MenuCategoryRequest request) {
        return ResponseEntity.ok(menuService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<MenuCategoryResponse> updateCategory(@PathVariable Long id, @RequestBody MenuCategoryRequest request) {
        return ResponseEntity.ok(menuService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItem(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getItemById(id));
    }

    @PostMapping("/items")
    public ResponseEntity<MenuItemResponse> createMenuItem(@RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.createMenuItem(request));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<MenuItemResponse> updateMenuItem(@PathVariable Long id, @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.updateMenuItem(id, request));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/items/{id}/image")
    public ResponseEntity<MenuItemResponse> uploadItemImage(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String imagePath = fileUploadService.storeFile(file);
        return ResponseEntity.ok(menuService.updateItemImage(id, imagePath));
    }
}
