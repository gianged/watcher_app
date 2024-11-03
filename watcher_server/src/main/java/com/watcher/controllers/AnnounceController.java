package com.watcher.controllers;

import com.watcher.dto.AnnounceDto;
import com.watcher.models.AppUser;
import com.watcher.models.RoleEnum;
import com.watcher.models.WatcherUserDetails;
import com.watcher.services.AnnounceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("watcher/manage/announces")
public class AnnounceController {
    private final AnnounceService announceService;

    @Autowired
    public AnnounceController(AnnounceService announceService) {
        this.announceService = announceService;
    }

    private AppUser getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof WatcherUserDetails) {
            return ((WatcherUserDetails) principal).getAppUser();
        } else {
            String principalClassName = principal != null ? principal.getClass().getName() : "null";
            throw new IllegalStateException("Principal is not an instance of WatcherUserDetails. Principal type: " + principalClassName);
        }
    }

    private boolean isSystemAdminOrDirector(AppUser user) {
        return user.getRoleLevel().equals(RoleEnum.SYSTEM_ADMIN.getId()) ||
                user.getRoleLevel().equals(RoleEnum.DIRECTOR.getId());
    }

    @GetMapping
    public ResponseEntity<List<AnnounceDto>> getAllAnnounces(
            @RequestParam(required = false) String content,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);

        List<AnnounceDto> announces;
        if (content != null && !content.isEmpty()) {
            announces = announceService.searchAnnouncesByContent(content, sort);
        } else {
            announces = announceService.getAllAnnounces(sort);
        }
        return ResponseEntity.ok(announces);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<AnnounceDto>> getPagedAnnounces(
            @RequestParam(required = false) String content,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AnnounceDto> announces;
        if (content != null && !content.isEmpty()) {
            announces = announceService.searchPagedAnnouncesByContent(content, pageable);
        } else {
            announces = announceService.getPagedAnnounces(pageable);
        }
        return ResponseEntity.ok(announces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnounceDto> getAnnounceById(@PathVariable Integer id) {
        AppUser loggedInUser = getLoggedInUser();
        Optional<AnnounceDto> announce = announceService.getAnnounceById(id);
        return announce.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AnnounceDto> createAnnounce(@RequestBody AnnounceDto announceDto) {
        AnnounceDto createdAnnounce = announceService.createAnnounce(announceDto);
        return ResponseEntity.status(201).body(createdAnnounce);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnounceDto> updateAnnounce(@PathVariable Integer id, @RequestBody AnnounceDto announceDto) {
        Optional<AnnounceDto> updatedAnnounce = announceService.updateAnnounce(id, announceDto);
        return updatedAnnounce.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnounce(@PathVariable Integer id) {
        announceService.deleteAnnounce(id);
        return ResponseEntity.noContent().build();
    }
}
