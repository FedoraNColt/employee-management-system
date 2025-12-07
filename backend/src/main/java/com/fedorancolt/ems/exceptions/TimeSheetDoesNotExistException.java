package com.fedorancolt.ems.exceptions;

public class TimeSheetDoesNotExistException extends RuntimeException {

    public TimeSheetDoesNotExistException(String message) {
        super(message);
    }

    public TimeSheetDoesNotExistException() {
        super("TimeSheet does not exist");
    }
}
