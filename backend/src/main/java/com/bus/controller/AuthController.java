package com.bus.controller;

import com.bus.dto.LoginRequest;
import com.bus.dto.OtpRequest;
import com.bus.dto.RegisterRequest;
import com.bus.entity.User;
import com.bus.service.AuthService;
import com.bus.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request){
        return authService.login(request);
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody OtpRequest request){
        return otpService.sendOtp(request.getEmail());
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody OtpRequest request){
        return otpService.verifyOtp(request.getEmail(), request.getOtp());
    }

}
