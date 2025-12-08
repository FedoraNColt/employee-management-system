package com.fedorancolt.ems.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.annotation.web.configurers.RequestCacheConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Central Spring Security setup for the API.
 * - Registers bcrypt for password hashing.
 * - Wires DAO authentication with the app's UserDetailsService.
 * - Applies a simple CORS policy for the frontend dev host.
 * - Defines what endpoints are publicly accessible vs. authenticated.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService) throws Exception {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // frontend dev server
        configuration.setAllowedMethods(List.of("*"));    // tighten to specific verbs in production
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                // Allow calls from the configured frontend origin
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .securityContext(context -> context.securityContextRepository(securityContextRepository()))
                .requestCache(RequestCacheConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(unprotectedRoutes()).permitAll()
                        .requestMatchers(adminRoutes()).hasRole("ADMIN")
                        .requestMatchers(employeeRoutes()).hasRole("EMPLOYEE")
                        .anyRequest().authenticated())
                .build();
    }

    private static AntPathRequestMatcher[] unprotectedRoutes() {
        return new AntPathRequestMatcher[] {
                new AntPathRequestMatcher("/auth/login"),
                new AntPathRequestMatcher("/h2-console/**")
        };
    }

    private static AntPathRequestMatcher[] adminRoutes() {
        return new AntPathRequestMatcher[] {
                new AntPathRequestMatcher("/auth/register"),
                new AntPathRequestMatcher("/employee/", "GET"),
                new AntPathRequestMatcher("/employee/{email}", "DELETE"),
                new AntPathRequestMatcher("/employee/pay/{email}", "PUT"),
                new AntPathRequestMatcher("/employee/", "PUT"),
        };
    }

    public static AntPathRequestMatcher[] employeeRoutes() {
        return new AntPathRequestMatcher[] {
                new AntPathRequestMatcher("/timesheet/", "POST"),
                new AntPathRequestMatcher("/timesheet/hours", "PUT"),
                new AntPathRequestMatcher("/timesheet/submit/{timeSheetId}", "PUT"),
                new AntPathRequestMatcher("/employee/contact/{email}", "PUT"),
        };
    }
}
