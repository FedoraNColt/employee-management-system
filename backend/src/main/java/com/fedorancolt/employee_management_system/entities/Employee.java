package com.fedorancolt.employee_management_system.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    private String firstName;
    private String lastName;
    private String email;

    @JsonIgnore
    private String password;

}
