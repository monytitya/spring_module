package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.TableRequest;
import Springboot_April.spring_april.dto.TableResponse;
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
@Transactional(readOnly = true)
public class TableService {

    private final TableRepository tableRepository;
    private final TableMapper tableMapper;

    public List<TableResponse> getAvailableTables() {
        return tableRepository.findByStatusOrderByTableNumberAsc(TableStatus.available).stream()
                .map(tableMapper::toResponse)
                .toList();
    }

    public List<TableResponse> getAllTables() {
        return tableRepository.findAll().stream()
                .map(tableMapper::toResponse)
                .toList();
    }

    public TableResponse getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        return tableMapper.toResponse(table);
    }

    @Transactional
    public TableResponse createTable(TableRequest request) {
        RestaurantTable table = tableMapper.toEntity(request);
        return tableMapper.toResponse(tableRepository.save(table));
    }

    @Transactional
    public TableResponse updateTable(Long id, TableRequest request) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setTableNumber(request.tableNumber());
        table.setCapacity(request.capacity());
        table.setStatus(request.status());
        return tableMapper.toResponse(tableRepository.save(table));
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
