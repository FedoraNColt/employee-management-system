package com.fedorancolt.ems.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contact_information")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ContactInformation extends BaseEntity {

    @Column(name = "phone_number", unique = true, length = 10)
    private String phoneNumber;

    @Column(name = "address_line_one", nullable = true)
    private String addressLineOne;

    @Column(name = "address_line_two", nullable = true)
    private String addressLineTwo;

    @Column(name = "state", length = 2, nullable = true)
    private String state;

    @Column(name = "city", nullable = true)
    private String city;

    @Column(name = "zip_code", length = 5, nullable = true)
    private String zipCode;

}
