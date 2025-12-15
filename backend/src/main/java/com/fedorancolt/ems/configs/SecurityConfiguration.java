package com.fedorancolt.ems.configs;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import lombok.RequiredArgsConstructor;
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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
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
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final RSAKeyProperties keys;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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
    public JwtDecoder jwtDecoder() {
        return  NimbusJwtDecoder.withPublicKey(keys.getPublicKey()).build();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(keys.getPublicKey()).privateKey(keys.getPrivateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                // Allow calls from the configured frontend origin
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .requestCache(RequestCacheConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(unprotectedRoutes()).permitAll()
                        .requestMatchers(adminRoutes()).hasRole("ADMIN")
                        .requestMatchers(managerRoutes()).hasRole("MANAGER")
                        .requestMatchers(employeeRoutes()).hasRole("EMPLOYEE")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(server -> server.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }

    private static AntPathRequestMatcher[] unprotectedRoutes() {
        return new AntPathRequestMatcher[] {
                new AntPathRequestMatcher("/auth/login"),
                new AntPathRequestMatcher("/h2-console/**"),
                new AntPathRequestMatcher("/auth/refresh/{token}"),
        };
    }

    private static AntPathRequestMatcher[] adminRoutes() {
        return new AntPathRequestMatcher[] {
                new AntPathRequestMatcher("/auth/register"),
                new AntPathRequestMatcher("/employee/", "GET"),
                new AntPathRequestMatcher("/employee/{email}", "DELETE"),
                new AntPathRequestMatcher("/employee/pay/{email}", "PUT"),
                new AntPathRequestMatcher("/employee/", "PUT"),
                new AntPathRequestMatcher("/payroll/preview", "GET"),
                new AntPathRequestMatcher("/payroll/run", "GET"),
                new AntPathRequestMatcher("/timesheet/data", "POST"),
                new AntPathRequestMatcher("/payroll/data", "POST"),
        };
    }

    private static AntPathRequestMatcher[] managerRoutes() {
        return new AntPathRequestMatcher[]{
                new AntPathRequestMatcher("/employee/reportsTo/{email}", "GET"),
                new AntPathRequestMatcher("/timesheet/manager", "POST"),
                new AntPathRequestMatcher("/timesheet/review", "PUT")
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
