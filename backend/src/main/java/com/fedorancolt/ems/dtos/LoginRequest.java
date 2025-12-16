package com.fedorancolt.ems.dtos;

import lombok.Builder;

@Builder
public record LoginRequest(String email, String password) {
}
