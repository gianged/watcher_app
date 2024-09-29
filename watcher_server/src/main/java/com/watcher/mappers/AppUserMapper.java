package com.watcher.mappers;

import com.watcher.dto.AppUserDto;
import com.watcher.dto.AuthenticateDto;
import com.watcher.models.AppUser;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface AppUserMapper {

    @Mapping(source = "departmentId", target = "department.id")
    AppUser toEntityFromUserDto(AppUserDto userDto);

    @Mapping(source = "departmentId", target = "department.id")
    AppUser toEntityFromAuthenticateDto(AuthenticateDto authenticateDto);

    @InheritInverseConfiguration(name = "toEntityFromUserDto")
    AppUserDto toAppUserDto(AppUser user);

    @InheritInverseConfiguration(name = "toEntityFromAuthenticateDto")
    AuthenticateDto toAuthenticateDto(AppUser user);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdateAppUserFromAppUserDto(AppUserDto userDto, @MappingTarget AppUser user);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdateAppUserFromAuthenticateDto(AuthenticateDto authenticateDto, @MappingTarget AppUser user);
}
