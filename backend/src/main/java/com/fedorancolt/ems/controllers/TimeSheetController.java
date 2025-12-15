package com.fedorancolt.ems.controllers;

import com.fedorancolt.ems.dtos.GenerateDatedTimeSheetRequest;
import com.fedorancolt.ems.dtos.GenerateTimeSheetDataRequest;
import com.fedorancolt.ems.dtos.ReviewTimeSheetRequest;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.TimeSheet;
import com.fedorancolt.ems.entities.TimeSheetStatus;
import com.fedorancolt.ems.exceptions.TimeSheetDoesNotExistException;
import com.fedorancolt.ems.services.EmployeeService;
import com.fedorancolt.ems.services.TimeSheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/timesheet")
@RequiredArgsConstructor
public class TimeSheetController {

    private final TimeSheetService timeSheetService;
    private final EmployeeService employeeService;

    @PostMapping("/")
    public TimeSheet generateOrFetchTimeSheetForEmployee(@AuthenticationPrincipal Jwt jwt) {
        // Use the authenticated user's email from the JWT subject to avoid stale or spoofed employee payloads.
        Employee employee = employeeService.readEmployeeByEmail(jwt.getSubject());
        return timeSheetService.createOrReadTimeSheetForEmployee(employee);
    }

    @PostMapping("/manager")
    public List<TimeSheet> getTimeSheetsToReviewForManager(@RequestBody List<Employee> employees) {
        // Resolve each employee from the DB to ensure valid IDs for FK relations.
        List<Employee> managedEmployees = employees.stream()
                .map(emp -> employeeService.readEmployeeByEmail(emp.getEmail()))
                .toList();
        return timeSheetService.readManagersTimeSheetsForApproval(managedEmployees);
    }

    @PostMapping("/dates")
    public TimeSheet generateTimeSheetWithDates(@RequestBody GenerateDatedTimeSheetRequest request) {
        Employee employee = employeeService.readEmployeeByEmail(request.employee().getEmail());
        return timeSheetService.createTimeSheetWithDatesForEmployee(employee, request.startDate(), request.endDate());
    }

    @PutMapping("/hours")
    public TimeSheet updateTimeSheetHours(@RequestBody TimeSheet timeSheet) {
        return timeSheetService.updateTimeSheetHours(timeSheet);
    }

    @PutMapping("/submit/{timeSheetId}")
    public TimeSheet submitTimeSheet(@PathVariable("timeSheetId") UUID timeSheetId) {
        return timeSheetService.updateTimeSheetStatus(timeSheetId, TimeSheetStatus.SUBMITTED);
    }

    @PutMapping("/review")
    public TimeSheet reviewTimeSheet(@RequestBody ReviewTimeSheetRequest request) {
        return timeSheetService.approveOrDenyTimeSheet(request.timeSheetId(), request.status(), request.approver(), request.message());
    }

    @PostMapping("/data")
    public List<TimeSheet> generateTimeSheetData(@RequestBody GenerateTimeSheetDataRequest request) {
        // Resolve employees from the DB using emails to avoid FK violations and reduce payload size.
        Employee employee = employeeService.readEmployeeByEmail(request.employeeEmail());
        Employee manager = employeeService.readEmployeeByEmail(request.managerEmail());
        return timeSheetService.generateTimeSheetsForPayRollTests(employee, manager);
    }

    @ExceptionHandler({TimeSheetDoesNotExistException.class})
    public ResponseEntity<String> handleTimeSheetDoesNotExistException() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("TimeSheet does not exist");
    }

}
