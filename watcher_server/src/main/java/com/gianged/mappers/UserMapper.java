package com.gianged.mappers;

import com.gianged.models.User;
import com.gianged.dto.LoginDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    LoginDto userToLoginDto(User user);

    User loginDtoToUser(LoginDto loginDto);
}
