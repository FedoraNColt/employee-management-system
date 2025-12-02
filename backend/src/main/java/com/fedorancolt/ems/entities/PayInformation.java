package com.fedorancolt.ems.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "pay_information")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PayInformation extends BaseEntity{

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_type")
    private PayType payType;

    @Column(name = "pay_amount")
    private BigDecimal payAmount;

}
