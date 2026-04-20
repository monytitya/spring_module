package Springboot_April.spring_april.service;

import Springboot_April.spring_april.model.MenuCategory;
import Springboot_April.spring_april.model.MenuItem;
import Springboot_April.spring_april.repository.MenuCategoryRepository;
import Springboot_April.spring_april.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;

    public List<MenuCategory> getAllCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }

    public List<MenuItem> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryIdAndAvailableTrue(categoryId);
    }

    public List<MenuItem> getAllItems() {
        return itemRepository.findAll().stream()
                .filter(i -> i.getDeletedAt() == null)
                .toList();
    }

    public MenuCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public MenuItem getItemById(Long id) {
        return itemRepository.findById(id)
                .filter(i -> i.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }

    @Transactional
    public MenuCategory createCategory(MenuCategory category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public MenuCategory updateCategory(Long id, MenuCategory details) {
        MenuCategory category = getCategoryById(id);
        category.setName(details.getName());
        category.setSortOrder(details.getSortOrder());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    @Transactional
    public MenuItem createMenuItem(MenuItem item) {
        return itemRepository.save(item);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItem details) {
        MenuItem item = getItemById(id);
        item.setName(details.getName());
        item.setDescription(details.getDescription());
        item.setPrice(details.getPrice());
        item.setAvailable(details.getAvailable());
        item.setCategory(details.getCategory());
        return itemRepository.save(item);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem item = getItemById(id);
        item.setDeletedAt(java.time.LocalDateTime.now());
        item.setAvailable(false);
        itemRepository.save(item);
    }
}
