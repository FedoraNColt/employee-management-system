package com.fedorancolt.ems.exceptions;

public class UnableToRegisterEmployee extends RuntimeException {

    public UnableToRegisterEmployee(String message) {
        super(message);
    }

    public UnableToRegisterEmployee() {
        super("Unable to register employee");
    }

    public UnableToRegisterEmployee(String message, Throwable cause) {
        super(message, cause);
    }
}
