package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.EmployeeType;
import lombok.Builder;

@Builder
public record UpdateEmployeeRequest(String email, EmployeeType employeeType, String firstName, String lastName, String reportsTo) {
}
