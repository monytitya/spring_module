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
        seedRoles();
        seedShifts();
        seedTables();
        seedStaff();
        seedCustomers();
        seedMenu();
        seedOrders();
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
        if (tableRepository.count() == 0) {
            RestaurantTable t1 = RestaurantTable.builder().tableNumber("T1").capacity(2).status(TableStatus.available).build();
            RestaurantTable t2 = RestaurantTable.builder().tableNumber("T2").capacity(4).status(TableStatus.available).build();
            RestaurantTable t3 = RestaurantTable.builder().tableNumber("T3").capacity(6).status(TableStatus.available).build();
            
            tableRepository.saveAll(Arrays.asList(t1, t2, t3));
            System.out.println("Default tables seeded successfully.");
        }
    }

    private void seedStaff() {
        if (staffRepository.count() == 0) {
            List<Role> roles = roleRepository.findAll();
            if (!roles.isEmpty()) {
                Staff defaultStaff = Staff.builder()
                        .name("Admin User")
                        .phone("1234567890")
                        .pinCode("1234")
                        .status(StaffStatus.active)
                        .role(roles.get(0))
                        .build();
                staffRepository.save(defaultStaff);
                System.out.println("Default staff seeded successfully.");
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
            MenuCategory drinks = MenuCategory.builder()
                    .name("Beverages")
                    .sortOrder(1)
                    .build();
            menuCategoryRepository.save(drinks);
            
            MenuItem cocaCola = MenuItem.builder()
                    .category(drinks)
                    .name("Coca Cola")
                    .description("Cold and refreshing")
                    .price(new java.math.BigDecimal("1.50"))
                    .available(true)
                    .build();
            menuItemRepository.save(cocaCola);
            
            System.out.println("Default menu category and items seeded successfully.");
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
