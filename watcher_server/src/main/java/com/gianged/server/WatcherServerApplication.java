package com.gianged.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.gianged.repositories")
@EntityScan(basePackages = "com.gianged.models")
@ComponentScan(basePackages = {"com.gianged"})
public class WatcherServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WatcherServerApplication.class, args);
    }
}
