package Springboot_April.spring_april.mapper;

import Springboot_April.spring_april.dto.TableRequest;
import Springboot_April.spring_april.dto.TableResponse;
import Springboot_April.spring_april.model.RestaurantTable;
import org.springframework.stereotype.Component;

@Component
public class TableMapper {

    public RestaurantTable toEntity(TableRequest request) {
        if (request == null) return null;
        
        return RestaurantTable.builder()
                .tableNumber(request.tableNumber())
                .capacity(request.capacity())
                .status(request.status())
                .build();
    }

    public TableResponse toResponse(RestaurantTable entity) {
        if (entity == null) return null;
        return TableResponse.builder()
                .id(entity.getId())
                .tableNumber(entity.getTableNumber())
                .capacity(entity.getCapacity())
                .status(entity.getStatus())
                .build();
    }
}
