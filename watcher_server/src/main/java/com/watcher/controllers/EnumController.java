package com.watcher.controllers;

import com.watcher.dto.RoleDto;
import com.watcher.dto.TicketStatusDto;
import com.watcher.models.RoleEnum;
import com.watcher.models.TicketStatusEnum;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/watcher/enums")
public class EnumController {

    @GetMapping("/roles")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = Arrays.stream(RoleEnum.values())
                .map(role -> new RoleDto(role.getId(), role.getRoleName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(roles);
    }

    @GetMapping("/ticket-status")
    public ResponseEntity<List<TicketStatusDto>> getAllTicketStatuses() {
        List<TicketStatusDto> ticketStatuses = Arrays.stream(TicketStatusEnum.values())
                .map(status -> new TicketStatusDto(status.getId(), status.getStatusName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ticketStatuses);
    }
}
