package com.fedorancolt.ems.services;

import com.fedorancolt.ems.dtos.LoginResponse;
import com.fedorancolt.ems.entities.Employee;
import com.fedorancolt.ems.entities.RefreshToken;
import com.fedorancolt.ems.exceptions.RevalidateTokenException;
import com.fedorancolt.ems.repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final RefreshTokenRepository refreshTokenRepository;

    public String generateToken(Employee employee) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(60 * 5);
        String role = employee.getEmployeeType().toString();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiration)
                .subject(employee.getEmail())
                .claim("roles", List.of(role))
                .build();
        return  jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public RefreshToken generateRefreshToken(Employee employee) {
        // Ensure only one refresh token per employee to satisfy the unique constraint on employee_id.
        RefreshToken refreshToken = refreshTokenRepository.findByEmployee(employee)
                .orElse(RefreshToken.builder().employee(employee).build());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(60 * 60 * 24)); // 24h validity
        return refreshTokenRepository.save(refreshToken);
    }

    public LoginResponse refreshJwt(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(RevalidateTokenException::new);
        Instant now = Instant.now();
        if (now.isAfter(refreshToken.getExpiryDate())) {
            throw new RevalidateTokenException();
        }
        // Rotate the refresh token so a stolen token cannot be reused indefinitely.
        refreshToken.setToken(UUID.randomUUID().toString());
        // Do not extend expiry here; keep original lifetime to avoid perpetually extending a stolen token.
        refreshTokenRepository.save(refreshToken);

        String jwtToken = this.generateToken(refreshToken.getEmployee());
        return LoginResponse.builder()
                .employee(refreshToken.getEmployee())
                .token(jwtToken)
                .refresh(refreshToken.getToken())
                .build();
    }

    public void deleteEmployeeRefreshToken(Employee employee) {
        Optional<RefreshToken> token = refreshTokenRepository.findByEmployee(employee);
        if (token.isEmpty()) return;
        RefreshToken refreshToken = token.get();
        refreshTokenRepository.delete(refreshToken);
    }

   public String extractEmployeeEmailFromToken(String token) {
        Jwt jwtToken = jwtDecoder.decode(splitToken(token));
       return jwtToken.getSubject();
   }

    private String splitToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }

}
