package com.watcher.mappers;

import com.watcher.models.User;
import com.watcher.dto.LoginDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    LoginDto userToLoginDto(User user);

    User loginDtoToUser(LoginDto loginDto);
}
