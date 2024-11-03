package com.watcher.services;

import com.watcher.dto.AnnounceDto;
import com.watcher.mappers.AnnounceMapper;
import com.watcher.models.Announce;
import com.watcher.models.Department;
import com.watcher.repositories.AnnounceRepository;
import com.watcher.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnnounceService {

    private final AnnounceRepository announceRepository;
    private final AnnounceMapper announceMapper;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public AnnounceService(AnnounceRepository announceRepository, AnnounceMapper announceMapper, DepartmentRepository departmentRepository) {
        this.announceRepository = announceRepository;
        this.announceMapper = announceMapper;
        this.departmentRepository = departmentRepository;
    }

    public List<AnnounceDto> getAllAnnounces(Sort sort) {
        return announceRepository.findAll(sort).stream()
                .map(announceMapper::toAnnounceDto)
                .collect(Collectors.toList());
    }

    public Page<AnnounceDto> getPagedAnnounces(Pageable pageable) {
        return announceRepository.findAll(pageable).map(announceMapper::toAnnounceDto);
    }

    public List<AnnounceDto> searchAnnouncesByContent(String content, Sort sort) {
        return announceRepository.findAllByContentContainingIgnoreCase(content, sort).stream()
                .map(announceMapper::toAnnounceDto)
                .collect(Collectors.toList());
    }

    public Page<AnnounceDto> searchPagedAnnouncesByContent(String content, Pageable pageable) {
        return announceRepository.findAllByContentContainingIgnoreCase(content, pageable).map(announceMapper::toAnnounceDto);
    }

    public Optional<AnnounceDto> getAnnounceById(Integer id) {
        return announceRepository.findById(id)
                .map(announceMapper::toAnnounceDto);
    }

    //TODO: add a separate method to get announces by department id

    public AnnounceDto createAnnounce(AnnounceDto announceDto) {
        Announce announce = announceMapper.toEntityFromAnnounceDto(announceDto);
        if (announceDto.departmentId() != null) {
            Department department = departmentRepository.findById(announceDto.departmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found for id: " + announceDto.departmentId()));
            announce.setDepartment(department);
        } else {
            announce.setDepartment(null);
        }
        Announce savedAnnounce = announceRepository.save(announce);
        return announceMapper.toAnnounceDto(savedAnnounce);
    }

    public Optional<AnnounceDto> updateAnnounce(Integer id, AnnounceDto announceDto) {
        return announceRepository.findById(id)
                .map(existingAnnounce -> {
                    if (announceDto.departmentId() != null) {
                        Department newDepartment = departmentRepository.findById(announceDto.departmentId())
                                .orElseThrow(() -> new RuntimeException("Department not found for id: " + announceDto.departmentId()));
                        existingAnnounce.setDepartment(newDepartment);
                    } else {
                        existingAnnounce.setDepartment(null);
                    }

                    announceMapper.partialUpdateAnnounceFromAnnounceDto(announceDto, existingAnnounce);
                    Announce updatedAnnounce = announceRepository.save(existingAnnounce);
                    return announceMapper.toAnnounceDto(updatedAnnounce);
                });
    }

    public List<AnnounceDto> getAnnouncesByDepartment(Integer departmentId) {
        return announceRepository.findByDepartment_Id(departmentId).stream()
                .map(announceMapper::toAnnounceDto)
                .collect(Collectors.toList());
    }

    public List<AnnounceDto> getAnnouncesByDepartmentIncludingPublic(Integer departmentId) {
        return announceRepository.findByDepartment_IdOrDepartmentIsNullAndIsPublicTrue(departmentId).stream()
                .map(announceMapper::toAnnounceDto)
                .collect(Collectors.toList());
    }

    public void deleteAnnounce(Integer id) {
        announceRepository.deleteById(id);
    }
}
