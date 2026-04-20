package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByPinCodeAndStatus(String pinCode, Springboot_April.spring_april.enums.StaffStatus status);
}
