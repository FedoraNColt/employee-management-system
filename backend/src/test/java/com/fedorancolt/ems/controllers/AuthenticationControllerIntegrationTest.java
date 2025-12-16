package com.fedorancolt.ems.controllers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    @Test
    @DisplayName("Login succeeds and returns employee plus tokens")
    void loginWithValidCredentialsReturnsEmployee() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin.employee@company.com\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employee.email").value("admin.employee@company.com"))
                .andExpect(jsonPath("$.employee.firstName").value("admin"))
                .andExpect(jsonPath("$.employee.lastName").value("employee"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refresh").isNotEmpty());
    }

    @Test
    @DisplayName("Login fails with bad credentials")
    void loginWithInvalidCredentialsReturnsForbidden() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin.employee@company.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isForbidden())
                .andExpect(content().string(containsString("Invalid email or password")));
    }

    @Test
    @DisplayName("Admin can register a new employee and receive a temporary password")
    void registerEmployeeWhenAuthenticatedAsAdmin() throws Exception {
        var loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin.employee@company.com\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .path("token").asText();
        assertThat(token).isNotBlank();

        mockMvc.perform(post("/auth/register")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "employeeType": "EMPLOYEE",
                                  "firstName": "new",
                                  "lastName": "hire",
                                  "phoneNumber": "9998887777",
                                  "payType": "HOURLY",
                                  "payAmount": 30.00,
                                  "reportsTo": "manager.employee@company.com"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employee.email").value("new.hire@company.com"))
                .andExpect(jsonPath("$.employee.employeeType").value("EMPLOYEE"))
                .andExpect(jsonPath("$.employee.reportsTo.email").value("manager.employee@company.com"))
                .andExpect(jsonPath("$.temporaryPassword").isNotEmpty());
    }

    @Test
    @DisplayName("Register endpoint rejects unauthenticated requests")
    void registerEmployeeUnauthorized() throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "employeeType": "EMPLOYEE",
                                  "firstName": "anon",
                                  "lastName": "user",
                                  "phoneNumber": "1112223333",
                                  "payType": "HOURLY",
                                  "payAmount": 20.00
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }
}
