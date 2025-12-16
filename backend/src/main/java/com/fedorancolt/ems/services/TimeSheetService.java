package com.fedorancolt.ems.services;


import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.TimeSheet;
import com.fedorancolt.ems.entities.TimeSheetHours;
import com.fedorancolt.ems.entities.TimeSheetStatus;
import com.fedorancolt.ems.exceptions.TimeSheetDoesNotExistException;
import com.fedorancolt.ems.repositories.TimeSheetHoursRepository;
import com.fedorancolt.ems.repositories.TimeSheetRepository;
import com.fedorancolt.ems.utils.TimeSheetUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

import static com.fedorancolt.ems.utils.TimeSheetUtils.MAX_REGULAR_HOURS;

@Service
@Transactional
@RequiredArgsConstructor
public class TimeSheetService {

    private final TimeSheetRepository timeSheetRepository;
    private final TimeSheetHoursRepository timeSheetHoursRepository;

    public TimeSheet createTimeSheetWithDatesForEmployee(Employee employee, LocalDate startDate, LocalDate endDate) {

        Optional<TimeSheet> existingTimesheet = timeSheetRepository.findByStartDateAndEmployee(startDate, employee);
        if (existingTimesheet.isPresent()) return existingTimesheet.get();

        TimeSheet timeSheet = TimeSheet.builder()
                .startDate(startDate)
                .endDate(endDate)
                .employee(employee)
                .hours(new ArrayList<>())
                .status(TimeSheetStatus.CREATED)
                .regularHours(0.0)
                .overtimeHours(0.0)
                .message("")
                .build();

        timeSheet = timeSheetRepository.save(timeSheet);

        List<TimeSheetHours> hours = generateHoursForTimeSheet(timeSheet, startDate, endDate);
        timeSheet.setHours(hours);

        return timeSheetRepository.save(timeSheet);
    }

    public TimeSheet createOrReadTimeSheetForEmployee(Employee employee) {

        LocalDate now = LocalDate.now();
        Integer daysSinceSunday = TimeSheetUtils.getDaysSinceSunday(now);
        LocalDate startDate = now.minusDays(daysSinceSunday);
        LocalDate endDate = startDate.plusDays(6);

        Optional<TimeSheet>  existingTimeSheet = timeSheetRepository.findByStartDateAndEmployee(startDate, employee);
        if (existingTimeSheet.isPresent()) return existingTimeSheet.get();
        return createTimeSheetWithDatesForEmployee(employee, startDate, endDate);
    }

    public List<TimeSheet> readManagersTimeSheetsForApproval(List<Employee> employees) {
        return timeSheetRepository.findAllByEmployeeInAndStatus(employees, TimeSheetStatus.SUBMITTED);
    }

    public List<TimeSheet> readTimeSheetsForPayRoll() {
        return timeSheetRepository.findAllByStatus(TimeSheetStatus.APPROVED);
    }

    public TimeSheet updateTimeSheetHours(TimeSheet timeSheet) {
        List<TimeSheetHours> hours = timeSheet.getHours();

        hours =  timeSheetHoursRepository.saveAll(hours);

        Double totalHours = hours.stream().map(TimeSheetHours::getHours).mapToDouble(d -> d).sum();
        Double regularHours = Math.min(MAX_REGULAR_HOURS, totalHours);
        Double overtimeHours = totalHours - regularHours;
        timeSheet.setRegularHours(regularHours);
        timeSheet.setOvertimeHours(overtimeHours);

        timeSheet.setHours(hours);
        timeSheet.setStatus(TimeSheetStatus.SAVED);

        return timeSheetRepository.save(timeSheet);
    }

    public TimeSheet updateTimeSheetStatus(UUID timeSheetId, TimeSheetStatus status) {
        TimeSheet timeSheet = retrieveTimeSheetByIdOrThrowTimeSheetDoesNotException(timeSheetId);
        // Prevent updates to already paid timesheets.
        if (timeSheet.getStatus() == TimeSheetStatus.PAID) {
            return timeSheet;
        }
        timeSheet.setStatus(status);
        return timeSheetRepository.save(timeSheet);
    }

    public TimeSheet approveOrDenyTimeSheet(
            UUID timeSheetId,
            TimeSheetStatus status,
            Employee approver,
            String message) {
        TimeSheet timeSheet = retrieveTimeSheetByIdOrThrowTimeSheetDoesNotException(timeSheetId);

        if (timeSheet.getStatus() == TimeSheetStatus.PAID) {
            return timeSheet;
        }
        timeSheet.setStatus(status);
        timeSheet.setApprover(approver);
        timeSheet.setMessage(message);

        return timeSheetRepository.save(timeSheet);
    }

    private TimeSheet retrieveTimeSheetByIdOrThrowTimeSheetDoesNotException(UUID timeSheetId) {
        return timeSheetRepository.findById(timeSheetId).orElseThrow(TimeSheetDoesNotExistException::new);
    }

    private List<TimeSheetHours> generateHoursForTimeSheet(TimeSheet timeSheet,
                                                           LocalDate startDate,
                                                           LocalDate endDate) {
        List<TimeSheetHours> hours = new ArrayList<>();

        for (int i = 0; i < 7; ++i) {
            TimeSheetHours hour = TimeSheetHours.builder()
                    .hours(0.0)
                    .timesheet(timeSheet)
                    .date(startDate.plusDays(i))
                    .dayOfWeek(startDate.plusDays(i).getDayOfWeek())
                    .build();
            hours.add(hour);
        }
        timeSheetHoursRepository.saveAll(hours);
        return hours;
    }

    public List<TimeSheet> generateTimeSheetsForPayRollTests(Employee employee, Employee manager) {

        List<TimeSheet> timeSheets = new ArrayList<>();

        Random rand = new Random();
        LocalDate workingDate = LocalDate.of(2024, 12, 29);
        LocalDate today = LocalDate.now().minusDays(7);

        while (workingDate.isBefore(today)) {
            TimeSheet timeSheet = TimeSheet.builder()
                    .employee(employee)
                    .startDate(workingDate)
                    .endDate(workingDate.plusDays(6))
                    .regularHours(40.0)
                    .overtimeHours(Math.ceil(rand.nextDouble(21.0)))
                    .approver(manager)
                    .status(TimeSheetStatus.APPROVED)
                    .hours(new ArrayList<>())
                    .build();

            timeSheetRepository.save(timeSheet);
            timeSheets.add(timeSheet);
            workingDate = workingDate.plusDays(7);
        }

        return timeSheets;
    }

}
