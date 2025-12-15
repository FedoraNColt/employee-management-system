package com.fedorancolt.ems.dtos;

import com.fedorancolt.ems.entities.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LoginResponse {

    private Employee employee;

    private String token;

    private String refresh;

}
