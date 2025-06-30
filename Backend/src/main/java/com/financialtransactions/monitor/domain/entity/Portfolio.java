package com.financialtransactions.monitor.domain.entity;

import com.financialtransactions.monitor.domain.enums.CurrencyType;
import com.financialtransactions.monitor.security.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "portfolios",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "currency"}))
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CurrencyType currency;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Trade> trades;
}