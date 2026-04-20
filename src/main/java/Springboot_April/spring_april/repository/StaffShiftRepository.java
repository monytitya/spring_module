package Springboot_April.spring_april.repository;

import Springboot_April.spring_april.model.StaffShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface StaffShiftRepository extends JpaRepository<StaffShift, Long> {
    Optional<StaffShift> findByStaffIdAndWorkDateAndStatus(Long staffId, LocalDate workDate, Springboot_April.spring_april.enums.ShiftStatus status);
}
