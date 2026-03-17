package com.syntheaweb.backend.service;

import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.database.repository.RunRepository;
import com.syntheaweb.backend.database.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.security.Principal;

/**
 * Service for handling user-related operations, including authentication, registration, and administrative tasks.
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RunRepository runRepository;
    private final SyntheaService syntheaService;


    /**
     * Constructor for UserService.
     *
     * @param userRepository   Repository for accessing user data.
     * @param jwtUtil          Utility class for handling JWT operations.
     * @param passwordEncoder  Utility for encrypting user passwords.
     * @param runRepository    Repository for managing generated runs.
     * @param syntheaService   Service responsible for handling Synthea operations.
     */
    public UserService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder, RunRepository runRepository, SyntheaService syntheaService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.runRepository = runRepository;
        this.syntheaService = syntheaService;
    }

    /**
     * Extracts the JWT token from the Authorization header.
     *
     * @param authorizationHeader The Authorization header.
     * @return The extracted token, or null if the header is invalid.
     */
    public String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        return authorizationHeader.substring(7);
    }


    /**
     * Loads a user by their username for Spring Security authentication.
     *
     * @param username The username to search for.
     * @return A UserDetails object containing the user's authentication information.
     * @throws UsernameNotFoundException If the user is not found.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    /**
     * Registers a new user if the username is not already taken.
     * The first registered user is assigned an admin role, others get a user role.
     *
     * @param user The user object containing registration details.
     * @return A JWT token for the registered user.
     * @throws IllegalArgumentException If the username already exists.
     */
    public String registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }

        // Hash the user's password for secure storage.
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign the role. The first user is an admin, others are regular users.
        if (userRepository.count() == 0) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        // Save the user to the database and return a JWT token.
        userRepository.save(user);
        return jwtUtil.generateToken(user.getUsername());
    }


    /**
     * Authenticates a user by verifying their username and password.
     *
     * @param username The user's username.
     * @param password The user's raw password.
     * @return A map containing the JWT token, username, and role.
     * @throws IllegalArgumentException If the username or password is incorrect.
     */
    public Map<String, String> loginUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty() || !passwordEncoder.matches(password, userOptional.get().getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        User user = userOptional.get();
        String token = jwtUtil.generateToken(user.getUsername());

        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole()
        );
    }

    /**
     * Validates a JWT token and retrieves the associated user.
     *
     * @param token The JWT token to validate.
     * @return An Optional containing the authenticated user, or empty if the token is invalid.
     */
    public Optional<User> validateTokenAndGetUser(String token) {
        String username = jwtUtil.extractUsername(token);
        if (jwtUtil.validateToken(token, username)) {
            return findByUsername(username);
        }
        return Optional.empty();
    }

    /**
     * Finds a user by their username.
     *
     * @param username The username to search for.
     * @return An Optional containing the user if found.
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Retrieves a list of all users in the system.
     *
     * @return A list of all users.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Deletes a user by their ID with all their generated runs.
     *
     * @param id The UUID of the user to delete.
     * @throws IllegalArgumentException If the user does not exist.
     */
    @Transactional
    public void deleteUserById(UUID id) {

        User user = getUserById(id);

        // Delete all files associated with the user's runs
        runRepository.findByUser(user).forEach(run -> {
            syntheaService.deleteRunFiles(run.getRunId());
        });

        // Remove all runs before deleting the user
        runRepository.deleteByUser(user);
        userRepository.deleteById(id);
    }

    /**
     * Updates a user's role.
     *
     * @param id      The UUID of the user.
     * @param newRole The new role to assign to the user.
     * @throws IllegalArgumentException If the user does not exist.
     */
    public void updateUserRole(UUID id, String newRole) {

        User user = getUserById(id);
        user.setRole(newRole.toUpperCase());
        userRepository.save(user);
    }

    /**
     * Resets the password for a specific user.
     *
     * @param id          The UUID of the user.
     * @param newPassword The new raw password (to be hashed).
     * @throws IllegalArgumentException If the user does not exist.
     */
    public void resetPassword(UUID id, String newPassword) {

        User user = getUserById(id);
        user.setPassword(passwordEncoder.encode(newPassword)); // Hash the new password
        userRepository.save(user);
    }

    // Helper method for retrieving a user from database
    private User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    public User getUserByPrincipal(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Principal is null. User is not authenticated.");
        }
        String username = principal.getName();

        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
