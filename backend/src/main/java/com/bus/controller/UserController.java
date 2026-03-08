package com.bus.controller;

import com.bus.entity.User;
import com.bus.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {


    @Autowired
    private UserService userService;

    // Get user profile
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id){
        validateUserAccess(id);
        return userService.getUserById(id);
    }

    // Update profile
    @PutMapping("/update/{id}")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser
    ){
        validateUserAccess(id);
        return userService.updateProfile(id, updatedUser);
    }

    @PostMapping("/upload/{id}")
    public User uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        validateUserAccess(id);

        String uploadDir = "uploads/";

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        java.nio.file.Path path =
                java.nio.file.Paths.get(uploadDir + fileName);

        java.nio.file.Files.copy(file.getInputStream(), path);

        User user = userService.getUserById(id);

        user.setProfileImage(fileName);

        return userService.save(user);
    }

    @PostMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwords
    ) {
        validateUserAccess(id);
        try {
            String currentPassword = passwords.get("currentPassword");
            String newPassword = passwords.get("newPassword");
            
            userService.changePassword(id, currentPassword, newPassword);
            
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private void validateUserAccess(Long requestedUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        User currentUser = (User) authentication.getPrincipal();
        boolean isAdmin = "ADMIN".equals(currentUser.getRole());
        boolean isOwnProfile = currentUser.getId().equals(requestedUserId);

        if (!isAdmin && !isOwnProfile) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }

}
