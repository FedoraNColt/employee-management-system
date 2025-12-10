package com.fedorancolt.ems.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "paysubs")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PayStub extends BaseEntity implements Comparable<PayStub> {

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "date_paid")
    private LocalDate payDate;

    @Column(name ="gross_hours")
    private Double grossHours;

    @Column(name = "gross_pay")
    private BigDecimal grossPay;

    @Column(name ="regular_hours")
    private Double regularHours;

    @Column(name = "regular_pay")
    private BigDecimal regularPay;

    @Column(name ="overtime_hours")
    private Double overtimeHours;

    @Column(name = "overtime_pay")
    private BigDecimal overtimePay;

    @Override
    public int compareTo(PayStub payStub) {
        return this.getPayDate().compareTo(payStub.getPayDate());
    }
}
