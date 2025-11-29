package dev.project.Todo_Application.controller;

import dev.project.Todo_Application.models.User;
import dev.project.Todo_Application.repository.UserRepository;
import dev.project.Todo_Application.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtil jwtUtil;
    //Simple test endpoint
  // @GetMapping("/test")
   //public String test() {
       //return "Auth endpoint working!";
   //}
   // }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            // Check if user already exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "User already exists",
                        "status", "error"
                ));
            }

            // Create new user
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));

            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful",
                    "userId", savedUser.getId(),
                    "status", "success"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Registration failed",
                    "error", e.getMessage(),
                    "status", "error"
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "User not found",
                        "status", "error"
                ));
            }

            User user = userOptional.get();

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Invalid password",
                        "status", "error"
                ));
            }

            // Generate JWT token instead of simple token
            String token = JWTUtil.generateToken(email);

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "userId", user.getId(),
                    "status", "success"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Login failed",
                    "error", e.getMessage(),
                    "status", "error"
            ));
        }
    }
}