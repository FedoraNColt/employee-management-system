package com.fedorancolt.ems.repositories;

import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.TimeSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimeSheetRepository extends JpaRepository<TimeSheet, UUID> {

    Optional<TimeSheet> findByStartDateAndEmployee(LocalDate startDate, Employee employee);

}
