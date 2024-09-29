package com.watcher.config;

import com.watcher.mappers.AppUserMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public AppUserMapper userMapper() {
        return Mappers.getMapper(AppUserMapper.class);
    }
}
