package com.fedorancolt.ems.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends BaseEntity {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true)
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "employee_contact", referencedColumnName = "id", nullable = true)
    private ContactInformation contactInformation;

    @Column(name = "employee_type")
    @Enumerated(EnumType.STRING)
    private EmployeeType employeeType;

    @Column(name = "password")
    @JsonIgnore
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pay_information", referencedColumnName = "id")
    private PayInformation payInformation;

    @OneToMany(mappedBy = "reportsTo")
    private List<Employee> reports;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties("reports")
    @JoinColumn(name = "reports_to")
    private Employee reportsTo;

    @Column(name = "first_time_login")
    private boolean firstTimeLogin;

}
