package com.watcher.controllers;

import com.watcher.dto.AnnounceDto;
import com.watcher.services.AnnounceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<List<AnnounceDto>> getAllAnnounces() {
        List<AnnounceDto> announces = announceService.getAllAnnounces();
        return ResponseEntity.ok(announces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnounceDto> getAnnounceById(@PathVariable Integer id) {
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
