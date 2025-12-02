package com.fedorancolt.ems.controllers;

import com.fedorancolt.ems.dtos.CreateEmployeeRequest;
import com.fedorancolt.ems.dtos.UpdateEmployeeRequest;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.PayInformation;
import com.fedorancolt.ems.exceptions.EmployeeDoesNotExist;
import com.fedorancolt.ems.services.EmployeeService;
import com.fedorancolt.ems.services.PayInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = "http://localhost.com/5713")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final PayInformationService payInformationService;


    @GetMapping("/")
    public List<Employee> getAllEmployees() {
        return employeeService.readAllEmployees();
    }

    @GetMapping("/email/{email}")
    public Employee getEmployee(@PathVariable("email") String email) {
        return employeeService.readEmployeeByEmail(email);
    }

    @PutMapping("/")
    public Employee putUpdatedEmployee(@RequestBody UpdateEmployeeRequest request) {
        return employeeService.updateEmployee(request);
    }

    @PutMapping("/pay/{email}")
    public Employee updateEmployeePayInformation(@PathVariable("email") String email, @RequestBody PayInformation body) {
        Employee employee = employeeService.readEmployeeByEmail(email);
        body.setId(employee.getPayInformation().getId());

        PayInformation payInformation = payInformationService.createPayInformation(body);
        employee.setPayInformation(payInformation);
        return employeeService.createOrUpdateEmployee(employee);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity deleteEmployee(@PathVariable("email") String email) {
        employeeService.deleteEmployee(email);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EmployeeDoesNotExist.class)
    public ResponseEntity<String> handleEmployeeDoesNotExist(EmployeeDoesNotExist e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unable to handle request at this time");

    }
}
