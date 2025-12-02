package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import lombok.Builder;

@Builder
public record RegisterResponse(Employee employee, String temporaryPassword) {
}
