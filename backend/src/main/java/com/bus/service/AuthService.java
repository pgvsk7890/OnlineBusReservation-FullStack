package com.bus.service;

import com.bus.config.JwtUtil;
import com.bus.dto.LoginRequest;
import com.bus.dto.RegisterRequest;
import com.bus.entity.User;
import com.bus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> register(RegisterRequest request){

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("user", savedUser);
        response.put("token", token);

        return response;
    }

    public Map<String, Object> login(LoginRequest request){

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if(user.isPresent() && passwordEncoder.matches(request.getPassword(), user.get().getPassword())){
            String token = jwtUtil.generateToken(user.get().getEmail(), user.get().getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("user", user.get());
            response.put("token", token);

            return response;
        }

        throw new RuntimeException("Invalid Email or Password");

    }

}
