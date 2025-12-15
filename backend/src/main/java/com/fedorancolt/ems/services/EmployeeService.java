package com.fedorancolt.ems.services;

import com.fedorancolt.ems.dtos.UpdateEmployeeRequest;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.EmployeeType;
import com.fedorancolt.ems.exceptions.EmployeeDoesNotExist;
import com.fedorancolt.ems.exceptions.UnableToRegisterEmployee;
import com.fedorancolt.ems.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.fedorancolt.ems.utils.CredentialsUtils.generateEmailAddress;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    public Employee createOrUpdateEmployee(Employee employee) {
        try {
            return employeeRepository.save(employee);
        } catch (Exception e) {
            throw new UnableToRegisterEmployee("Unable to create or update employee at the time", e);
        }
    }

    public List<Employee> readAllEmployees() {
       return employeeRepository.findAll();
    }

    public Employee readEmployeeByEmail(String email) {
       return getEmployeeByEmailOrThrowException(email);
    }

    public List<Employee> readAllReportsByEmail(String managerEmail) {
        Employee manager = getEmployeeByEmailOrThrowException(managerEmail);
        return employeeRepository.findByReportsTo(manager);
    }

    public Employee updateEmployee(UpdateEmployeeRequest request) {
        Employee employee = getEmployeeByEmailOrThrowException(request.email());

        if (request.firstName() != null) {
            employee.setFirstName(request.firstName());
        }
        if (request.lastName() != null) {
            employee.setLastName(request.lastName());
        }
        if (request.employeeType() != null && !request.employeeType().equals(employee.getEmployeeType())) {
            employee.setEmployeeType(request.employeeType());
        }

        if (request.reportsTo() != null) {
            Employee mangerOld = employee.getReportsTo();
            Employee mangerNew = getEmployeeByEmailOrThrowException(request.reportsTo());

            employee.setReportsTo(mangerNew);
            if (mangerOld != null && (mangerOld.getId() == null || !mangerOld.getId().equals(mangerNew.getId()))) {
                updateEmployeeReports(mangerOld, employee, "remove");
            }
            updateEmployeeReports(mangerNew, employee, "add");
        }

        if (employee.getEmployeeType().equals(EmployeeType.ADMIN) || employee.getEmployeeType().equals(EmployeeType.MANAGER)) {
            if (employee.getReportsTo() != null) {
                updateEmployeeReports(employee.getReportsTo(), employee, "remove");
                employee.setReportsTo(null);
            }
        }

        employee.setEmail(generateEmailAddress(employee.getFirstName(), employee.getLastName()));
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(String email) {
        Employee employee = getEmployeeByEmailOrThrowException(email);
        employeeRepository.delete(employee);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            Employee employee = readEmployeeByEmail(username);

            return User.builder()
                    .username(employee.getEmail())
                    .password(employee.getPassword())
                    .authorities(employee.getEmployeeType().toString())
                    .build();
        } catch (EmployeeDoesNotExist e) {
            throw new UsernameNotFoundException("Employee does not exist");
        }
    }

    private Employee getEmployeeByEmailOrThrowException(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(EmployeeDoesNotExist::new);
    }

    protected void updateEmployeeReports(Employee manager, Employee report, String operation) {
        if (manager == null) {
            return;
        }

        List<Employee> reports = manager.getReports() == null ? new ArrayList<>() : new ArrayList<>(manager.getReports());

        if ("add".equals(operation)) {
            boolean alreadyPresent = reports.stream()
                    .anyMatch(existing -> existing.getId() != null && existing.getId().equals(report.getId()));
            if (!alreadyPresent) {
                reports.add(report);
            }
        } else if ("remove".equals(operation)) {
            reports.removeIf(existing -> existing.getId() != null && existing.getId().equals(report.getId()));
        }
        manager.setReports(reports);
        employeeRepository.save(manager);
    }
}
