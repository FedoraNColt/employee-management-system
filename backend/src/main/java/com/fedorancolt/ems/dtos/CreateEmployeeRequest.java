package com.fedorancolt.ems.dtos;

import lombok.Builder;

@Builder
public record CreateEmployeeRequest(String firstName, String lastName, String password) {
}
