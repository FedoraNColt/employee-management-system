package com.fedorancolt.employee_management_system;

import com.fedorancolt.employee_management_system.services.EmployeeService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EmployeeManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeManagementSystemApplication.class, args);
	}

    @Bean
    CommandLineRunner runner(EmployeeService employeeService) {
        return (args) -> {
            employeeService.loadEmployees();
        };
    }
}
