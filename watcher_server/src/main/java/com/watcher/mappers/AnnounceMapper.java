package com.watcher.mappers;

import com.watcher.dto.AnnounceDto;
import com.watcher.models.Announce;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface AnnounceMapper {
    @Mapping(source = "departmentId", target = "department.id")
    Announce toEntityFromAnnounceDto(AnnounceDto announceDto);

    @Mapping(source = "department.id", target = "departmentId")
    AnnounceDto toAnnounceDto(Announce announce);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "departmentId", target = "department.id", ignore = true)
    Announce partialUpdateAnnounceFromAnnounceDto(AnnounceDto announceDto, @MappingTarget Announce announce);
}