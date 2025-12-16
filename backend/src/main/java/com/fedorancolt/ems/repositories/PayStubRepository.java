package com.fedorancolt.ems.repositories;

import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.PayStub;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PayStubRepository extends JpaRepository<PayStub, UUID> {


    List<PayStub> findAllByEmployeeId(UUID employeeId);

    List<PayStub> findAllByEmployeeIdAndCreatedTimeStampBetween(UUID employeeId,
                                                                Instant createTimeStampStart,
                                                                Instant createTimeStampEnd);

    boolean existsByEmployeeAndPayDate(Employee employee, LocalDate payDate);
}
