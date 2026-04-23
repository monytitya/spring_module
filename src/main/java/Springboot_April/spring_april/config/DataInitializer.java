package Springboot_April.spring_april.config;

import Springboot_April.spring_april.model.Role;
import Springboot_April.spring_april.model.Shift;
import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.enums.TableStatus;
import Springboot_April.spring_april.repository.RoleRepository;
import Springboot_April.spring_april.repository.ShiftRepository;
import Springboot_April.spring_april.repository.TableRepository;
import Springboot_April.spring_april.model.Staff;
import Springboot_April.spring_april.enums.StaffStatus;
import Springboot_April.spring_april.repository.StaffRepository;
import Springboot_April.spring_april.model.Customer;
import Springboot_April.spring_april.repository.CustomerRepository;
import Springboot_April.spring_april.model.MenuCategory;
import Springboot_April.spring_april.repository.MenuCategoryRepository;
import Springboot_April.spring_april.model.MenuItem;
import Springboot_April.spring_april.repository.MenuItemRepository;
import Springboot_April.spring_april.model.RestaurantOrder;
import Springboot_April.spring_april.model.OrderItem;
import Springboot_April.spring_april.enums.OrderStatus;
import Springboot_April.spring_april.enums.KitchenStatus;
import Springboot_April.spring_april.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final ShiftRepository shiftRepository;
    private final TableRepository tableRepository;
    private final StaffRepository staffRepository;
    private final CustomerRepository customerRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) throws Exception {
        cleanupJunkData();
        seedRoles();
        seedShifts();
        seedTables();
        seedStaff();
        seedCustomers();
        seedMenu();
        seedOrders();
    }

    private void cleanupJunkData() {
        // Find and delete any table named "string"
        tableRepository.findAll().stream()
                .filter(t -> "string".equalsIgnoreCase(t.getTableNumber()))
                .forEach(t -> {
                    // Delete orders linked to this table first to satisfy FK constraints
                    orderRepository.findByTable(t).forEach(order -> {
                        orderRepository.delete(order);
                    });
                    tableRepository.delete(t);
                    System.out.println("Cleaned up junk table: " + t.getId());
                });
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            Role admin = Role.builder().name("ADMIN").description("Administrator with full access").build();
            Role manager = Role.builder().name("MANAGER").description("Restaurant manager").build();
            Role staff = Role.builder().name("STAFF").description("Regular floor staff").build();
            
            roleRepository.saveAll(Arrays.asList(admin, manager, staff));
            System.out.println("Default roles seeded successfully.");
        }
    }

    private void seedShifts() {
        if (shiftRepository.count() == 0) {
            Shift morning = Shift.builder()
                    .name("Morning Shift")
                    .startTime(LocalTime.of(8, 0))
                    .endTime(LocalTime.of(16, 0))
                    .build();
            Shift evening = Shift.builder()
                    .name("Evening Shift")
                    .startTime(LocalTime.of(16, 0))
                    .endTime(LocalTime.of(0, 0))
                    .build();
            
            shiftRepository.saveAll(Arrays.asList(morning, evening));
            System.out.println("Default shifts seeded successfully.");
        }
    }

    private void seedTables() {
        List<String> tableNumbers = Arrays.asList("T1", "T2", "T3", "T4", "T5", "T6");
        for (String num : tableNumbers) {
            if (tableRepository.findByTableNumber(num).isEmpty()) {
                int capacity = num.equals("T1") ? 2 : (num.equals("T4") || num.equals("T5") ? 6 : 4);
                tableRepository.save(RestaurantTable.builder()
                        .tableNumber(num)
                        .capacity(capacity)
                        .status(TableStatus.available)
                        .build());
                System.out.println("Seeded table: " + num);
            }
        }
    }

    private void seedStaff() {
        if (staffRepository.count() < 3) {
            List<Role> roles = roleRepository.findAll();
            if (!roles.isEmpty()) {
                Role adminRole   = roles.stream().filter(r -> r.getName().equals("ADMIN")).findFirst().orElse(roles.get(0));
                Role managerRole = roles.stream().filter(r -> r.getName().equals("MANAGER")).findFirst().orElse(roles.get(0));
                Role staffRole   = roles.stream().filter(r -> r.getName().equals("STAFF")).findFirst().orElse(roles.get(0));

                if (staffRepository.findAll().stream().noneMatch(s -> s.getName().equals("Admin User"))) {
                    staffRepository.save(Staff.builder().name("Admin User").phone("1234567890")
                            .pinCode("1234").status(StaffStatus.active).role(adminRole).build());
                }
                if (staffRepository.findAll().stream().noneMatch(s -> s.getName().equals("Manager Sam"))) {
                    staffRepository.save(Staff.builder().name("Manager Sam").phone("0987654321")
                            .pinCode("5678").status(StaffStatus.active).role(managerRole).build());
                }
                if (staffRepository.findAll().stream().noneMatch(s -> s.getName().equals("Waiter Kim"))) {
                    staffRepository.save(Staff.builder().name("Waiter Kim").phone("0112233445")
                            .pinCode("0000").status(StaffStatus.active).role(staffRole).build());
                }
                System.out.println("Staff healing seeding complete.");
            }
        }
    }

    private void seedCustomers() {
        if (customerRepository.count() == 0) {
            Customer defaultCustomer = Customer.builder()
                    .name("Jane Doe")
                    .phone("555-1234")
                    .email("jane@example.com")
                    .build();
            customerRepository.save(defaultCustomer);
            System.out.println("Default customer seeded successfully.");
        }
    }

    private void seedMenu() {
        if (menuCategoryRepository.count() == 0) {

            // ── Categories ──────────────────────────────────────────
            MenuCategory beverages = menuCategoryRepository.save(
                    MenuCategory.builder().name("Beverages").sortOrder(1).build());

            MenuCategory starters = menuCategoryRepository.save(
                    MenuCategory.builder().name("Starters").sortOrder(2).build());

            MenuCategory mainCourse = menuCategoryRepository.save(
                    MenuCategory.builder().name("Main Course").sortOrder(3).build());

            MenuCategory desserts = menuCategoryRepository.save(
                    MenuCategory.builder().name("Desserts").sortOrder(4).build());

            // ── Beverages ────────────────────────────────────────────
            menuItemRepository.saveAll(Arrays.asList(
                    MenuItem.builder().category(beverages).name("Coca Cola")
                            .description("Cold and refreshing soda").price(new java.math.BigDecimal("1.50")).available(true).build(),
                    MenuItem.builder().category(beverages).name("Orange Juice")
                            .description("Freshly squeezed orange juice").price(new java.math.BigDecimal("2.50")).available(true).build(),
                    MenuItem.builder().category(beverages).name("Iced Coffee")
                            .description("Cold brew with milk").price(new java.math.BigDecimal("3.00")).available(true).build(),
                    MenuItem.builder().category(beverages).name("Mineral Water")
                            .description("Still mineral water 500ml").price(new java.math.BigDecimal("1.00")).available(true).build()
            ));

            // ── Starters ─────────────────────────────────────────────
            menuItemRepository.saveAll(Arrays.asList(
                    MenuItem.builder().category(starters).name("Spring Rolls")
                            .description("Crispy vegetable spring rolls (4 pcs)").price(new java.math.BigDecimal("4.50")).available(true).build(),
                    MenuItem.builder().category(starters).name("Chicken Wings")
                            .description("Spicy buffalo chicken wings (6 pcs)").price(new java.math.BigDecimal("6.00")).available(true).build(),
                    MenuItem.builder().category(starters).name("Caesar Salad")
                            .description("Romaine, croutons, parmesan").price(new java.math.BigDecimal("5.50")).available(true).build()
            ));

            // ── Main Course ───────────────────────────────────────────
            menuItemRepository.saveAll(Arrays.asList(
                    MenuItem.builder().category(mainCourse).name("Grilled Salmon")
                            .description("Served with lemon butter and vegetables").price(new java.math.BigDecimal("14.00")).available(true).build(),
                    MenuItem.builder().category(mainCourse).name("Beef Steak")
                            .description("250g sirloin with fries and sauce").price(new java.math.BigDecimal("18.00")).available(true).build(),
                    MenuItem.builder().category(mainCourse).name("Chicken Rice")
                            .description("Steamed chicken over jasmine rice").price(new java.math.BigDecimal("8.50")).available(true).build(),
                    MenuItem.builder().category(mainCourse).name("Vegetarian Pasta")
                            .description("Penne with tomato basil sauce").price(new java.math.BigDecimal("9.00")).available(true).build()
            ));

            // ── Desserts ──────────────────────────────────────────────
            menuItemRepository.saveAll(Arrays.asList(
                    MenuItem.builder().category(desserts).name("Chocolate Lava Cake")
                            .description("Warm cake with vanilla ice cream").price(new java.math.BigDecimal("5.00")).available(true).build(),
                    MenuItem.builder().category(desserts).name("Mango Sticky Rice")
                            .description("Thai style with coconut milk").price(new java.math.BigDecimal("4.00")).available(true).build()
            ));

            System.out.println("Menu categories and items seeded successfully (4 categories, 13 items).");
        }
    }

    private void seedOrders() {
        if (orderRepository.count() == 0) {
            RestaurantTable table = tableRepository.findAll().stream().findFirst().orElse(null);
            Staff staff = staffRepository.findAll().stream().findFirst().orElse(null);
            MenuItem menuItem = menuItemRepository.findAll().stream().findFirst().orElse(null);

            if (table != null && staff != null && menuItem != null) {
                RestaurantOrder order = RestaurantOrder.builder()
                        .table(table)
                        .staff(staff)
                        .status(OrderStatus.open)
                        .totalAmount(menuItem.getPrice())
                        .discountAmount(java.math.BigDecimal.ZERO)
                        .finalAmount(menuItem.getPrice())
                        .paidAmount(java.math.BigDecimal.ZERO)
                        .build();

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .menuItem(menuItem)
                        .quantity(1)
                        .unitPrice(menuItem.getPrice())
                        .subtotalAmount(menuItem.getPrice())
                        .kitchenStatus(KitchenStatus.pending)
                        .build();

                order.setItems(List.of(item));
                orderRepository.save(order);
                
                System.out.println("Default order seeded successfully.");
            }
        }
    }
}
