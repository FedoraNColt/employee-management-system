package com.fedorancolt.ems.controllers;

import com.fedorancolt.ems.dtos.*;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.exceptions.InvalidCredentialsException;
import com.fedorancolt.ems.exceptions.RevalidateTokenException;
import com.fedorancolt.ems.services.AuthenticationService;
import com.fedorancolt.ems.services.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public LoginResponse loginEmployee(
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authenticationService.loginEmployee(loginRequest.email(), loginRequest.password(), request, response);
    }

    @GetMapping("/refresh/{token}")
    public LoginResponse refreshToken(@PathVariable("token") String token) {
        return tokenService.refreshJwt(token);
    }

    @PostMapping("/register")
    public RegisterResponse registerEmployee(@RequestBody RegisterRequest request) {
        return authenticationService.registerEmployee(request);
    }

    @GetMapping("/")
    public Employee getEmployeeByToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        return authenticationService.readEmployeeFromToken(token);
    }

    @PutMapping("/password/update")
    public LoginResponse updateEmployeePassword(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody UpdatePasswordRequest request) {
        return authenticationService.updateEmployeePassword(token, request);
    }

    @DeleteMapping("/logout")
    public ResponseEntity logoutEmployee(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        authenticationService.logout(token);
        return ResponseEntity.noContent().build();
    }
    
    @ExceptionHandler({InvalidCredentialsException.class})
    public ResponseEntity<String> handleInvalidCredentialsException() {
        return ResponseEntity.status(403).body("Invalid email or password");
    }

    @ExceptionHandler({RevalidateTokenException.class})
    public ResponseEntity<String> handleRevalidateTokenException() {
        return ResponseEntity.status(401).body("Re-authenticate to continue");
    }

}
