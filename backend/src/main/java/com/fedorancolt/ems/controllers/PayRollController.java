package com.fedorancolt.ems.controllers;

import com.fedorancolt.ems.dtos.PayrollPreviewDTO;
import com.fedorancolt.ems.entities.PayStub;
import com.fedorancolt.ems.entities.TimeSheet;
import com.fedorancolt.ems.services.PayStubService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payroll")
@RequiredArgsConstructor
public class PayRollController {

    private final PayStubService payStubService;

    @GetMapping("/view/{email}")
    public List<PayStub> getEmployeesPayStubs(
            @PathVariable("email") String email,
            @RequestParam("year") Optional<String> year) {
        if (year.isPresent()) {
            return payStubService.readPayStubsForEmployeeOfYear(email, year.get());
        } else {
            return payStubService.readPayStubsForEmployee(email);
        }
    }

    @GetMapping("/preview")
    public List<PayrollPreviewDTO> previewPayRoll() {
        return payStubService.previewPayroll();
    }

    @GetMapping("/run")
    public List<PayStub> runPayRoll() {
        return payStubService.runPayRoll();
    }

    @PostMapping("/data")
    public List<PayStub> generateTestData(@RequestBody List<TimeSheet> sheets) {
        return payStubService.generatePayStubData(sheets);
    }

}
