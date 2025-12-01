package com.fedorancolt.employee_management_system.dtos;

import lombok.Builder;

@Builder
public record CreateEmployeeRequest(String firstName, String lastName, String password) {
}
