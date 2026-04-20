package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.RestaurantOrder;
import Springboot_April.spring_april.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<RestaurantOrder, Long> {
    List<RestaurantOrder> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);
    List<RestaurantOrder> findByTableIdAndStatusIn(Long tableId, List<OrderStatus> statuses);
}
