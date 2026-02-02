package com.syntheaweb.backend.database.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "runs")
public class Run {

    @Id
    @Column(name = "run_id", nullable = false, unique = true)
    private String runId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false) 
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private String state;

    @Column(nullable = true)
    private String city;

    @Column(nullable = true)
    private String gender;

    @Column(nullable = true)
    private Integer populationSize;

    @Column(nullable = true)
    private Integer minAge;

    @Column(nullable = true)
    private Integer maxAge;

    public Run(String runId, User user, LocalDateTime createdAt, String state, String city, String gender, Integer populationSize, Integer minAge, Integer maxAge) {
        this.runId = runId;
        this.user = user;
        this.createdAt = createdAt;
        this.state = state;
        this.city = city;
        this.gender = gender;
        this.populationSize = populationSize;
        this.minAge = minAge;
        this.maxAge = maxAge;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public Run() {

    }

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getPopulationSize() {
        return populationSize;
    }

    public void setPopulationSize(Integer populationSize) {
        this.populationSize = populationSize;
    }
}