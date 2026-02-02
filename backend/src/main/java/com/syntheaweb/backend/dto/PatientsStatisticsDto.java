package com.syntheaweb.backend.dto;


import java.util.List;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

public class PatientsStatisticsDto {
    private Long populationSize;

    // Gender stats
    private Long maleOccurenceCount;
    private Long femaleOccurenceCount;

    // Age stats (<age, occurences of age>)
    private Map<Integer, Long> ageOccurenceData;

    public PatientsStatisticsDto() {}

    public PatientsStatisticsDto(Long populationSize,
                                 Long maleOccurenceCount,
                                 Long femaleOccurenceCount,
                                 Map<Integer, Long> ageOccurenceData
                                 ) {
        this.populationSize = populationSize;
        this.maleOccurenceCount = maleOccurenceCount;
        this.femaleOccurenceCount = femaleOccurenceCount;
        this.ageOccurenceData = ageOccurenceData;
    }

    public Long getPopulationSize() {
        return populationSize;
    }

    public void setPopulationSize(Long populationSize) {
        this.populationSize = populationSize;
    }

    public Long getMaleOccurenceCount() {
        return maleOccurenceCount;
    }

    public void setMaleOccurenceCount(Long maleOccurenceCount) {
        this.maleOccurenceCount = maleOccurenceCount;
    }

    public Long getFemaleOccurenceCount() {
        return femaleOccurenceCount;
    }

    public void setFemaleOccurenceCount(Long femaleOccurenceCount) {
        this.femaleOccurenceCount = femaleOccurenceCount;
    }

    public Map<Integer, Long> getAgeOccurenceData() {
        return ageOccurenceData;
    }

    public void setAgeOccurenceData(Map<Integer, Long> ageOccurenceData) {
        this.ageOccurenceData = ageOccurenceData;
    }
}