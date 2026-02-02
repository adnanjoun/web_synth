package com.syntheaweb.backend.database.repository;

import com.syntheaweb.backend.database.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing Users in the database.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    /**
     * Finds a user by their username in the database
     *
     * @param username the username to search for
     * @return an Optional returning the user if found
     */
    Optional<User> findByUsername(String username);


    /** 
     * Deletes a user by their ID
     *
     * @param id the UUID of the user to delete
     */
    void deleteById(@NonNull UUID id);


}
