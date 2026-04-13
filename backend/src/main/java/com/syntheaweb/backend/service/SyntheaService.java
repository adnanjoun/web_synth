package com.syntheaweb.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.syntheaweb.backend.database.entity.Patient;
import com.syntheaweb.backend.database.entity.Run;
import com.syntheaweb.backend.database.entity.RunStatus;
import com.syntheaweb.backend.database.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.syntheaweb.backend.service.StorageService;
import org.springframework.scheduling.annotation.Async; 
import com.syntheaweb.backend.database.repository.RunRepository; 

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Optional;


@Service
public class SyntheaService {

    private static final String SYNTHEA_DIRECTORY = "/synthea/";

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private RunRepository runRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Async
    public void runFullGenerationProcess(Run run)  {
        try {
            runRepository.updateRunStatus(run.getRunId(), RunStatus.RUNNING);

            this.generateSyntheticData(
                run.getRunId(),
                run.getPopulationSize(),
                run.getGender(),
                run.getMinAge(),
                run.getMaxAge(),
                run.getState(),
                run.getCity()
            );

            this.parseAndPersistPatients(run.getRunId(), run);

            runRepository.updateRunStatus(run.getRunId(), RunStatus.SUCCESS);

        } catch (Throwable e) {
            runRepository.updateRunStatus(run.getRunId(), RunStatus.FAILED);
            e.printStackTrace();
        }
    }

    public void generateSyntheticData(String runId, Integer populationSize, String gender, Integer minAge, Integer maxAge, String state, String city) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder("./run_synthea");
        addPopulationParameter(processBuilder, populationSize);
        addGenderParameter(processBuilder, gender);
        addAgeParameter(processBuilder, minAge, maxAge);
        addLocationParameter(processBuilder, state, city);

        processBuilder.directory(new File(SYNTHEA_DIRECTORY));
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Todo: disable logs in production
        /* 
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
        */
        

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Error occurred while generating synthetic data.");
        }

        moveGeneratedOutputToRunFolder(runId, "fhir");
        moveGeneratedOutputToRunFolder(runId, "csv");
    }


    private void moveGeneratedOutputToRunFolder(String runId, String format) {
        File outputRoot = storageService.getOutputRoot(format);

        if (!outputRoot.exists()) return;

        File[] directories = outputRoot.listFiles(File::isDirectory);
        if (directories != null) {
            Optional<File> latestDir = Arrays.stream(directories)
                    .filter(f -> !f.getName().equals(runId))
                    .max(Comparator.comparingLong(File::lastModified));

            if (latestDir.isPresent()) {
                File createdFolder = latestDir.get();
                File targetFolder = storageService.getRunDirectory(runId, format);
                createdFolder.renameTo(targetFolder);
            }
        }
    }


    public void parseAndPersistPatients(String runId, Run runEntity) {
        File runDirectory = storageService.getRunDirectory(runId, "fhir");

        if (!runDirectory.exists() || !runDirectory.isDirectory()) {
            System.err.println("No Output Directory found for run: " + runId);
            return;
        }

        File[] files = runDirectory.listFiles((dir, name) -> name.endsWith(".json"));
        if (files == null || files.length == 0) return;

        System.out.println("Parse " + files.length + " Files for Database...");

        Arrays.stream(files).parallel().forEach(file -> {
            final Patient p = parseSinglePatientFile(file, runEntity);
            if (p != null) {
                patientRepository.save(p);
            }
        });
    }



    public void deleteRunFiles(String runId) {
        storageService.deleteRunData(runId);
    }


    private void addPopulationParameter(ProcessBuilder pb, Integer size) {
        if (size != null) { pb.command().add("-p"); pb.command().add(String.valueOf(size)); }
    }

    private void addGenderParameter(ProcessBuilder pb, String gender) {
        if (gender != null && (gender.equalsIgnoreCase("M") || gender.equalsIgnoreCase("F"))) {
            pb.command().add("-g"); pb.command().add(gender.toUpperCase());
        }
    }

    private void addAgeParameter(ProcessBuilder pb, Integer min, Integer max) {
        if (min != null && max != null) { pb.command().add("-a"); pb.command().add(min + "-" + max); }
    }

    private void addLocationParameter(ProcessBuilder pb, String state, String city) {
        if (state != null && !state.isEmpty()) {
            pb.command().add(state);
            if (city != null && !city.isEmpty()) pb.command().add(city);
        }
    }

    private Patient parseSinglePatientFile(File file, Run runEntity) {
        try {
            JsonNode root = objectMapper.readTree(file);
            JsonNode patientResource = findResourceByType(root, "Patient");
            if (patientResource == null) return null;

            Patient p = new Patient();
            p.setRun(runEntity);
            p.setPatientId(getText(patientResource, "id"));
            p.setGender(getText(patientResource, "gender"));
            p.setName(extractName(patientResource));
            p.setAge(calculateAge(getText(patientResource, "birthDate")));
            p.setLocation(extractLocation(patientResource));
            return p;
        } catch (Exception e) {
            System.err.println("Fehler beim Parsen von " + file.getName() + ": " + e.getMessage());
            return null;
        }
    }

    private JsonNode findResourceByType(JsonNode bundle, String type) {
        if (!bundle.has("entry")) return null;
        for (JsonNode entry : bundle.get("entry")) {
            if (entry.has("resource") && type.equals(getText(entry.get("resource"), "resourceType"))) {
                return entry.get("resource");
            }
        }
        return null;
    }

    private String extractName(JsonNode resource) {
        if (!resource.has("name")) return "Unknown";
        JsonNode nameNode = resource.get("name").get(0);
        String given = nameNode.has("given") ? nameNode.get("given").get(0).asText() : "";
        String family = getText(nameNode, "family");
        return (given + " " + family).trim();
    }

    private String extractLocation(JsonNode resource) {
        if (!resource.has("address")) return "";
        JsonNode addr = resource.get("address").get(0);
        String city = getText(addr, "city");
        String state = getText(addr, "state");
        if (city != null && state != null) return city + ", " + state;
        return (city != null) ? city : "";
    }

    private Integer calculateAge(String birthDateStr) {
        if (birthDateStr == null) return null;
        try {
            return Period.between(LocalDate.parse(birthDateStr), LocalDate.now()).getYears();
        } catch (Exception e) { return 0; }
    }

    private String getText(JsonNode node, String field) {
        return node.has(field) ? node.get(field).asText() : null;
    }
}