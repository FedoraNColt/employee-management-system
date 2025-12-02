package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.EmployeeType;
import com.fedorancolt.ems.entities.PayType;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record RegisterRequest(
        EmployeeType employeeType,
        String firstName,
        String lastName,
        String phoneNumber,
        PayType payType,
        BigDecimal payAmount,
        String reportsTo
        ) {
}
