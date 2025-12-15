package com.fedorancolt.ems.dtos;


import lombok.Builder;

@Builder
public record UpdatePasswordRequest(String password, String refreshToken) {
}
