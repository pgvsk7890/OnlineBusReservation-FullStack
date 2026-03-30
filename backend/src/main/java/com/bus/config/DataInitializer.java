package com.bus.config;

import com.bus.entity.User;
import com.bus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.findByEmail("pgvsaikumar7890@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setName("Sai Kumar");
                admin.setEmail("pgvsaikumar7890@gmail.com");
                admin.setPhone("7013147368");
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Admin user created with BCrypt encoded password");
            }
        };
    }
}
