package com.bus.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendOtp(String phone, String otp) {
        System.out.println("OTP sent to " + phone + ": " + otp);
    }
}
