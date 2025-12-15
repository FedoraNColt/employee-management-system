package com.fedorancolt.ems.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshToken extends BaseEntity {

    private String token;

    @Column(name = "expiration")
    private Instant expiryDate;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

}
