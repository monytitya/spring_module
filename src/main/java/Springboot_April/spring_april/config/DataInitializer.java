package Springboot_April.spring_april.config;

import Springboot_April.spring_april.model.Role;
import Springboot_April.spring_april.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role admin = Role.builder().name("ADMIN").description("Administrator with full access").build();
            Role manager = Role.builder().name("MANAGER").description("Restaurant manager").build();
            Role staff = Role.builder().name("STAFF").description("Regular floor staff").build();
            
            roleRepository.saveAll(Arrays.asList(admin, manager, staff));
            System.out.println("Default roles seeded successfully: ADMIN (1), MANAGER (2), STAFF (3)");
        }
    }
}
