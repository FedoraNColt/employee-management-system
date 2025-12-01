package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import lombok.Builder;

@Builder
public record UpdateEmployeeRequest(String email, Employee employee) {
}
