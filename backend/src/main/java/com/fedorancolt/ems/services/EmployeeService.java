package com.fedorancolt.ems.services;

import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.exceptions.EmployeeDoesNotExist;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeService implements UserDetailsService {

    private Map<String, Employee> employees;
    private final PasswordEncoder passwordEncoder;

    public Employee createEmployee(String firstName, String lastName, String password) {
        String email = firstName + lastName + "@company.com";

        Employee employee = Employee.builder()
                .firstName(firstName)
                .lastName(lastName)
                .password(password)
                .email(email)
                .build();
        employees.put(email, employee);
        return employee;
    }

    public List<Employee> readAllEmployees() {
       return employees.values().stream().toList();
    }

    public Employee readEmployeeByEmail(String email) {
        if (!employees.containsKey(email)) throw new EmployeeDoesNotExist();
        return employees.get(email);
    }

    public Employee updateEmployee(String email, Employee updatedEmployee) {
        if (!employees.containsKey(email)) throw new EmployeeDoesNotExist();
        Employee persistedEmployee;

        if (email.equals(updatedEmployee.getEmail())) {
            persistedEmployee = employees.replace(email, updatedEmployee);
        } else {
            employees.remove(email);
            employees.put(updatedEmployee.getEmail(), updatedEmployee);
            persistedEmployee = employees.get(updatedEmployee.getEmail());
        }

        return persistedEmployee;
    }

    public void deleteEmployee(String email) {
        Employee deletedEmployee = employees.remove(email);
        if (deletedEmployee == null) throw new EmployeeDoesNotExist();
    }

    public void loadEmployees() {
        employees = new HashMap<>();

        employees.put("adminemployee@company.com", Employee.builder()
                .firstName("admin")
                .lastName("employee")
                .email("adminemployee@company.com")
                .password("pass")
                .build());

        employees.put("manageremployee@company.com", Employee.builder()
                .firstName("manager")
                .lastName("employee")
                .email("manageremployee@company.com")
                .password("pass")
                .build());

        employees.put("employeeone@company.com", Employee.builder()
                .firstName("employee")
                .lastName("one")
                .email("employeeone@company.com")
                .password("pass")
                .build());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            Employee employee = readEmployeeByEmail(username);

            return User.builder()
                    .username(employee.getEmail())
                    .password(passwordEncoder.encode(employee.getPassword()))
                    .roles("EMPLOYEE")
                    .build();
        } catch (EmployeeDoesNotExist e) {
            throw new UsernameNotFoundException("Employee does not exist");
        }
    }
}
