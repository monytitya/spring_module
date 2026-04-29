package Springboot_April.spring_april;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import Springboot_April.spring_april.service.SettingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringAprilApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringAprilApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(SettingService settingService) {
		return args -> {
			settingService.initializeDefaultSettings();
		};
	}
}
