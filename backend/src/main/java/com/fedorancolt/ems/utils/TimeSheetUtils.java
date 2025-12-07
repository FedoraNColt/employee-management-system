package com.fedorancolt.ems.utils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public class TimeSheetUtils {

    public static final Double MAX_REGULAR_HOURS = 40.0;


    private  TimeSheetUtils() {
    }

    public static final List<DayOfWeek> DAYS_OF_WEEK = Arrays.asList(DayOfWeek.values());

    public static Integer getDaysSinceSunday(LocalDate currentDate) {
        DayOfWeek currentDay = currentDate.getDayOfWeek();
        return DAYS_OF_WEEK.indexOf(currentDay);
    }

}
