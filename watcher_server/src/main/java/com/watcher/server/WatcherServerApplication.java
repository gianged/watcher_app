package com.watcher.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.watcher.repositories")
@EntityScan(basePackages = "com.watcher.models")
@ComponentScan(basePackages = {"com.watcher"})
public class WatcherServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WatcherServerApplication.class, args);
    }
}
