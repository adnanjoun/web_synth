package com.syntheaweb.backend.service;

import com.syntheaweb.backend.database.entity.Run;
import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.database.repository.RunRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing Runs, including retrieval, creation, deletion, and ownership checks.
 */
@Service
public class RunService {

    private final RunRepository runRepository;
    private final SyntheaService syntheaService;

    public RunService(RunRepository runRepository, SyntheaService syntheaService) {
        this.runRepository = runRepository;
        this.syntheaService = syntheaService;
    }

    /**
     * Retrieves all runs associated with a specific user.
     *
     * @param user The user whose runs are to be retrieved.
     * @return A list of Runs for the specified user.
     */
    public List<Run> getRunsByUser(User user) {
        return runRepository.findByUser(user);
    }

    /**
     * Retrieves all runs in the system, including their associated users.
     *
     * @return A list of all Runs in the system.
     */
    public List<Run> getAllRuns() {
        return runRepository.findAllWithUsers();
    }

    /**
     * Retrieves a specific run by its ID.
     *
     * @param runId The ID of the run to retrieve.
     * @return An Optional containing the Run if found, or empty otherwise.
     */
    public Optional<Run> getRunById(String runId) {
        return runRepository.findById(runId);
    }

    /**
     * Saves a new run for the specified user.
     *
     * @param run  The run to be saved.
     * @param user The user associated with the run.
     */
    public void saveRun(Run run, User user) {
        run.setUser(user);
        run.setCreatedAt(LocalDateTime.now());
        runRepository.save(run);
    }

    /**
     * Deletes a specific run by its ID, including its associated files.
     *
     * @param runId The ID of the run to delete.
     * @return true if the run was deleted successfully, false if it was not found.
     */
    public boolean deleteRun(String runId) {
        return runRepository.findById(runId).map(run -> {
            runRepository.deleteById(runId);
            syntheaService.deleteRunFiles(runId);
            return true;
        }).orElse(false);
    }

    /**
     * Checks if a specific user is the owner of a given run.
     *
     * @param runId The ID of the run to check.
     * @param user  The user to check against.
     * @return true if the user is the owner of the run, false otherwise.
     */
    public boolean isRunOwner(String runId, User user) {
        return runRepository.findById(runId)
                .map(run -> run.getUser().getId().equals(user.getId()))
                .orElse(false);
    }
}
