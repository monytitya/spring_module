package Springboot_April.spring_april.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Springboot_April.spring_april.enums.OrderStatus;
import Springboot_April.spring_april.model.RestaurantOrder;

@Repository
public interface OrderRepository extends JpaRepository<RestaurantOrder, Long> {
    List<RestaurantOrder> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    List<RestaurantOrder> findByTableIdAndStatusIn(Long tableId, List<OrderStatus> statuses);
    List<RestaurantOrder> findByTable(Springboot_April.spring_april.model.RestaurantTable table);
}
