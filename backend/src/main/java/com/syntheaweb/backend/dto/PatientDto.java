package com.syntheaweb.backend.dto;

import com.syntheaweb.backend.database.entity.Patient;

public class PatientDto {
    private Long id;
    private String runId;
    private String patientId;
    private String name;
    private String gender;
    private Integer age;
    private String location;
    private String fullData;


    public PatientDto() {
    }

    public PatientDto(Long id, String runId, String patientId, String name, String gender, Integer age, String location) {
        this.id = id;
        this.runId = runId;
        this.patientId = patientId;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.location = location;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRunId() { return runId; }
    public void setRunId(String runId) { this.runId = runId; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getFullData() { return fullData; }
    public void setFullData(String fullData) { this.fullData = fullData; }

    public static PatientDto fromPatient(Patient entity) {
        if (entity == null) {
            return null;
        }

        final PatientDto dto = new PatientDto();

        if (entity.getRun() != null) {
            dto.setRunId(entity.getRun().getRunId());
        }

        dto.setPatientId(entity.getPatientId());
        dto.setName(entity.getName());
        dto.setGender(entity.getGender());
        dto.setAge(entity.getAge());
        dto.setLocation(entity.getLocation());

        return dto;
    }
}