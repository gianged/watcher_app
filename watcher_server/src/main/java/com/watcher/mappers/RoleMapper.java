package com.watcher.mappers;

import com.watcher.dto.RoleDto;
import com.watcher.models.Role;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface RoleMapper {

    Role toEntityFromRoleDto(RoleDto roleDto);

    RoleDto toRoleDto(Role role);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(RoleDto roleDto, @MappingTarget Role role);
}