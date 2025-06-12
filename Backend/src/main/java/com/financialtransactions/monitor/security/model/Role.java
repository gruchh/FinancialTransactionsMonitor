package com.financialtransactions.monitor.security.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "ROLES")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String name;
}