package com.fedorancolt.ems.exceptions;

public class EmployeeDoesNotExist extends RuntimeException {

    public EmployeeDoesNotExist(String message) {
        super(message);
    }

    public EmployeeDoesNotExist() {
        super("Employee does not exist.");
    }
}
