package Springboot_April.spring_april.scratch;

import Springboot_April.spring_april.model.MenuItem;
import Springboot_April.spring_april.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UndeleteMenuScript implements CommandLineRunner {
    private final MenuItemRepository menuItemRepository;
    private final Springboot_April.spring_april.repository.MenuCategoryRepository categoryRepository;

    public UndeleteMenuScript(MenuItemRepository menuItemRepository, Springboot_April.spring_april.repository.MenuCategoryRepository categoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- MENU RECOVERY ---");
        
        // Recover all categories
        List<Springboot_April.spring_april.model.MenuCategory> allCategories = categoryRepository.findAll();
        for (Springboot_April.spring_april.model.MenuCategory cat : allCategories) {
            System.out.println(">>> RECOVERED CATEGORY: " + cat.getName());
        }

        // Recover all items
        List<MenuItem> allItems = menuItemRepository.findAll();
        for (MenuItem item : allItems) {
            if (item.getDeletedAt() != null || !item.getAvailable()) {
                item.setDeletedAt(null);
                item.setAvailable(true);
                menuItemRepository.save(item);
                System.out.println(">>> RECOVERED ITEM: " + item.getName());
            }
        }
        System.out.println("---------------------");
    }
}
