package com.fedorancolt.ems.dtos;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PayrollPreviewDTO {

    private String employee;
    private LocalDate paymentDate;
    private BigDecimal grossPay;

}
