package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.MenuCategoryRequest;
import Springboot_April.spring_april.dto.MenuCategoryResponse;
import Springboot_April.spring_april.dto.MenuItemRequest;
import Springboot_April.spring_april.dto.MenuItemResponse;
import Springboot_April.spring_april.model.MenuCategory;
import Springboot_April.spring_april.model.MenuItem;
import org.springframework.stereotype.Component;

@Component
public class MenuMapper {

    public MenuCategory toCategoryEntity(MenuCategoryRequest request) {
        if (request == null) return null;
        return MenuCategory.builder()
                .name(request.name())
                .sortOrder(request.sortOrder())
                .build();
    }

    public MenuCategoryResponse toCategoryResponse(MenuCategory entity) {
        if (entity == null) return null;
        return MenuCategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .sortOrder(entity.getSortOrder())
                .build();
    }

    public MenuItem toItemEntity(MenuItemRequest request, MenuCategory category) {
        if (request == null) return null;
        return MenuItem.builder()
                .category(category)
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .available(request.available() != null ? request.available() : true)
                .imagePath(request.imagePath())
                .build();
    }

    public MenuItemResponse toItemResponse(MenuItem entity) {
        if (entity == null) return null;
        return MenuItemResponse.builder()
                .id(entity.getId())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .available(entity.getAvailable())
                .imagePath(entity.getImagePath())
                .build();
    }
}
