package com.syntheaweb.backend.controller;

import com.syntheaweb.backend.database.entity.Patient;
import com.syntheaweb.backend.database.repository.PatientRepository;
import com.syntheaweb.backend.database.specification.PatientSpecifications;
import com.syntheaweb.backend.dto.PatientDto;
import com.syntheaweb.backend.dto.PatientsStatisticsDto;
import com.syntheaweb.backend.dto.PatientCountResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.syntheaweb.backend.service.StorageService;

import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    @Autowired
    private StorageService fileService;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/run/{runId}")
    public ResponseEntity<Page<PatientDto>> getPatientsByRunId(
            @PathVariable String runId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            HttpServletRequest request
    ) {
        Pageable pageable = PageRequest.of(page, size);

        final String[] locationArray = request.getParameterValues("locations");
        final List<String> locations = locationArray != null ? Arrays.asList(locationArray) : null;


        final Specification<Patient> spec = PatientSpecifications.withFilters(
                runId, name, gender, minAge, maxAge, locations
        );

        final Page<Patient> patientPage = patientRepository.findAll(spec, pageable);
        final Page<PatientDto> dtoPage = patientPage.map(this::convertToDto);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/run/{runId}/statistics")
    public ResponseEntity<PatientsStatisticsDto> getRunStatistics(
            @PathVariable String runId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            HttpServletRequest request
    ) {
        final String[] locationArray = request.getParameterValues("locations");
        final List<String> locations = locationArray != null ? Arrays.asList(locationArray) : null;

        var counts = patientRepository.countStatistics(runId, name, gender, minAge, maxAge, locations);

        List<Object[]> ageDataRaw = patientRepository.countAgeDistribution(runId, name, gender, minAge, maxAge, locations);

        Map<Integer, Long> ageMap = new HashMap<>();
        for (Object[] row : ageDataRaw) {
            ageMap.put((Integer) row[0], (Long) row[1]);
        }

        final PatientsStatisticsDto stats = new PatientsStatisticsDto();
        stats.setPopulationSize((Long) counts.getTotal());
        stats.setMaleOccurenceCount((Long) counts.getMales());
        stats.setFemaleOccurenceCount((Long) counts.getFemales());
        stats.setAgeOccurenceData(ageMap);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/locations/{runId}")
    public ResponseEntity<List<String>> getRunLocations(@PathVariable String runId) {
        final List<String> locations = patientRepository.findDistinctLocationsByRunId(runId);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/details")
    public ResponseEntity<String> getPatientDetails(
            @RequestParam(name = "runId") String runId,
            @RequestParam(name = "patientId") String patientId
    ) {
        try {
            String content = fileService.readPatientFile(runId, patientId);
            if (content == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private PatientDto convertToDto(Patient entity) {
        PatientDto dto = new PatientDto();
        dto.setId(entity.getId());
        dto.setRunId(entity.getRun().getRunId());
        dto.setPatientId(entity.getPatientId());
        dto.setName(entity.getName());
        dto.setGender(entity.getGender());
        dto.setAge(entity.getAge());
        dto.setLocation(entity.getLocation());
        return dto;
    }
}