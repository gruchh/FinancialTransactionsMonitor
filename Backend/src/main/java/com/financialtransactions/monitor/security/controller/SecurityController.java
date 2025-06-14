package com.financialtransactions.monitor.security.controller;

import com.financialtransactions.monitor.security.dto.JwtAuthRequest;
import com.financialtransactions.monitor.security.dto.JwtAuthResponse;
import com.financialtransactions.monitor.security.dto.RegisterRequest;
import com.financialtransactions.monitor.security.model.Role;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.service.JwtService;
import com.financialtransactions.monitor.security.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
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
@RestController
public class SecurityController {

    private final UserService userService;
    private final JwtService jwtService;

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

    @GetMapping("/getUser")
    public ResponseEntity<User> getUser(@RequestHeader("Authorization") String token) {
        log.info("Processing getUser request with token: {}", token);
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                log.warn("Invalid or missing Authorization header: {}", token);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null);
            }
            String tokenValue = token.replace("Bearer ", "");
            String username = jwtService.extractUsername(tokenValue);
            String email = jwtService.extractEmail(tokenValue);
            Set<Role> roles = jwtService.extractRoles(tokenValue);

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setRoles(roles);

            log.debug("Successfully extracted user details: username={}, email={}, roles={}", username, email, roles);
            return ResponseEntity.ok(user);
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", token, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        } catch (Exception e) {
            log.error("Error processing token: {}", token, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Set<String>> getCurrentUser() {
        log.info("Processing getCurrentUser request");
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                log.warn("No authenticated user found in SecurityContext");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Set.of("UNAUTHENTICATED"));
            }
            Set<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());
            log.debug("Retrieved roles for current user: {}", roles);
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            log.error("Error retrieving current user roles", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Set.of("ERROR_ROLE"));
        }
    }
}