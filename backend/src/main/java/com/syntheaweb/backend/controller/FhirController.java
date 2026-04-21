package com.syntheaweb.backend.controller;

import com.syntheaweb.backend.service.FhirService;
import org.hl7.fhir.r4.model.Bundle;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fhir")
public class FhirController {

    private final FhirService fhirService;

    public FhirController(FhirService fhirService) {
        this.fhirService = fhirService;
    }

    @PostMapping("/test")
    public String test(@RequestBody String json) {
        Bundle bundle = fhirService.parseBundle(json);
        return "Entries: " + bundle.getEntry().size();
    }
}