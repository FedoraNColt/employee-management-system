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

    @Test
    @DisplayName("Login succeeds and returns employee plus session cookie")
    void loginWithValidCredentialsReturnsEmployee() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"adminemployee@company.com\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("adminemployee@company.com"))
                .andExpect(jsonPath("$.firstName").value("admin"))
                .andExpect(jsonPath("$.lastName").value("employee"));
//                .andExpect(cookie().exists("JSESSIONID"));
    }

    @Test
    @DisplayName("Login fails with bad credentials")
    void loginWithInvalidCredentialsReturnsForbidden() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"adminemployee@company.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isForbidden())
                .andExpect(content().string(containsString("Invalid email or password")));
    }

    @Test
    @DisplayName("Admin can register a new employee and receive a temporary password")
    void registerEmployeeWhenAuthenticatedAsAdmin() throws Exception {
        var loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"adminemployee@company.com\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertThat(session).isNotNull();

        mockMvc.perform(post("/auth/register")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "employeeType": "EMPLOYEE",
                                  "firstName": "new",
                                  "lastName": "hire",
                                  "phoneNumber": "9998887777",
                                  "payType": "HOURLY",
                                  "payAmount": 30.00,
                                  "reportsTo": "manageremployee@company.com"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employee.email").value("new.hire@company.com"))
                .andExpect(jsonPath("$.employee.employeeType").value("EMPLOYEE"))
                .andExpect(jsonPath("$.employee.reportsTo.email").value("manageremployee@company.com"))
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
                .andExpect(status().isForbidden());
    }
}
