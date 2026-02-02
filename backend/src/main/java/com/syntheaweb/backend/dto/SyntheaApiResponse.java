package com.syntheaweb.backend.dto;

public class SyntheaApiResponse {

    private String message;
    private String runID;

    public SyntheaApiResponse(String message, String runID) {

        this.message = message;
        this.runID = runID;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRunID() {
        return runID;
    }

    public void setRunID(String runID) {
        this.runID = runID;
    } 
}