package com.syntheaweb.backend.controller;

import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for managing user endpoints.
 * Handles registration, login, and authentication status
 */
@RestController
@RequestMapping("/api/user") 
public class UserController {

    private final UserService userService;

    /**
     * Constructor for UserController.
     *
     * @param userService Service to manage user operations
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * handles user registration requests
     *
     * @param user the user object with registration details
     * @return A response containing the JWT token and user details, or an error message if registration fails.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            String token = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "token", token,
                    "username", user.getUsername(),
                    "role", user.getRole()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    /**
     * handles user login requests
     *
     * @param user the user object with login credentials
     * @return A response containing the JWT token and user details, or an error message if login fails.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            Map<String, String> authData = userService.loginUser(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(authData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Checks the authentication status of a user based on the provided token
     *
     * @param authorizationHeader The Authorization header containing the JWT token.
     * @return A response returning if the user is authenticated
     */
    @GetMapping("/status")
    public ResponseEntity<?> checkAuthStatus(@RequestHeader("Authorization") String authorizationHeader) {
        String token = userService.extractToken(authorizationHeader);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token.");
        }

        return userService.validateTokenAndGetUser(token)
                .map(user -> ResponseEntity.ok(Map.of(
                        "authenticated", true,
                        "username", user.getUsername(),
                        "role", user.getRole()
                )))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
