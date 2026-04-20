package Springboot_April.spring_april.service;

import Springboot_April.spring_april.mapper.TableMapper;
import Springboot_April.spring_april.model.RestaurantTable;
import Springboot_April.spring_april.enums.TableStatus;
import Springboot_April.spring_april.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;
    private final TableMapper tableMapper;

    public List<RestaurantTable> getAvailableTables() {
        return tableRepository.findByStatusOrderByTableNumberAsc(TableStatus.available);
    }

    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    @Transactional
    public RestaurantTable createTable(RestaurantTable table) {
        return tableRepository.save(table);
    }

    @Transactional
    public RestaurantTable updateTable(Long id, RestaurantTable details) {
        RestaurantTable table = getTableById(id);
        table.setTableNumber(details.getTableNumber());
        table.setCapacity(details.getCapacity());
        table.setStatus(details.getStatus());
        return tableRepository.save(table);
    }

    @Transactional
    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new RuntimeException("Table not found");
        }
        tableRepository.deleteById(id);
    }

    @Transactional
    public void updateTableStatus(Long tableId, TableStatus status) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setStatus(status);
        tableRepository.save(table);
    }
}
