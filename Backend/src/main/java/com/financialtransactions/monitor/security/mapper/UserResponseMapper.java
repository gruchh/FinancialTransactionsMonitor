package com.financialtransactions.monitor.security.mapper;

import com.financialtransactions.monitor.security.dto.UserMeResponse;
import com.financialtransactions.monitor.security.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Slf4j
@Component
public class UserResponseMapper {

    public UserMeResponse toUserMeResponse(User user) {
        log.info("Rozpoczynam mapowanie");
        return UserMeResponse.builder()
                .status("success")
                .message("Dane pobrano pomyślnie")
                .data(UserMeResponse.UserData.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                        .createdAt(user.getCreatedAt())
                        .build())
                .build();
    }
}
