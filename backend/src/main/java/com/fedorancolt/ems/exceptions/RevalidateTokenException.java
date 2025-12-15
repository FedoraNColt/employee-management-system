package com.fedorancolt.ems.exceptions;

public class RevalidateTokenException extends RuntimeException {

    public RevalidateTokenException(String message) {
        super(message);
    }

    public RevalidateTokenException() {
        super("Refresh token expired, please re-authenticate");
    }

}
