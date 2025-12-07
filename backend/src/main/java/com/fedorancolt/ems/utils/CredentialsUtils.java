package com.fedorancolt.ems.utils;

import java.util.UUID;

public class CredentialsUtils {

    private CredentialsUtils() {}

    public static String generateEmailAddress(String firstName, String lastName) {
        return firstName.toLowerCase() + "." + lastName.toLowerCase() + "@company.com";
    }

    public static String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
