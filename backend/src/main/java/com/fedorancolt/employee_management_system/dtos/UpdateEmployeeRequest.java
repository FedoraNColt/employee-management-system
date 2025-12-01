package com.fedorancolt.employee_management_system.dtos;

import com.fedorancolt.employee_management_system.entities.Employee;
import lombok.Builder;

@Builder
public record UpdateEmployeeRequest(String email, Employee employee) {
}
