package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import lombok.Builder;

@Builder
public record GenerateTimeSheetDataRequest(Employee employee, Employee manager) {
}
