package com.fedorancolt.ems.util;

import java.util.UUID;

public class CredentialUtil {

    private CredentialUtil() {}

    public static String generateEmailAddress(String firstName, String lastName) {
        return firstName.toLowerCase() + "." + lastName.toLowerCase() + "@company.com";
    }

    public static String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
