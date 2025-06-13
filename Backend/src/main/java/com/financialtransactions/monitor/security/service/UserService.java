package com.financialtransactions.monitor.security.service;

import com.financialtransactions.monitor.security.model.Role;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("User with this email already exists");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalStateException("User with this username already exists");
        }

        String originalPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(originalPassword));

        user.setRoles(Set.of(Role.TRADER));
        userRepository.save(user);

        return verify(User.builder()
                .username(user.getUsername())
                .password(originalPassword)
                .email(user.getEmail())
                .roles(Set.of(Role.TRADER))
                .build());
    }

    public String verify(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(existingUser.getUsername(), existingUser.getEmail(), existingUser.getRoles());
        } else {
            throw new BadCredentialsException("Authentication failed for user: " + user.getUsername());
        }
    }
}