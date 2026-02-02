package com.syntheaweb.backend.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.zip.ZipOutputStream;
import java.util.zip.ZipEntry;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.syntheaweb.backend.dto.SyntheaApiResponse;
import com.syntheaweb.backend.dto.SyntheaParameterBody;
import com.syntheaweb.backend.service.SyntheaService;
import com.syntheaweb.backend.database.repository.RunRepository;
import com.syntheaweb.backend.database.repository.UserRepository;
import com.syntheaweb.backend.database.repository.PatientRepository;
import com.syntheaweb.backend.database.entity.Run;
import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.service.StorageService;
import com.syntheaweb.backend.database.entity.Patient;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Controller for handling requests related to Synthea data generation and downloading
 */
@RestController
@RequestMapping("/api/synthea")
public class SyntheaController {


    @Autowired
    private StorageService storageService;

    @Autowired
    private SyntheaService syntheaService;

    @Autowired
    private RunRepository runRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Generates synthetic patient data based on the provided parameters
     *
     * @param requestBody The parameters for the synthetic data to be generated.
     * @return ResponseEntity containing a success message and the generated run ID, or an error message if the process fails.
     */
    @PostMapping("/generate")
    public ResponseEntity<SyntheaApiResponse> generateSyntheticData(@RequestBody SyntheaParameterBody requestBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new SyntheaApiResponse("User not authenticated!", null));
        }

        // Fixed: need to save the run here first with runId for concurrency to work

        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        final String runId = UUID.randomUUID().toString();

        try {
            Run run = new Run();
            run.setRunId(runId);
            run.setUser(currentUser);
            run.setCreatedAt(LocalDateTime.now());
            run.setPopulationSize(requestBody.getPopulationSize());
            run.setGender(requestBody.getGender());
            run.setMinAge(requestBody.getMinAge());
            run.setMaxAge(requestBody.getMaxAge());
            run.setState(requestBody.getState());
            run.setCity(requestBody.getCity());

            runRepository.save(run);

            // Generate and return the generated run ID
            syntheaService.generateSyntheticData(
                    runId,
                    requestBody.getPopulationSize(),
                    requestBody.getGender(),
                    requestBody.getMinAge(),
                    requestBody.getMaxAge(),
                    requestBody.getState(),
                    requestBody.getCity()
            );
            syntheaService.parseAndPersistPatients(runId, run);
            return ResponseEntity.ok(new SyntheaApiResponse("Generating was successful!", runId));
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new SyntheaApiResponse("Error while generating: " + e.getMessage(), null));
        }
    }

    @GetMapping("/download")
    public void downloadFullRun(@RequestParam String runID, @RequestParam String format, HttpServletResponse response) throws IOException {
        downloadSelectedPatients(runID, format, null, response);
    }

    @GetMapping("/downloadSelected")
    public void downloadSelectedPatients(
            @RequestParam(name = "runID") String runID,
            @RequestParam(name = "format") String format,
            @RequestParam(name = "patientIds") List<String> patientIds,
            HttpServletResponse response
    ) throws IOException {
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=\"run_" + runID + ".zip\"");

        Set<String> targetIds = (patientIds != null) ? new HashSet<>(patientIds) : null;

        try (ZipOutputStream zos = new ZipOutputStream(response.getOutputStream())) {
            storageService.addRunToZipStream(zos, runID, format, targetIds);
        }
    }
}
