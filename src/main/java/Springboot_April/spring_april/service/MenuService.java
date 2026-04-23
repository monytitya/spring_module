package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.MenuCategoryRequest;
import Springboot_April.spring_april.dto.MenuCategoryResponse;
import Springboot_April.spring_april.dto.MenuItemRequest;
import Springboot_April.spring_april.dto.MenuItemResponse;
import Springboot_April.spring_april.mapper.MenuMapper;
import Springboot_April.spring_april.model.MenuCategory;
import Springboot_April.spring_april.model.MenuItem;
import Springboot_April.spring_april.repository.MenuCategoryRepository;
import Springboot_April.spring_april.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;
    private final MenuMapper menuMapper;

    public List<MenuCategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc().stream()
                .map(menuMapper::toCategoryResponse)
                .toList();
    }

    public List<MenuItemResponse> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryIdAndAvailableTrue(categoryId).stream()
                .map(menuMapper::toItemResponse)
                .toList();
    }

    public List<MenuItemResponse> getAllItems() {
        return itemRepository.findAll().stream()
                .filter(i -> i.getDeletedAt() == null)
                .map(menuMapper::toItemResponse)
                .toList();
    }

    public MenuCategoryResponse getCategoryById(Long id) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return menuMapper.toCategoryResponse(category);
    }

    public MenuItemResponse getItemById(Long id) {
        MenuItem item = itemRepository.findById(id)
                .filter(i -> i.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        return menuMapper.toItemResponse(item);
    }

    @Transactional
    public MenuCategoryResponse createCategory(MenuCategoryRequest request) {
        MenuCategory category = menuMapper.toCategoryEntity(request);
        return menuMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public MenuCategoryResponse updateCategory(Long id, MenuCategoryRequest request) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(request.name());
        category.setSortOrder(request.sortOrder());
        return menuMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        MenuCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        MenuItem item = menuMapper.toItemEntity(request, category);
        return menuMapper.toItemResponse(itemRepository.save(item));
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem item = itemRepository.findById(id)
                .filter(i -> i.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        
        if (request.categoryId() != null) {
            MenuCategory category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setCategory(category);
        }
        
        item.setName(request.name());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setAvailable(request.available() != null ? request.available() : item.getAvailable());
        
        return menuMapper.toItemResponse(itemRepository.save(item));
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem item = itemRepository.findById(id)
                .filter(i -> i.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        item.setDeletedAt(LocalDateTime.now());
        item.setAvailable(false);
        itemRepository.save(item);
    }

    @Transactional
    public MenuItemResponse updateItemImage(Long id, String imagePath) {
        MenuItem item = itemRepository.findById(id)
                .filter(i -> i.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        item.setImagePath(imagePath);
        return menuMapper.toItemResponse(itemRepository.save(item));
    }
}
