package com.fedorancolt.ems.dtos;

public record UpdateContactInformationRequest(
        String phoneNumber,
        String addressLineOne,
        String addressLineTwo,
        String city,
        String state,
        String zipCode
        ) {
}
