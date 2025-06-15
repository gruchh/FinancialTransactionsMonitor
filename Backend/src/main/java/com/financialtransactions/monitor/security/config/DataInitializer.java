package com.financialtransactions.monitor.security.config;

import com.financialtransactions.monitor.security.model.Role;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initializeUsers() {
        log.info("Inicjalizacja użytkowników...");
        List<User> usersToCreate = new ArrayList<>();

        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .email("admin@example.com")
                    .roles(Set.of(Role.ADMIN, Role.TRADER))
                    .build();

            usersToCreate.add(admin);
            log.info("Dodano użytkownika admin do listy");
        } else {
            log.info("Użytkownik admin już istnieje");
        }

        if (!userRepository.existsByUsername("trader")) {
            User trader = User.builder()
                    .username("trader")
                    .password(passwordEncoder.encode("trader"))
                    .email("trader@example.com")
                    .roles(Set.of(Role.TRADER))
                    .build();

            usersToCreate.add(trader);
            log.info("Dodano użytkownika trader do listy");
        } else {
            log.info("Użytkownik trader już istnieje");
        }

        if (!usersToCreate.isEmpty()) {
            userRepository.saveAll(usersToCreate);
            log.info("Zapisano {} użytkowników do bazy danych", usersToCreate.size());
        } else {
            log.info("Brak nowych użytkowników do utworzenia");
        }
        log.info("Inicjalizacja użytkowników zakończona");
    }
}