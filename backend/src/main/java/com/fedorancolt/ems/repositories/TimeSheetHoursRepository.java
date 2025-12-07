package com.fedorancolt.ems.repositories;

import com.fedorancolt.ems.entities.TimeSheet;
import com.fedorancolt.ems.entities.TimeSheetHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimeSheetHoursRepository extends JpaRepository<TimeSheetHours, UUID> {
}
