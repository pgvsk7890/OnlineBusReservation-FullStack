package com.bus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    public String uploadImage(MultipartFile file) throws IOException {
        String url = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        body.add("api_key", apiKey);
        body.add("timestamp", String.valueOf(System.currentTimeMillis() / 1000));
        body.add("folder", "bus-booking");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        String signature = generateSignature();
        body.add("signature", signature);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(url, requestEntity, Map.class);

        if (response != null && response.get("secure_url") != null) {
            return response.get("secure_url").toString();
        }
        throw new IOException("Failed to upload image to Cloudinary");
    }

    private String generateSignature() {
        try {
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String signature = "folder=bus-booking&timestamp=" + timestamp + apiSecret;
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-1");
            byte[] hash = md.digest(signature.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate signature", e);
        }
    }
}
