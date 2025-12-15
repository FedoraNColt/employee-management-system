package com.fedorancolt.ems.dtos;

import lombok.Builder;

@Builder
public record GenerateTimeSheetDataRequest(String employeeEmail, String managerEmail) {
}
