package com.financialtransactions.monitor.security.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN("ROLE_ADMIN"),
    TRADER("ROLE_TRADER");

    private final String authority;

    @Override
    public String toString() {
        return authority;
    }
}