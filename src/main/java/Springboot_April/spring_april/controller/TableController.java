package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.dto.TableRequest;
import Springboot_April.spring_april.dto.TableResponse;
import Springboot_April.spring_april.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TableController {

    private final TableService tableService;
    private final Springboot_April.spring_april.service.FileUploadService fileUploadService;

    @GetMapping
    public ResponseEntity<List<TableResponse>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/available")
    public ResponseEntity<List<TableResponse>> getAvailableTables() {
        return ResponseEntity.ok(tableService.getAvailableTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableResponse> getTable(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }

    @PostMapping
    public ResponseEntity<TableResponse> createTable(@RequestBody TableRequest request) {
        return ResponseEntity.ok(tableService.createTable(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableResponse> updateTable(@PathVariable Long id, @RequestBody TableRequest request) {
        return ResponseEntity.ok(tableService.updateTable(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{id}/image")
    public ResponseEntity<TableResponse> uploadTableImage(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String imagePath = fileUploadService.storeFile(file);
        return ResponseEntity.ok(tableService.updateTableImage(id, imagePath));
    }
}
