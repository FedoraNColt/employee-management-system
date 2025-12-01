package com.fedorancolt.employee_management_system.exceptions;

public class EmployeeDoesNotExist extends RuntimeException {

    public EmployeeDoesNotExist(String message) {
        super(message);
    }

    public EmployeeDoesNotExist() {
        super("Employee does not exist.");
    }
}
