package com.fedorancolt.ems.controllers;

import com.fedorancolt.ems.dtos.GenerateDatedTimeSheetRequest;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.TimeSheet;
import com.fedorancolt.ems.entities.TimeSheetStatus;
import com.fedorancolt.ems.exceptions.TimeSheetDoesNotExistException;
import com.fedorancolt.ems.services.TimeSheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/timesheet")
@RequiredArgsConstructor
public class TimeSheetController {

    private final TimeSheetService timeSheetService;

    @PostMapping("/")
    public TimeSheet generateOrFetchTimeSheetForEmployee(@RequestBody Employee employee) {
        return timeSheetService.createOrReadTimeSheetForEmployee(employee);
    }

    @PostMapping("/dates")
    public TimeSheet generateTimeSheetWithDates(@RequestBody GenerateDatedTimeSheetRequest request) {
        return timeSheetService.createTimeSheetWithDatesForEmployee(request.employee(), request.startDate(), request.endDate());
    }

    @PutMapping("/hours")
    public TimeSheet updateTimeSheetHours(@RequestBody TimeSheet timeSheet) {
        return timeSheetService.updateTimeSheetHours(timeSheet);
    }

    @PutMapping("/submit/{timeSheetId}")
    public TimeSheet submitTimeSheet(@PathVariable("timeSheetId") UUID timeSheetId) {
        return timeSheetService.updateTimeSheetStatus(timeSheetId, TimeSheetStatus.SUBMITTED);
    }

    @ExceptionHandler({TimeSheetDoesNotExistException.class})
    public ResponseEntity<String> handleTimeSheetDoesNotExistException() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("TimeSheet does not exist");
    }

}
