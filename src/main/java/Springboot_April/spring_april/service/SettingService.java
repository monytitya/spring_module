package Springboot_April.spring_april.service;

import Springboot_April.spring_april.model.Setting;
import Springboot_April.spring_april.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SettingService {
    private final SettingRepository settingRepository;

    public List<Setting> getAllSettings() {
        return settingRepository.findAll();
    }

    public List<Setting> getSettingsByGroup(String group) {
        return settingRepository.findByGroup(group);
    }

    public Setting getSettingByKey(String key) {
        return settingRepository.findByKey(key).orElse(null);
    }

    @Transactional
    public Setting updateSetting(Long id, Setting settingDetails) {
        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found with id: " + id));
        
        setting.setValue(settingDetails.getValue());
        setting.setDescription(settingDetails.getDescription());
        return settingRepository.save(setting);
    }

    @Transactional
    public Setting saveSetting(Setting setting) {
        return settingRepository.save(setting);
    }

    public void initializeDefaultSettings() {
        if (settingRepository.count() == 0) {
            saveSetting(new Setting(null, "allow_registration", "true", "Allow new users to register", "auth"));
            saveSetting(new Setting(null, "default_role", "Staff", "Default role for new registrations", "auth"));
            saveSetting(new Setting(null, "require_email_verification", "false", "Require email verification for new users", "auth"));
            saveSetting(new Setting(null, "session_timeout", "3600", "Session timeout in seconds", "auth"));
            saveSetting(new Setting(null, "site_name", "Lezato Restaurant", "Name of the restaurant", "general"));
            saveSetting(new Setting(null, "payment_gateway_token", "", "Token for KHQR payment gateway", "payment"));
            saveSetting(new Setting(null, "bakong_merchant_id", "M001", "Bakong Merchant ID", "payment"));
            saveSetting(new Setting(null, "bakong_merchant_name", "Lezato Restaurant", "Bakong Merchant Name", "payment"));
            saveSetting(new Setting(null, "bakong_account_id", "merchant@dev", "Bakong Account ID (Email or Phone)", "payment"));
        }
    }
}
