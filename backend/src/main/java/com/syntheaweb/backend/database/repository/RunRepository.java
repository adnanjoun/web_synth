package com.syntheaweb.backend.database.repository;

import java.util.List;
import java.util.UUID;

import com.syntheaweb.backend.database.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.syntheaweb.backend.database.entity.Run;

/**
 * Repository interface for managing Runs in the database.
 */
@Repository
public interface RunRepository extends JpaRepository<Run, String> {

    /**
     * Finds all runs for a specific user.
     *
     * @param user The user whose runs are requested
     * @return A list of runs for the specified user.
     */
    List<Run> findByUser(User user); 

    /**
     * Get all runs with their users
     *
     * @return A list of all runs, including user details.
     */
    @Query("SELECT r FROM Run r JOIN FETCH r.user")
    List<Run> findAllWithUsers();

    /**
     * Deletes all runs of a specific user
     *
     * @param user The user whose runs should be deleted
     */
    void deleteByUser(User user);

}
