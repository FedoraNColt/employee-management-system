package com.fedorancolt.ems.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Entity
@Table(name = "timesheet_hours")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TimeSheetHours extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "timesheet_id")
    @JsonIgnoreProperties({"hours", "employee", "approver"})
    private TimeSheet timesheet;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private DayOfWeek dayOfWeek;

    private LocalDate date;

    private Double hours;

}
