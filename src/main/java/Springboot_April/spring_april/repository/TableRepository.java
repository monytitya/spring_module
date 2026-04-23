package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.enums.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByStatusOrderByTableNumberAsc(TableStatus status);
    java.util.Optional<RestaurantTable> findByTableNumber(String tableNumber);
}
