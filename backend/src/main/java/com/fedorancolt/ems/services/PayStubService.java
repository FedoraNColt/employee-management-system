package com.fedorancolt.ems.services;

import com.fedorancolt.ems.dtos.PayrollPreviewDTO;
import com.fedorancolt.ems.entities.*;
import com.fedorancolt.ems.repositories.PayStubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PayStubService {
    
    private final PayStubRepository payStubRepository;
    private final TimeSheetService timeSheetService;
    private final EmployeeService employeeService;

    public List<PayStub> readPayStubsForEmployee(String email) {
        Employee employee = employeeService.readEmployeeByEmail(email);
        List<PayStub> payStubs = payStubRepository.findAllByEmployeeId(employee.getId());
        Collections.sort(payStubs);
        return payStubs;
    }

    public List<PayStub> readPayStubsForEmployeeOfYear(String email, String year) {
        Employee employee = employeeService.readEmployeeByEmail(email);
        List<PayStub> payStubs = payStubRepository.findAllByEmployeeId(employee.getId())
                .stream()
                .filter((stub) -> {
                    LocalDate date = LocalDate.ofInstant(stub.getCreatedTimeStamp(), ZoneId.systemDefault());
                    return date.getYear() == Integer.parseInt(year);
                })
                .collect(Collectors.toList());
        Collections.sort(payStubs);
        return payStubs;
    }

    public List<PayrollPreviewDTO> previewPayroll() {
        List<PayrollPreviewDTO> payrollPreviewDTOs = new ArrayList<>();
        List<Employee> employees = employeeService.readAllEmployees();
        LocalDate payRollDate = LocalDate.now();
        
        List<PayrollPreviewDTO> salaryPayrollPreview = employees.stream()
                .filter(employee -> employee.getPayInformation().getPayType().equals(PayType.SALARY))
                .map(employee -> {
                    BigDecimal pay = employee.getPayInformation().getPayAmount()
                            .divide(BigDecimal.valueOf(52.0), 2, RoundingMode.HALF_UP)
                            .setScale(2, RoundingMode.HALF_UP);
                    return PayrollPreviewDTO.builder()
                            .employee(employee.getEmail())
                            .paymentDate(payRollDate)
                            .grossPay(pay)
                            .build();
                })
                .toList();

        payrollPreviewDTOs.addAll(salaryPayrollPreview);

        List<TimeSheet> hourlyTimeSheets = timeSheetService.readTimeSheetsForPayRoll();
        List<PayrollPreviewDTO> hourlyPayRollPreview = hourlyTimeSheets.stream()
                .map(timeSheet -> {
                    Employee employee = timeSheet.getEmployee();
                    BigDecimal grossPay = calculateHourlyPays(employee, timeSheet.getRegularHours(), timeSheet.getOvertimeHours()).get(2);
                    return PayrollPreviewDTO.builder()
                            .employee(employee.getEmail())
                            .grossPay(grossPay)
                            .paymentDate(payRollDate)
                            .build();
                })
                .toList();
        payrollPreviewDTOs.addAll(hourlyPayRollPreview);

        return payrollPreviewDTOs;
    }

    public List<PayStub> runPayRoll() {
        LocalDate payRollDate = LocalDate.now();
        List<Employee> employees = employeeService.readAllEmployees();
        List<PayStub> payStubs = new ArrayList<>();

        List<PayStub> salaryStubs = employees.stream()
                .filter(employee -> employee.getPayInformation().getPayType().equals(PayType.SALARY))
                .map(salaried -> {
                    BigDecimal pay = salaried.getPayInformation().getPayAmount()
                            .divide(BigDecimal.valueOf(52.0), 2, RoundingMode.HALF_UP)
                            .setScale(2, RoundingMode.HALF_UP);
                    return PayStub.builder()
                            .employee(salaried)
                            .payDate(payRollDate)
                            .grossPay(pay)
                            .grossHours(40.0)
                            .regularPay(pay)
                            .regularHours(40.0)
                            .overtimePay(BigDecimal.valueOf(0.0))
                            .overtimeHours(0.0)
                            .build();
                })
                .toList();

        salaryStubs = payStubRepository.saveAll(salaryStubs);
        payStubs.addAll(salaryStubs);

        List<PayStub> hourlyStubs = timeSheetService.readTimeSheetsForPayRoll()
                .stream()
                .map(this::generatePayStubFromTimeSheet)
                .toList();

        hourlyStubs = payStubRepository.saveAll(hourlyStubs);
        payStubs.addAll(hourlyStubs);

        return payStubs;
    }

    public List<PayStub> generatePayStubData(List<TimeSheet> timeSheets) {
        List<PayStub> payStubs = new ArrayList<>();
        timeSheets.forEach(timeSheet -> {
            PayStub payStub = generatePayStubFromTimeSheet(timeSheet);
            payStubs.add(payStub);
        });
        return payStubRepository.saveAll(payStubs);
    }

    private List<BigDecimal> calculateHourlyPays(Employee employee, Double regular, Double overtime) {
        BigDecimal hourlyRate = employee.getPayInformation().getPayAmount();
        BigDecimal overtimeRate = BigDecimal.valueOf(1.5);
        
        BigDecimal regularPay = BigDecimal.valueOf(regular).multiply(hourlyRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal overtimePay = BigDecimal.valueOf(overtime).multiply(overtimeRate).multiply(hourlyRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grossPay = regularPay.add(overtimePay).setScale(2, RoundingMode.HALF_UP);
        
        return List.of(regularPay, overtimePay, grossPay);
    }
    
    private PayStub generatePayStubFromTimeSheet(TimeSheet timeSheet) {
        Employee employee = timeSheet.getEmployee();
        Double regular = timeSheet.getRegularHours();
        Double overtime = timeSheet.getOvertimeHours();
        List<BigDecimal> pays = calculateHourlyPays(employee, regular, overtime);

        timeSheetService.updateTimeSheetStatus(timeSheet.getId(), TimeSheetStatus.PAID);
        return PayStub.builder()
                .employee(employee)
                .payDate(timeSheet.getEndDate())
                .regularHours(regular)
                .regularPay(pays.get(0))
                .overtimeHours(overtime)
                .overtimePay(pays.get(1))
                .grossHours(regular + overtime)
                .grossPay(pays.get(2))
                .build();
    }
}
