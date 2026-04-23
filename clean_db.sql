USE restaurant_system;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE restaurant_orders;
TRUNCATE TABLE staff_shifts;
TRUNCATE TABLE staff;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE menu_categories;
TRUNCATE TABLE restaurant_tables;
TRUNCATE TABLE customers;
TRUNCATE TABLE shifts;
TRUNCATE TABLE roles;
TRUNCATE TABLE discounts;

SET FOREIGN_KEY_CHECKS = 1;
