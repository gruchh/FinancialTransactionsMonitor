package com.financialtransactions.monitor.security.controller;

import com.financialtransactions.monitor.security.dto.JwtAuthRequest;
import com.financialtransactions.monitor.security.dto.JwtAuthResponse;
import com.financialtransactions.monitor.security.dto.RegisterRequest;
import com.financialtransactions.monitor.security.dto.UserMeResponse;
import com.financialtransactions.monitor.security.exception.ValidationException;
import com.financialtransactions.monitor.security.mapper.UserResponseMapper;
import com.financialtransactions.monitor.security.model.Role;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.service.JwtService;
import com.financialtransactions.monitor.security.service.JwtTokenValidator;
import com.financialtransactions.monitor.security.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@RestController()
@RequestMapping("/auth")
public class SecurityController {

    private final UserService userService;
    private final JwtService jwtService;
    private final JwtTokenValidator jwtTokenValidator;
    private final UserResponseMapper userResponseMapper;

    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Processing registration request for user: {}", request.getUsername());
        try {
            String jwtToken = userService.register(request);
            log.debug("Successfully generated JWT token for user: {}", request.getUsername());
            return ResponseEntity.ok(new JwtAuthResponse(jwtToken));
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new JwtAuthResponse(null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody JwtAuthRequest request) {
        log.info("Processing login request for user: {}", request.getUsername());
        try {
            String jwtToken = userService.verify(request);
            log.debug("Successfully verified user and generated JWT token for: {}", request.getUsername());
            return ResponseEntity.ok(new JwtAuthResponse(jwtToken));
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new JwtAuthResponse(null));
        }
    }

    @GetMapping("/getCurrentUser")
    public ResponseEntity<UserMeResponse> getCurrentUser(HttpServletRequest request) {
        log.info("Przetwarzanie żądania getCurrentUser");
        try {
            String username = jwtTokenValidator.validateToken(request)
                    .orElseThrow(() -> new RuntimeException("Błąd walidacji tokenu"));
            log.debug("Zweryfikowano token dla użytkownika: {}", username);
            UserMeResponse response = userService.getCurrentUserInfo(username);
            response.setStatus("success");
            log.debug("Pobrano dane użytkownika: {}", username);
            return ResponseEntity.ok(response);
        } catch (ValidationException e) {
            log.warn("Błąd walidacji JWT: {}", e.getMessage());
            return ResponseEntity.status(e.getStatus())
                    .body(UserMeResponse.builder()
                            .status("error")
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Błąd podczas pobierania danych użytkownika", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UserMeResponse.builder()
                            .status("error")
                            .message("Wewnętrzny błąd serwera: " + e.getMessage())
                            .build());
        }
    }
}