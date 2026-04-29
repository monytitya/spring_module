package Springboot_April.spring_april.controller;

import Springboot_April.spring_april.model.Setting;
import Springboot_April.spring_april.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SettingController {
    private final SettingService settingService;

    @GetMapping
    public List<Setting> getAllSettings() {
        return settingService.getAllSettings();
    }

    @GetMapping("/group/{group}")
    public List<Setting> getSettingsByGroup(@PathVariable String group) {
        return settingService.getSettingsByGroup(group);
    }

    @GetMapping("/{key}")
    public ResponseEntity<Setting> getSettingByKey(@PathVariable String key) {
        Setting setting = settingService.getSettingByKey(key);
        return setting != null ? ResponseEntity.ok(setting) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Setting> updateSetting(@PathVariable Long id, @RequestBody Setting settingDetails) {
        return ResponseEntity.ok(settingService.updateSetting(id, settingDetails));
    }

    @PostMapping("/init")
    public ResponseEntity<String> initSettings() {
        settingService.initializeDefaultSettings();
        return ResponseEntity.ok("Settings initialized");
    }
}
