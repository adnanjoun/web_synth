package com.syntheaweb.backend.controller;

import com.syntheaweb.backend.database.entity.FavoritePatient;
import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.database.repository.FavoritePatientRepository;
import com.syntheaweb.backend.dto.PatientDto;
import com.syntheaweb.backend.service.UserService;
import com.syntheaweb.backend.service.StorageService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoritePatientRepository favoriteRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private StorageService storageService;

    public record FavoriteRequest(String runId, String patientId) {}

    @PostMapping("/save")
    public ResponseEntity<?> saveFavorites(@RequestBody List<FavoriteRequest> requests, Principal principal) {
        final User user = userService.getUserByPrincipal(principal);
        int savedCount = 0;

        for (FavoriteRequest req : requests) {
            if (!favoriteRepo.existsByUserAndOriginalRunIdAndPatientId(user, req.runId(), req.patientId())) {

                final FavoritePatient fp = new FavoritePatient(
                        user,
                        req.runId(),
                        req.patientId()
                );
                favoriteRepo.save(fp);
                savedCount++;
            }
        }
        return ResponseEntity.ok(savedCount + " favorites saved successfully.");
    }

    @GetMapping
    public List<PatientDto> getFavorites(Principal principal) {
        final User user = userService.getUserByPrincipal(principal);
        return favoriteRepo.findFavoriteDetailsByUser(user);
    }

    @DeleteMapping("/run/{runId}")
    public ResponseEntity<?> deleteFavoritesByRun(@PathVariable String runId, Principal principal) {
        final User user = userService.getUserByPrincipal(principal);
        favoriteRepo.deleteByUserAndOriginalRunId(user, runId);
        return ResponseEntity.ok("Favorites for run " + runId + " deleted.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFavorite(@PathVariable Long id, Principal principal) {
        final User user = userService.getUserByPrincipal(principal);

        return favoriteRepo.findById(id)
                .map(fav -> {
                    if (fav.getUser().getId().equals(user.getId())) {
                        favoriteRepo.delete(fav);
                        return ResponseEntity.ok("Favorite deleted successfully.");
                    } else {
                        return ResponseEntity.status(403).body("You are not authorized to delete this favorite.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/download")
    public void downloadFavorites(
            @RequestParam String format,
            @RequestParam(required = false) List<Long> ids,
            HttpServletResponse response,
            Principal principal
    ) throws IOException {
        User user = userService.getUserByPrincipal(principal);
        List<FavoritePatient> favorites = (ids != null && !ids.isEmpty())
                ? favoriteRepo.findByUserAndIdIn(user, ids)
                : favoriteRepo.findByUser(user);

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=\"favorites_" + format + ".zip\"");


        Map<String, List<FavoritePatient>> favoritesByRun = favorites.stream()
                .collect(Collectors.groupingBy(FavoritePatient::getOriginalRunId));

        try (ZipOutputStream zos = new ZipOutputStream(response.getOutputStream())) {
            for (Map.Entry<String, List<FavoritePatient>> entry : favoritesByRun.entrySet()) {
                final String runId = entry.getKey();
                final Set<String> patientIds = entry.getValue().stream()
                        .map(FavoritePatient::getPatientId)
                        .collect(Collectors.toSet());

                storageService.addRunToZipStream(zos, runId, format, patientIds);
            }
        }
    }
}