package com.financialtransactions.monitor.security.controller;

import com.financialtransactions.monitor.security.dto.JwtAuthResponse;
import com.financialtransactions.monitor.security.model.Role;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.service.JwtService;
import com.financialtransactions.monitor.security.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
public class SecurityController {

    private static final Logger log = LoggerFactory.getLogger(SecurityController.class);
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> register(@RequestBody User user) {
        log.info("Processing registration request for user: {}", user.getUsername());
        try {
            String jwtToken = userService.register(user);
            log.debug("Successfully generated JWT token for user: {}", user.getUsername());
            return ResponseEntity.ok(new JwtAuthResponse(jwtToken));
        } catch (Exception e) {
            log.error("Registration failed for user: {}", user.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new JwtAuthResponse(null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody User user) {
        log.info("Processing login request for user: {}", user.getUsername());
        try {
            String jwtToken = userService.verify(user);
            log.debug("Successfully verified user and generated JWT token for: {}", user.getUsername());
            return ResponseEntity.ok(new JwtAuthResponse(jwtToken));
        } catch (Exception e) {
            log.error("Login failed for user: {}", user.getUsername(), e);
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