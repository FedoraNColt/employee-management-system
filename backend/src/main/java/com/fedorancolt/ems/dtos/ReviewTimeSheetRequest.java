package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.TimeSheetStatus;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ReviewTimeSheetRequest(Employee approver, UUID timeSheetId, TimeSheetStatus status, String message) {
}
