package com.fedorancolt.ems;

import com.fedorancolt.ems.services.EmployeeService;
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
