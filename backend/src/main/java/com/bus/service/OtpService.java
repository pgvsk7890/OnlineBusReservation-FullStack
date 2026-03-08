package com.bus.service;

import com.bus.config.JwtUtil;
import com.bus.entity.User;
import com.bus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    private static final long OTP_VALIDITY = 5;

    public String sendOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        
        if (user == null) {
            throw new RuntimeException("User not found with email: " + normalizedEmail);
        }

        String otp = generateOtp();
        
        otpStore.put(normalizedEmail, new OtpData(otp, System.currentTimeMillis()));
        
        // Send OTP via email
        try {
            emailService.sendOtpEmail(user.getEmail(), otp, user.getName());
        } catch (Exception e) {
            System.out.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email");
        }
        
        return "OTP sent successfully to your email";
    }

    public Map<String, Object> verifyOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedOtp = otp == null ? "" : otp.trim();

        OtpData otpData = otpStore.get(normalizedEmail);
        
        if (otpData == null) {
            throw new RuntimeException("OTP not sent or expired");
        }

        long currentTime = System.currentTimeMillis();
        long otpTime = otpData.getTimestamp();
        long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(currentTime - otpTime);

        if (diffInMinutes >= OTP_VALIDITY) {
            otpStore.remove(normalizedEmail);
            throw new RuntimeException("OTP expired");
        }

        if (!otpData.getOtp().equals(normalizedOtp)) {
            throw new RuntimeException("Invalid OTP");
        }

        otpStore.remove(normalizedEmail);
        
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found for OTP verification");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);

        return response;
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        return email.trim().toLowerCase();
    }

    private static class OtpData {
        private final String otp;
        private final long timestamp;

        public OtpData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }

        public String getOtp() {
            return otp;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}
