CREATE DATABASE IF NOT EXISTS restaurant_pos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restaurant_pos;


CREATE TABLE customer (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  UNIQUE,
  email      VARCHAR(100) UNIQUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP    NULL
);

CREATE TABLE `table` (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  table_number VARCHAR(10)  NOT NULL UNIQUE,
  capacity     TINYINT      NOT NULL DEFAULT 4,
  status       ENUM('available','occupied','reserved','inactive')
               NOT NULL DEFAULT 'available',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reservation (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  table_id    INT UNSIGNED NOT NULL,
  customer_id INT UNSIGNED NOT NULL,
  reserved_at DATETIME     NOT NULL,
  guest_count TINYINT      NOT NULL DEFAULT 1,
  status      ENUM('pending','confirmed','seated','cancelled','no_show')
              NOT NULL DEFAULT 'pending',
  note        TEXT         NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_res_table    FOREIGN KEY (table_id)    REFERENCES `table`(id),
  CONSTRAINT fk_res_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE role (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  description VARCHAR(200) NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permission (
  id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id INT UNSIGNED NOT NULL,
  module  VARCHAR(50)  NOT NULL,   
  action  VARCHAR(50)  NOT NULL,   
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES role(id),
  UNIQUE KEY uq_role_module_action (role_id, module, action)
);

CREATE TABLE staff (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id    INT UNSIGNED NOT NULL,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  UNIQUE,
  pin_code   CHAR(6)      NOT NULL,          
  status     ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP    NULL,
  CONSTRAINT fk_staff_role FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE shift (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(50)  NOT NULL,   
  start_time TIME         NOT NULL,
  end_time   TIME         NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_shift (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  staff_id   INT UNSIGNED NOT NULL,
  shift_id   INT UNSIGNED NOT NULL,
  work_date  DATE         NOT NULL,
  clock_in   TIMESTAMP    NULL,
  clock_out  TIMESTAMP    NULL,
  status     ENUM('scheduled','ongoing','completed','absent')
             NOT NULL DEFAULT 'scheduled',
  note       TEXT         NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ss_staff FOREIGN KEY (staff_id) REFERENCES staff(id),
  CONSTRAINT fk_ss_shift FOREIGN KEY (shift_id) REFERENCES shift(id),
  UNIQUE KEY uq_staff_date_shift (staff_id, work_date, shift_id)
);

CREATE TABLE menu_category (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  sort_order TINYINT      NOT NULL DEFAULT 0,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE menu_item (
  id          INT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED   NOT NULL,
  name        VARCHAR(150)   NOT NULL,
  description TEXT           NULL,
  price       DECIMAL(10,2)  NOT NULL,
  available   BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP      NULL,
  CONSTRAINT fk_mi_category FOREIGN KEY (category_id) REFERENCES menu_category(id)
);

CREATE TABLE discount (
  id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(50)   NOT NULL UNIQUE,
  type        ENUM('percentage','fixed') NOT NULL,
  value       DECIMAL(10,2) NOT NULL,
  valid_from  TIMESTAMP     NULL,
  valid_until TIMESTAMP     NULL,
  active      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `order` (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  table_id       INT UNSIGNED  NOT NULL,
  staff_id       INT UNSIGNED  NOT NULL,
  staff_shift_id INT UNSIGNED  NULL,
  discount_id    INT UNSIGNED  NULL,
  status         ENUM('open','serving','paid','closed','void')
                 NOT NULL DEFAULT 'open',
  total_amount   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  final_amount   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  opened_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at      TIMESTAMP     NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ord_table       FOREIGN KEY (table_id)       REFERENCES `table`(id),
  CONSTRAINT fk_ord_staff       FOREIGN KEY (staff_id)       REFERENCES staff(id),
  CONSTRAINT fk_ord_staff_shift FOREIGN KEY (staff_shift_id) REFERENCES staff_shift(id),
  CONSTRAINT fk_ord_discount    FOREIGN KEY (discount_id)    REFERENCES discount(id)
);

CREATE TABLE order_item (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  order_id       INT UNSIGNED  NOT NULL,
  menu_item_id   INT UNSIGNED  NOT NULL,
  quantity       TINYINT       NOT NULL DEFAULT 1,
  unit_price     DECIMAL(10,2) NOT NULL,
  notes          TEXT          NULL,
  kitchen_status ENUM('pending','preparing','ready','served','cancelled')
                 NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_oi_order     FOREIGN KEY (order_id)     REFERENCES `order`(id),
  CONSTRAINT fk_oi_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_item(id)
);
CREATE TABLE kitchen_ticket (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        INT UNSIGNED NOT NULL,
  order_item_id   INT UNSIGNED NOT NULL,
  status          ENUM('pending','preparing','ready','served','cancelled') NOT NULL DEFAULT 'pending',
  sent_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ready_at        TIMESTAMP NULL,

  CONSTRAINT fk_kt_order FOREIGN KEY (order_id) REFERENCES `order`(id),
  CONSTRAINT fk_kt_order_item FOREIGN KEY (order_item_id) REFERENCES order_item(id)
);

CREATE TABLE payment (
  id              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  order_id        INT UNSIGNED  NOT NULL UNIQUE,
  method          ENUM('cash','KHQR') NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  khqr_ref        VARCHAR(100)  NULL,
  paid_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES `order`(id)
);


CREATE INDEX idx_order_table_status   ON `order`(table_id, status);
CREATE INDEX idx_order_staff          ON `order`(staff_id);
CREATE INDEX idx_order_closed_at      ON `order`(closed_at);
CREATE INDEX idx_order_item_order     ON order_item(order_id);
CREATE INDEX idx_order_item_kitchen   ON order_item(kitchen_status);
CREATE INDEX idx_kitchen_ticket_status ON kitchen_ticket(status, sent_at);
CREATE INDEX idx_reservation_date     ON reservation(reserved_at, status);
CREATE INDEX idx_menu_item_category   ON menu_item(category_id, available);
CREATE INDEX idx_staff_shift_date     ON staff_shift(work_date, staff_id);
CREATE INDEX idx_payment_method       ON payment(method, paid_at);

INSERT INTO role (name, description) VALUES
  ('manager',  'Full access to all modules'),
  ('cashier',  'Can process payments and apply discounts'),
  ('waiter',   'Can create and manage orders'),
  ('kitchen',  'Can view and update kitchen tickets');

INSERT INTO role_permission (role_id, module, action) VALUES
  (1,'discount','apply'),(1,'report','view'),(1,'menu','edit'),(1,'staff','manage'),
  (2,'discount','apply'),(2,'payment','process'),(2,'report','view'),
  (3,'order','create'),(3,'order','edit'),(3,'kitchen','send'),
  (4,'kitchen','view'),(4,'kitchen','update');

INSERT INTO shift (name, start_time, end_time) VALUES
  ('Morning', '07:00:00', '15:00:00'),
  ('Evening', '15:00:00', '23:00:00');

INSERT INTO menu_category (name, sort_order) VALUES
  ('Drinks', 1), ('Starters', 2), ('Main Course', 3), ('Desserts', 4);

INSERT INTO menu_item (category_id, name, price) VALUES
  (1, 'Iced Coffee',        2.50),
  (1, 'Fresh Orange Juice', 3.00),
  (1, 'Mineral Water',      1.00),
  (2, 'Spring Rolls',       4.50),
  (2, 'Chicken Wings',      6.00),
  (3, 'Fried Rice',         5.50),
  (3, 'Beef Lok Lak',       8.00),
  (3, 'Fish Amok',          9.00),
  (4, 'Mango Sticky Rice',  3.50),
  (4, 'Coconut Ice Cream',  2.50);

INSERT INTO `table` (table_number, capacity) VALUES
  ('T01', 2), ('T02', 4), ('T03', 4), ('T04', 6), ('T05', 8);

INSERT INTO discount (code, type, value, valid_from, valid_until, active) VALUES
  ('WELCOME10', 'percentage', 10.00, '2024-01-01', '2025-12-31', TRUE),
  ('FLAT5',     'fixed',       5.00, '2024-01-01', '2025-12-31', TRUE),
  ('STAFF20',   'percentage', 20.00, '2024-01-01', '2025-12-31', TRUE);

INSERT INTO staff (role_id, name, phone, pin_code) VALUES
  (1, 'Sophea Chan',  '0123456789', '111111'),
  (2, 'Dara Kim',     '0987654321', '222222'),
  (3, 'Mony Pich',    '0912345678', '333333'),
  (3, 'Vanna Sok',    '0956781234', '444444'),
  (4, 'Borey Lim',    '0934567890', '555555');

INSERT INTO customer (name, phone, email) VALUES
  ('John Smith',   '0101010101', 'john@example.com'),
  ('Srey Leak',    '0202020202', 'sreyleak@example.com'),
  ('David Brown',  '0303030303', 'david@example.com');


INSERT INTO `order` (table_id, staff_id, staff_shift_id, status, opened_at)
VALUES (1, 3, 1, 'open', NOW());

INSERT INTO order_item (order_id, menu_item_id, quantity, unit_price, notes)
SELECT 1, mi.id, 2, mi.price, 'no sugar'
FROM menu_item mi WHERE mi.id = 1;

INSERT INTO order_item (order_id, menu_item_id, quantity, unit_price, notes)
SELECT 1, mi.id, 1, mi.price, NULL
FROM menu_item mi WHERE mi.id = 6;


UPDATE order_item
SET kitchen_status = 'preparing'
WHERE order_id = 1 AND kitchen_status = 'pending';

UPDATE kitchen_ticket
SET status = 'ready', ready_at = NOW()
WHERE id = 1;

UPDATE order_item oi
JOIN kitchen_ticket kt ON kt.order_item_id = oi.id
SET oi.kitchen_status = 'served'
WHERE kt.id = 1;

UPDATE `table` SET status = 'occupied' WHERE id = 1;

UPDATE `table` SET status = 'available' WHERE id = 1;

SELECT
  o.id                                          AS order_id,
  SUM(oi.quantity * oi.unit_price)              AS total_amount
FROM `order` o
JOIN order_item oi ON oi.order_id = o.id
WHERE o.id = 1
GROUP BY o.id;

UPDATE `order` o
JOIN discount d ON d.id = 2 AND d.active = TRUE
  AND (d.valid_from IS NULL OR d.valid_from <= NOW())
  AND (d.valid_until IS NULL OR d.valid_until >= NOW())
SET
  o.discount_id  = d.id,
  o.total_amount = (
    SELECT SUM(quantity * unit_price)
    FROM order_item WHERE order_id = o.id
  ),
  o.final_amount = CASE
    WHEN d.type = 'percentage'
      THEN ROUND((
        SELECT SUM(quantity * unit_price)
        FROM order_item WHERE order_id = o.id
      ) * (1 - d.value / 100), 2)
    WHEN d.type = 'fixed'
      THEN GREATEST(ROUND((
        SELECT SUM(quantity * unit_price)
        FROM order_item WHERE order_id = o.id
      ) - d.value, 2), 0)
  END,
  o.status = 'paid'
WHERE o.id = 1;

UPDATE `order` o
SET
  o.total_amount = (
    SELECT SUM(quantity * unit_price)
    FROM order_item WHERE order_id = o.id
  ),
  o.final_amount = (
    SELECT SUM(quantity * unit_price)
    FROM order_item WHERE order_id = o.id
  ),
  o.status = 'paid'
WHERE o.id = 1 AND o.discount_id IS NULL;

INSERT INTO payment (order_id, method, amount, discount_amount, khqr_ref, paid_at)
SELECT
  o.id,
  'cash',
  o.final_amount,
  o.total_amount - o.final_amount,
  NULL,
  NOW()
FROM `order` o WHERE o.id = 1;

INSERT INTO payment (order_id, method, amount, discount_amount, khqr_ref, paid_at)
SELECT
  o.id,
  'KHQR',
  o.final_amount,
  o.total_amount - o.final_amount,
  CONCAT('KHQ', DATE_FORMAT(NOW(), '%Y%m%d'), '-', UPPER(SUBSTRING(MD5(RAND()), 1, 8))),
  NOW()
FROM `order` o WHERE o.id = 1;

-- 6.6 Close order after payment
UPDATE `order`
SET status = 'closed', closed_at = NOW()
WHERE id = 1 AND status = 'paid';


SELECT
  o.id                          AS order_id,
  t.table_number,
  s.name                        AS waiter,
  o.status,
  o.opened_at,
  COUNT(oi.id)                  AS total_items,
  SUM(oi.quantity * oi.unit_price) AS running_total
FROM `order` o
JOIN `table` t       ON t.id = o.table_id
JOIN staff s         ON s.id = o.staff_id
JOIN order_item oi   ON oi.order_id = o.id
WHERE o.status NOT IN ('closed','void')
GROUP BY o.id, t.table_number, s.name, o.status, o.opened_at
ORDER BY o.opened_at ASC;

SELECT
  o.id                              AS order_id,
  t.table_number,
  s.name                            AS waiter,
  mc.name                           AS category,
  mi.name                           AS item_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price)     AS subtotal,
  oi.notes,
  oi.kitchen_status,
  o.total_amount,
  IFNULL(d.code, 'None')           AS discount_code,
  o.final_amount
FROM `order` o
JOIN `table` t         ON t.id = o.table_id
JOIN staff s           ON s.id = o.staff_id
JOIN order_item oi     ON oi.order_id = o.id
JOIN menu_item mi      ON mi.id = oi.menu_item_id
JOIN menu_category mc  ON mc.id = mi.category_id
LEFT JOIN discount d   ON d.id = o.discount_id
WHERE o.id = 1
ORDER BY mc.sort_order, mi.name;

SELECT
  kt.id                             AS ticket_id,
  t.table_number,
  mi.name                           AS item_name,
  oi.quantity,
  oi.notes,
  kt.sent_at,
  TIMESTAMPDIFF(MINUTE, kt.sent_at, NOW()) AS waiting_minutes,
  kt.status
FROM kitchen_ticket kt
JOIN `order` o       ON o.id = kt.order_id
JOIN order_item oi   ON oi.id = kt.order_item_id
JOIN menu_item mi    ON mi.id = oi.menu_item_id
JOIN `table` t       ON t.id = o.table_id
WHERE kt.status IN ('pending','preparing')
ORDER BY kt.sent_at ASC;

SELECT
  t.id,
  t.table_number,
  t.capacity,
  t.status
FROM `table` t
WHERE t.status = 'available'
ORDER BY t.table_number;

SELECT
  t.table_number,
  t.capacity,
  o.id            AS order_id,
  s.name          AS waiter,
  o.opened_at,
  TIMESTAMPDIFF(MINUTE, o.opened_at, NOW()) AS minutes_open,
  COUNT(oi.id)    AS items_ordered
FROM `table` t
JOIN `order` o     ON o.table_id = t.id AND o.status IN ('open','serving')
JOIN staff s       ON s.id = o.staff_id
JOIN order_item oi ON oi.order_id = o.id
GROUP BY t.table_number, t.capacity, o.id, s.name, o.opened_at
ORDER BY t.table_number;

SELECT id, code, type, value, valid_from, valid_until
FROM discount
WHERE code = 'WELCOME10'
  AND active = TRUE
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW());

INSERT INTO reservation (table_id, customer_id, reserved_at, guest_count, status, note)
VALUES (2, 1, '2024-04-20 19:00:00', 3, 'confirmed', 'Window seat preferred');

SELECT
  r.id,
  c.name          AS customer,
  c.phone,
  t.table_number,
  r.reserved_at,
  r.guest_count,
  r.status,
  r.note
FROM reservation r
JOIN customer c ON c.id = r.customer_id
JOIN `table` t  ON t.id = r.table_id
WHERE DATE(r.reserved_at) = CURDATE()
ORDER BY r.reserved_at ASC;

SELECT
  r.id,
  c.name          AS customer,
  c.phone,
  t.table_number,
  r.reserved_at,
  r.guest_count,
  r.status
FROM reservation r
JOIN customer c ON c.id = r.customer_id
JOIN `table` t  ON t.id = r.table_id
WHERE r.reserved_at BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
  AND r.status IN ('pending','confirmed')
ORDER BY r.reserved_at ASC;

UPDATE reservation
SET status = 'cancelled'
WHERE id = 1;

UPDATE reservation r
JOIN `table` t ON t.id = r.table_id
SET r.status = 'seated', t.status = 'occupied'
WHERE r.id = 1;


INSERT INTO staff_shift (staff_id, shift_id, work_date, clock_in, status)
VALUES (3, 1, CURDATE(), NOW(), 'ongoing');

UPDATE staff_shift
SET clock_out = NOW(), status = 'completed'
WHERE staff_id = 3
  AND work_date = CURDATE()
  AND status = 'ongoing';

SELECT
  s.name                    AS staff_name,
  r.name                    AS role,
  sh.name                   AS shift,
  ss.clock_in,
  ss.clock_out,
  ss.status,
  TIMESTAMPDIFF(MINUTE, ss.clock_in, IFNULL(ss.clock_out, NOW())) AS minutes_worked
FROM staff_shift ss
JOIN staff s  ON s.id = ss.staff_id
JOIN role r   ON r.id = s.role_id
JOIN shift sh ON sh.id = ss.shift_id
WHERE ss.work_date = CURDATE()
ORDER BY ss.clock_in ASC;

INSERT INTO shift_summary (
  staff_shift_id, total_orders, total_sales,
  total_discounts, cash_collected, khqr_collected
)
SELECT
  ss.id,
  COUNT(DISTINCT o.id),
  SUM(o.final_amount),
  SUM(o.total_amount - o.final_amount),
  SUM(CASE WHEN p.method = 'cash'  THEN p.amount ELSE 0 END),
  SUM(CASE WHEN p.method = 'KHQR' THEN p.amount ELSE 0 END)
FROM staff_shift ss
JOIN `order` o  ON o.staff_shift_id = ss.id AND o.status = 'closed'
JOIN payment p  ON p.order_id = o.id
WHERE ss.id = 1
GROUP BY ss.id
ON DUPLICATE KEY UPDATE
  total_orders    = VALUES(total_orders),
  total_sales     = VALUES(total_sales),
  total_discounts = VALUES(total_discounts),
  cash_collected  = VALUES(cash_collected),
  khqr_collected  = VALUES(khqr_collected),
  generated_at    = NOW();

SELECT COUNT(*) AS has_permission
FROM role_permission rp
JOIN staff s ON s.role_id = rp.role_id
WHERE s.id = 3
  AND rp.module = 'discount'
  AND rp.action = 'apply';

SELECT s.id, s.name, r.name AS role
FROM staff s
JOIN role r ON r.id = s.role_id
WHERE s.pin_code = '333333'
  AND s.status = 'active';

SELECT
  COUNT(DISTINCT o.id)                                              AS total_orders,
  SUM(o.total_amount)                                               AS gross_sales,
  SUM(o.total_amount - o.final_amount)                              AS total_discounts,
  SUM(o.final_amount)                                               AS net_sales,
  SUM(CASE WHEN p.method = 'cash'  THEN p.amount ELSE 0 END)       AS cash_total,
  SUM(CASE WHEN p.method = 'KHQR' THEN p.amount ELSE 0 END)       AS khqr_total
FROM `order` o
JOIN payment p ON p.order_id = o.id
WHERE o.status = 'closed'
  AND DATE(o.closed_at) = CURDATE();

SELECT
  DATE(o.closed_at)          AS sale_date,
  COUNT(DISTINCT o.id)       AS total_orders,
  SUM(o.final_amount)        AS net_sales,
  AVG(o.final_amount)        AS avg_order_value
FROM `order` o
WHERE o.status = 'closed'
  AND o.closed_at BETWEEN '2024-04-01' AND '2024-04-30'
GROUP BY DATE(o.closed_at)
ORDER BY sale_date ASC;

SELECT
  mi.name,
  mc.name                              AS category,
  SUM(oi.quantity)                     AS total_sold,
  SUM(oi.quantity * oi.unit_price)     AS revenue
FROM order_item oi
JOIN menu_item mi      ON mi.id = oi.menu_item_id
JOIN menu_category mc  ON mc.id = mi.category_id
JOIN `order` o         ON o.id = oi.order_id
WHERE o.status = 'closed'
  AND MONTH(o.closed_at) = MONTH(CURDATE())
  AND YEAR(o.closed_at)  = YEAR(CURDATE())
GROUP BY mi.id, mi.name, mc.name
ORDER BY total_sold DESC
LIMIT 10;

SELECT
  mc.name                             AS category,
  SUM(oi.quantity)                    AS items_sold,
  SUM(oi.quantity * oi.unit_price)    AS revenue,
  ROUND(
    SUM(oi.quantity * oi.unit_price) /
    (SELECT SUM(final_amount) FROM `order` WHERE status='closed'
     AND MONTH(closed_at)=MONTH(CURDATE())) * 100, 1
  )                                   AS revenue_pct
FROM order_item oi
JOIN menu_item mi     ON mi.id = oi.menu_item_id
JOIN menu_category mc ON mc.id = mi.category_id
JOIN `order` o        ON o.id = oi.order_id
WHERE o.status = 'closed'
  AND MONTH(o.closed_at) = MONTH(CURDATE())
GROUP BY mc.id, mc.name
ORDER BY revenue DESC;

SELECT
  s.name                       AS staff,
  COUNT(o.id)                  AS total_orders,
  SUM(o.final_amount)          AS total_revenue,
  AVG(o.final_amount)          AS avg_order_value,
  AVG(TIMESTAMPDIFF(MINUTE, o.opened_at, o.closed_at)) AS avg_order_minutes
FROM staff s
JOIN `order` o ON o.staff_id = s.id
WHERE o.status = 'closed'
  AND DATE(o.closed_at) = CURDATE()
GROUP BY s.id, s.name
ORDER BY total_revenue DESC;

SELECT
  mi.name,
  COUNT(kt.id)                                                      AS total_cooked,
  ROUND(AVG(TIMESTAMPDIFF(MINUTE, kt.sent_at, kt.ready_at)), 1)    AS avg_prep_minutes,
  ROUND(MIN(TIMESTAMPDIFF(MINUTE, kt.sent_at, kt.ready_at)), 1)    AS min_prep_minutes,
  ROUND(MAX(TIMESTAMPDIFF(MINUTE, kt.sent_at, kt.ready_at)), 1)    AS max_prep_minutes
FROM kitchen_ticket kt
JOIN order_item oi ON oi.id = kt.order_item_id
JOIN menu_item mi  ON mi.id = oi.menu_item_id
WHERE kt.status = 'ready'
  AND kt.ready_at IS NOT NULL
GROUP BY mi.id, mi.name
ORDER BY avg_prep_minutes DESC;

SELECT
  d.code,
  d.type,
  d.value,
  COUNT(o.id)                  AS times_used,
  SUM(p.discount_amount)       AS total_saved,
  SUM(o.final_amount)          AS total_revenue_after_discount
FROM discount d
JOIN `order` o  ON o.discount_id = d.id
JOIN payment p  ON p.order_id = o.id
WHERE o.status = 'closed'
GROUP BY d.id, d.code, d.type, d.value
ORDER BY times_used DESC;

SELECT
  HOUR(o.opened_at)            AS hour_of_day,
  COUNT(o.id)                  AS total_orders,
  SUM(o.final_amount)          AS revenue
FROM `order` o
WHERE o.status = 'closed'
  AND MONTH(o.closed_at) = MONTH(CURDATE())
GROUP BY HOUR(o.opened_at)
ORDER BY hour_of_day ASC;

SELECT
  t.table_number,
  t.capacity,
  COUNT(o.id)                  AS total_orders_today,
  SUM(o.final_amount)          AS total_revenue
FROM `table` t
LEFT JOIN `order` o ON o.table_id = t.id
  AND DATE(o.opened_at) = CURDATE()
  AND o.status = 'closed'
GROUP BY t.id, t.table_number, t.capacity
ORDER BY total_orders_today DESC;

SELECT
  ss.work_date,
  s.name                       AS staff,
  sh.name                      AS shift,
  ss.clock_in,
  ss.clock_out,
  TIMESTAMPDIFF(MINUTE, ss.clock_in, ss.clock_out) AS minutes_worked,
  sm.total_orders,
  sm.total_sales,
  sm.total_discounts,
  sm.cash_collected,
  sm.khqr_collected
FROM staff_shift ss
JOIN staff s         ON s.id = ss.staff_id
JOIN shift sh        ON sh.id = ss.shift_id
LEFT JOIN shift_summary sm ON sm.staff_shift_id = ss.id
WHERE ss.work_date = CURDATE()
ORDER BY ss.clock_in ASC;

SELECT
  c.name,
  c.phone,
  COUNT(DISTINCT o.id)         AS total_visits,
  SUM(o.final_amount)          AS total_spent,
  AVG(o.final_amount)          AS avg_spend_per_visit,
  MAX(o.closed_at)             AS last_visit
FROM customer c
JOIN reservation r ON r.customer_id = c.id
JOIN `order` o     ON o.table_id = r.table_id
  AND DATE(o.opened_at) = DATE(r.reserved_at)
  AND o.status = 'closed'
GROUP BY c.id, c.name, c.phone
ORDER BY total_spent DESC
LIMIT 10;

UPDATE menu_item
SET deleted_at = NOW(), available = FALSE
WHERE id = 3;

UPDATE `order`
SET status = 'void', closed_at = NOW()
WHERE id = 1 AND status IN ('open','serving');

UPDATE `table` t
JOIN `order` o ON o.table_id = t.id
SET t.status = 'available'
WHERE o.id = 1;

SELECT
  o.id            AS order_id,
  t.table_number,
  s.name          AS waiter,
  o.opened_at,
  TIMESTAMPDIFF(MINUTE, o.opened_at, NOW()) AS minutes_open
FROM `order` o
JOIN `table` t ON t.id = o.table_id
JOIN staff s   ON s.id = o.staff_id
WHERE o.status IN ('open','serving')
  AND o.opened_at < DATE_SUB(NOW(), INTERVAL 2 HOUR)
ORDER BY minutes_open DESC;

SELECT order_item_id, COUNT(*) AS ticket_count
FROM kitchen_ticket
WHERE status != 'cancelled'
GROUP BY order_item_id
HAVING COUNT(*) > 1;

UPDATE menu_item
SET deleted_at = NULL, available = TRUE
WHERE id = 3;
