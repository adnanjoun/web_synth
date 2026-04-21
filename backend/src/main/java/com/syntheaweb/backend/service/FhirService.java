package com.syntheaweb.backend.service;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.r4.model.Bundle;
import org.springframework.stereotype.Service;

@Service
public class FhirService {

    public Bundle parseBundle(String json) {
        FhirContext ctx = FhirContext.forR4();
        return (Bundle) ctx.newJsonParser().parseResource(json);
    }
}