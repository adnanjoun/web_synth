package com.syntheaweb.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class StorageService {

    private static final String BASE_OUTPUT_DIRECTORY = "/synthea/output/";
    private static final String FORMAT_CSV = "csv";
    private static final String FORMAT_FHIR = "fhir";

    public String readPatientFile(String runId, String patientId) throws IOException {
        File runDir = getRunDirectory(runId, FORMAT_FHIR);
        if (!runDir.exists()) return null;

        File[] files = runDir.listFiles((dir, name) ->
                name.endsWith(".json") && name.contains(patientId)
        );

        if (files != null && files.length > 0) {
            return Files.readString(files[0].toPath(), StandardCharsets.UTF_8);
        }
        return null;
    }

    public void addRunToZipStream(ZipOutputStream zos, String runId, String format, Set<String> filterPatientIds) throws IOException {
        boolean isCsv = FORMAT_CSV.equalsIgnoreCase(format);
        File sourceDir = getRunDirectory(runId, isCsv ? FORMAT_CSV : FORMAT_FHIR);

        if (!sourceDir.exists() || !sourceDir.isDirectory()) {
            System.err.println("Directory not found for run: " + runId);
            return;
        }

        String zipEntryPrefix = (isCsv ? "csv" : "fhir") + "_run_" + runId + "/";

        if (isCsv) {
            processCsvFolder(sourceDir, zos, zipEntryPrefix, filterPatientIds);
        } else {
            processFhirFolder(sourceDir, zos, zipEntryPrefix, filterPatientIds);
        }
    }

    public void deleteRunData(String runId) {
        deleteDirectoryRecursively(getRunDirectory(runId, FORMAT_CSV));
        deleteDirectoryRecursively(getRunDirectory(runId, FORMAT_FHIR));

        new File(BASE_OUTPUT_DIRECTORY + FORMAT_CSV + "/" + runId + "_csv.zip").delete();
        new File(BASE_OUTPUT_DIRECTORY + FORMAT_FHIR + "/" + runId + "_fhir.zip").delete();
    }


    private void processFhirFolder(File dir, ZipOutputStream zos, String prefix, Set<String> filterIds) throws IOException {
        File[] files = dir.listFiles((d, name) -> name.endsWith(".json"));
        if (files == null) return;

        for (File file : files) {
            boolean include = true;
            if (filterIds != null && !filterIds.isEmpty()) {
                include = filterIds.stream().anyMatch(id -> file.getName().contains(id));
            }

            if (include) {
                ZipEntry entry = new ZipEntry(prefix + file.getName());
                zos.putNextEntry(entry);
                Files.copy(file.toPath(), zos);
                zos.closeEntry();
            }
        }
    }

    private void processCsvFolder(File dir, ZipOutputStream zos, String prefix, Set<String> filterIds) throws IOException {
        File[] files = dir.listFiles((d, name) -> name.toLowerCase().endsWith(".csv"));
        if (files == null) return;
        Arrays.sort(files, Comparator.comparing(File::getName));

        boolean applyFilter = filterIds != null && !filterIds.isEmpty();

        for (File csvFile : files) {
            zos.putNextEntry(new ZipEntry(prefix + csvFile.getName()));

            if (!applyFilter) {
                Files.copy(csvFile.toPath(), zos);
            } else {
                filterAndWriteCsv(csvFile, zos, filterIds);
            }
            zos.closeEntry();
        }
    }

    private void filterAndWriteCsv(File csvFile, ZipOutputStream zos, Set<String> targetIds) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String header = reader.readLine();
            if (header == null) return;
            writeLine(zos, header);

            int idColumnIndex = -1;
            if ("patients.csv".equalsIgnoreCase(csvFile.getName())) {
                idColumnIndex = 0;
            } else {
                idColumnIndex = findColumnIndex(header.split(",", -1), "PATIENT");
            }

            if (idColumnIndex == -1) {
                String line;
                while ((line = reader.readLine()) != null) writeLine(zos, line);
                return;
            }

            String line;
            while ((line = reader.readLine()) != null) {
                String[] cols = line.split(",", -1);
                if (cols.length > idColumnIndex && targetIds.contains(cols[idColumnIndex])) {
                    writeLine(zos, line);
                }
            }
        }
    }


    public File getRunDirectory(String runId, String format) {
        if (runId.contains("..") || runId.contains("/") || runId.contains("\\")) {
            throw new IllegalArgumentException("Invalid runId");
        }
        return new File(BASE_OUTPUT_DIRECTORY + format + "/" + runId);
    }

    public File getOutputRoot(String format) {
        return new File(BASE_OUTPUT_DIRECTORY + format);
    }

    private int findColumnIndex(String[] headers, String wanted) {
        for (int i = 0; i < headers.length; i++) {
            if (headers[i] != null && headers[i].trim().equalsIgnoreCase(wanted)) return i;
        }
        return -1;
    }

    private void writeLine(ZipOutputStream zos, String line) throws IOException {
        zos.write((line + "\n").getBytes(StandardCharsets.UTF_8));
    }

    private void deleteDirectoryRecursively(File file) {
        if (file.exists()) {
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                if (files != null) {
                    for (File c : files) deleteDirectoryRecursively(c);
                }
            }
            file.delete();
        }
    }
}