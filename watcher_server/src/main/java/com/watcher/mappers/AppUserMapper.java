package com.watcher.mappers;

import com.watcher.dto.AppUserDto;
import com.watcher.dto.AuthenticateDto;
import com.watcher.models.AppUser;
import org.mapstruct.*;

import java.util.Base64;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
public interface AppUserMapper {

    @Mapping(source = "departmentId", target = "department.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    AppUser toEntityFromUserDto(AppUserDto userDto);

    @Mapping(source = "departmentId", target = "department.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(source = "profilePictureBase64", target = "profilePicture")
    AppUser toEntityFromAuthenticateDto(AuthenticateDto authenticateDto);

    @InheritInverseConfiguration(name = "toEntityFromUserDto")
    AppUserDto toAppUserDto(AppUser user);

    @InheritInverseConfiguration(name = "toEntityFromAuthenticateDto")
    @Mapping(source = "profilePicture", target = "profilePictureBase64")
    AuthenticateDto toAuthenticateDto(AppUser user);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdateAppUserFromAppUserDto(AppUserDto userDto, @MappingTarget AppUser user);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdateAppUserFromAuthenticateDto(AuthenticateDto authenticateDto, @MappingTarget AppUser user);

    default String mapBlobToBase64(byte[] blob) {
        return blob != null ? Base64.getEncoder().encodeToString(blob) : null;
    }

    default byte[] mapBase64ToBlob(String base64) {
        return base64 != null ? Base64.getDecoder().decode(base64) : null;
    }
}
