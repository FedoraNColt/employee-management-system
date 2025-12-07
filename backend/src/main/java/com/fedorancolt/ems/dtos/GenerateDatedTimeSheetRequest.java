package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record GenerateDatedTimeSheetRequest(Employee employee, LocalDate startDate, LocalDate endDate) {
}
