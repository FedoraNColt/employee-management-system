package com.fedorancolt.ems.services;

import com.fedorancolt.ems.dtos.RegisterRequest;
import com.fedorancolt.ems.dtos.RegisterResponse;
import com.fedorancolt.ems.entities.*;
import com.fedorancolt.ems.exceptions.InvalidCredentialsException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;

import static com.fedorancolt.ems.util.CredentialUtil.generateEmailAddress;
import static com.fedorancolt.ems.util.CredentialUtil.generateTemporaryPassword;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final EmployeeService employeeService;
    private final ContactInformationService contactInformationService;
    private final PayInformationService payInformationService;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();


    public Employee loginEmployee(String email, String password, HttpServletRequest request, HttpServletResponse response) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = UsernamePasswordAuthenticationToken.unauthenticated(email, password);
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            if (authentication.isAuthenticated()) {
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                securityContextHolderStrategy.setContext(context);
                securityContextRepository.saveContext(context, request, response);
            }
            return employeeService.readEmployeeByEmail(email);
        }
        catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Incorrect email or password");
        }
    }

    public RegisterResponse registerEmployee(RegisterRequest registerRequest) {
        ContactInformation contactInformation = contactInformationService.createContactInformation(
                ContactInformation.builder()
                        .phoneNumber(registerRequest.phoneNumber())
                        .build()
        );

        PayInformation payInformation = payInformationService.createPayInformation(
                PayInformation.builder()
                        .payType(registerRequest.payType())
                        .payAmount(registerRequest.payAmount())
                        .build()
        );

        String email = generateEmailAddress(registerRequest.firstName(), registerRequest.lastName());
        String temporaryPassword = generateTemporaryPassword();

        Employee manager = registerRequest.reportsTo() != null ?
                employeeService.readEmployeeByEmail(registerRequest.reportsTo()) : null;

        Employee employee = employeeService.createOrUpdateEmployee(
                Employee.builder()
                        .email(email)
                        .password(passwordEncoder.encode(temporaryPassword))
                        .employeeType(registerRequest.employeeType())
                        .firstName(registerRequest.firstName())
                        .lastName(registerRequest.lastName())
                        .contactInformation(contactInformation)
                        .payInformation(payInformation)
                        .reports(new ArrayList<>())
                        .reportsTo(manager)
                        .firstTimeLogin(true)
                        .build()
        );

        return RegisterResponse.builder()
                .employee(employee)
                .temporaryPassword(temporaryPassword)
                .build();
    }

    public void loadUserInfo() {
        ContactInformation contactInfo1 = contactInformationService.createContactInformation(
                ContactInformation.builder()
                        .phoneNumber("111111111")
                        .addressLineOne("123 Admin Road")
                        .addressLineTwo("APT 405")
                        .city("Work Town")
                        .state("TX")
                        .zipCode("12345")
                        .build()
        );

        ContactInformation contactInfo2 = contactInformationService.createContactInformation(
                ContactInformation.builder()
                        .phoneNumber("2222222222")
                        .addressLineOne("345 Main St")
                        .addressLineTwo("Unit 103")
                        .city("Central Plaza")
                        .state("TX")
                        .zipCode("23456")
                        .build()
        );

        ContactInformation contactInfo3 = contactInformationService.createContactInformation(
                ContactInformation.builder()
                        .phoneNumber("1234234234")
                        .addressLineOne("678 Hourly Street")
                        .addressLineTwo("APT 101")
                        .city("Grind City")
                        .state("TX")
                        .zipCode("34567")
                        .build()
        );

        PayInformation payInfo1 = payInformationService.createPayInformation(
                PayInformation.builder()
                        .payType(PayType.SALARY)
                        .payAmount(new BigDecimal("80000.00"))
                        .build()
        );

        PayInformation payInfo2 = payInformationService.createPayInformation(
                PayInformation.builder()
                        .payType(PayType.SALARY)
                        .payAmount(new BigDecimal("10000.00"))
                        .build()
        );

        PayInformation payInfo3 = payInformationService.createPayInformation(
                PayInformation.builder()
                        .payType(PayType.HOURLY)
                        .payAmount(new BigDecimal("25.00"))
                        .build()
        );

        Employee admin = employeeService.createOrUpdateEmployee(
                Employee.builder()
                        .email("adminemployee@company.com")
                        .password(passwordEncoder.encode("pass"))
                        .employeeType(EmployeeType.ADMIN)
                        .firstName("admin")
                        .lastName("employee")
                        .contactInformation(contactInfo1)
                        .payInformation(payInfo1)
                        .reports(new ArrayList<>())
                        .reportsTo(null)
                        .firstTimeLogin(false)
                        .build()
        );

        Employee manager = employeeService.createOrUpdateEmployee(
                Employee.builder()
                        .email("manageremployee@company.com")
                        .password(passwordEncoder.encode("pass"))
                        .employeeType(EmployeeType.MANAGER)
                        .firstName("manager")
                        .lastName("employee")
                        .contactInformation(contactInfo2)
                        .payInformation(payInfo2)
                        .reports(new ArrayList<>())
                        .reportsTo(null)
                        .firstTimeLogin(false)
                        .build()
        );

        Employee employee = employeeService.createOrUpdateEmployee(
                Employee.builder()
                        .email("employeeone@company.com")
                        .password(passwordEncoder.encode("pass"))
                        .employeeType(EmployeeType.EMPLOYEE)
                        .firstName("employee")
                        .lastName("one")
                        .contactInformation(contactInfo3)
                        .payInformation(payInfo3)
                        .reports(new ArrayList<>())
                        .reportsTo(manager)
                        .firstTimeLogin(false)
                        .build()
        );

        employeeService.updateEmployeeReports(manager, employee, "add");
    }
}
