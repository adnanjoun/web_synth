package com.syntheaweb.backend.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_patients",
        uniqueConstraints = { @UniqueConstraint(columnNames = { "user_id", "original_run_id", "patient_id" }) })
public class FavoritePatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "original_run_id", nullable = false)
    private String originalRunId;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public FavoritePatient() {}

    public FavoritePatient(User user, String originalRunId, String patientId) {
        this.user = user;
        this.originalRunId = originalRunId;
        this.patientId = patientId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getOriginalRunId() { return originalRunId; }
    public void setOriginalRunId(String originalRunId) { this.originalRunId = originalRunId; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}