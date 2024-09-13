package com.watcher.mappers;

import com.watcher.dto.AuthenticateDto;
import com.watcher.dto.UserDto;
import com.watcher.models.User;
import org.mapstruct.*;

/**
 * Maps between {@link User} and {@link UserDto}.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "departmentId", target = "department.id")
    @Mapping(source = "roleId", target = "role.id")
    User toEntityFromUserDto(UserDto userDto);

    @Mapping(source = "roleId", target = "role.id")
    @Mapping(source = "departmentId", target = "department.id")
    User toEntityFromAuthenticateDto(AuthenticateDto authenticateDto);

    @InheritInverseConfiguration(name = "toEntityFromUserDto")
    UserDto toUserDto(User user);

    @InheritInverseConfiguration(name = "toEntityFromAuthenticateDto")
    AuthenticateDto toAuthenticateDto(User user);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdateUserFromUserDto(UserDto userDto, @MappingTarget User user);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdateUserFromAuthenticateDto(AuthenticateDto authenticateDto, @MappingTarget User user);
}
