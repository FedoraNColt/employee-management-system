package com.fedorancolt.ems.controllers;

import com.fedorancolt.ems.dtos.LoginRequest;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.exceptions.InvalidCredentialsException;
import com.fedorancolt.ems.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public Employee loginEmployee(@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        return authenticationService.loginEmployee(loginRequest.email(), loginRequest.password(), request, response);
    }
    
    @ExceptionHandler({InvalidCredentialsException.class})
    public ResponseEntity<String> handleInvalidCredentialsException() {
        return ResponseEntity.status(403).body("Invalid email or password");
    }
}
