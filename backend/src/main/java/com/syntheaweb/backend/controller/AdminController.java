package com.syntheaweb.backend.controller;

import com.syntheaweb.backend.dto.PasswordUpdateRequest;
import com.syntheaweb.backend.dto.RoleUpdateRequest;
import com.syntheaweb.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for admin operations like managing users, roles, and passwords
 */
@RestController 
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    /**
     * Constructor for AdminController.
     *
     * @param userService Service to manage user operations.
     */
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id the UUID of the user to delete.
     * @return a response entity returning success or failure
     */
    @DeleteMapping("/users/{id}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * Updates a user's password.
     *
     * @param id      the UUID of the user.
     * @param request contains the new password
     * @return a response entity returning success or failure
     */
    @PutMapping("/users/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable UUID id, @RequestBody PasswordUpdateRequest request) {
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password must not be empty.");
        }

        try {
            userService.resetPassword(id, request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * Updates a user's role.
     *
     * @param id      the UUID of the user.
     * @param request contains the new role
     * @return a response entity returning success or failure
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable UUID id, @RequestBody RoleUpdateRequest request) {
        if (request.getRole() == null || request.getRole().isBlank()) {
            return ResponseEntity.badRequest().body("Role must not be empty.");
        }

        if (!(request.getRole().equalsIgnoreCase("ADMIN") || request.getRole().equalsIgnoreCase("USER"))) {
            return ResponseEntity.badRequest().body("Invalid role specified.");
        }

        try {
            userService.updateUserRole(id, request.getRole());
            return ResponseEntity.ok("User role updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * Get all users from the database
     *
     * @return the list of all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<?>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
