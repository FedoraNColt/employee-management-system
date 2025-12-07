package com.fedorancolt.ems.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "timesheets")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TimeSheet extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"reportsTo"})
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "approver_id")
    @JsonIgnoreProperties({"reportsTo"})
    private Employee approver;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private TimeSheetStatus status;

    @OneToMany(mappedBy = "timesheet")
    List<TimeSheetHours> hours;

    @Column(name = "regular_pay_hours")
    private Double regularHours;

    @Column(name = "overtime_pay_hours")
    private Double overtimeHours;

    @Column(name = "approver_message")
    private String message;
}
