package com.syntheaweb.backend.controller;

import com.syntheaweb.backend.database.entity.Run;
import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.database.repository.UserRepository;
import com.syntheaweb.backend.service.JwtUtil;
import com.syntheaweb.backend.service.RunService;
import com.syntheaweb.backend.service.StorageService;
import com.syntheaweb.backend.dto.PatientDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.syntheaweb.backend.database.entity.Patient;
import com.syntheaweb.backend.service.StorageService;

import java.util.List;
import java.util.Optional;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;


import java.io.*;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Objects;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.syntheaweb.backend.database.repository.PatientRepository;
import com.syntheaweb.backend.database.repository.RunRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.Collections;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.syntheaweb.backend.dto.PatientDto;

import org.springframework.stereotype.Service;

/**
 * Controller for managing synthetic data runs
 */
@RestController
@RequestMapping("/api/runs")
public class RunController {

    private static final String ROLE_ADMIN = "ADMIN";

    private final RunService runService;
    private final RunRepository runRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final JwtUtil jwtUtil;


    @Autowired
    private StorageService storageService;


    @Autowired
    public RunController(RunService runService,
                         RunRepository runRepository,
                         UserRepository userRepository,
                         PatientRepository patientRepository,
                         JwtUtil jwtUtil) {
        this.runService = runService;
        this.runRepository = runRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * get all runs associated with the authenticated user
     *
     * @param token The JWT token provided in the Authorization header.
     * @return ResponseEntity containing the list of runs for the user, or an error status
     */
    @GetMapping
    public ResponseEntity<List<Run>> getUserRuns(@RequestHeader("Authorization") String token) {
        return getAuthenticatedUser(token)
                .map(user -> ResponseEntity.ok(runService.getRunsByUser(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    /**
     * get all runs in the system (as admin).
     *
     * @param token The JWT token provided in the Authorization header.
     * @return ResponseEntity containing the list of all runs, or an error status
     */
    @GetMapping("/admin")
    public ResponseEntity<List<Run>> getAllRuns(@RequestHeader("Authorization") String token) {
        return getAuthenticatedUser(token)
                .filter(user -> ROLE_ADMIN.equals(user.getRole()))
                .map(user -> ResponseEntity.ok(runService.getAllRuns()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    /**
     * Deletes a run by its ID
     *
     * @param runId The ID of the run to delete
     * @param token The JWT token provided in the Authorization header.
     * @return ResponseEntity returning the result of the delete operation
     */
    @DeleteMapping("/delete/{runId}")
    public ResponseEntity<Void> deleteRun(@PathVariable String runId, @RequestHeader("Authorization") String token) {
        Optional<User> authenticatedUser = getAuthenticatedUser(token);

        if (authenticatedUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = authenticatedUser.get();

        if (!ROLE_ADMIN.equals(user.getRole()) && !runService.isRunOwner(runId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean deleted = runService.deleteRun(runId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    /**
     * Extracts the authenticated user from the provided JWT token
     *
     * @param token The JWT token provided in the Authorization header.
     * @return An Optional containing the authenticated user, or empty if user not found
     */
    private Optional<User> getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", "").trim());
        return userRepository.findByUsername(username);
    }

    @GetMapping("/patients")
    public ResponseEntity<Page<PatientDto>> getPatientsByRunId(
            @RequestParam(name = "runId") String runId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageSize", defaultValue = "50") int pageSize
    ) {
        final Pageable pageable = PageRequest.of(page, pageSize);
        final Page<Patient> patientPage = patientRepository.findByRun_RunId(runId, pageable);
        final Page<PatientDto> dtoPage = patientPage.map(PatientDto::fromPatient);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/patient")
    public ResponseEntity<String> getPatientDetails(
            @RequestParam(name = "runId") String runId,
            @RequestParam(name = "patientId") String patientId
    ) {
        try {
            String content = storageService.readPatientFile(runId, patientId);
            if (content == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/locations")
    public ResponseEntity<List<String>> getRunLocations(@RequestParam(name = "runId") String runId) {
        List<String> locations = patientRepository.findDistinctLocationsByRunId(runId);
        return ResponseEntity.ok(locations);
    }
}

