package com.bus.service;

import com.bus.entity.User;
import com.bus.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;

    // Get user by ID
    public User getUserById(Long id){

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }

    // Update profile
    public User updateProfile(Long id, User updatedUser){

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update name
        user.setName(updatedUser.getName());

        // update email and phone
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhone() != null) {
            user.setPhone(updatedUser.getPhone());
        }

        return userRepository.save(user);
    }

    public User save(User user){
        return userRepository.save(user);
    }

    // Change password
    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
    }

}
