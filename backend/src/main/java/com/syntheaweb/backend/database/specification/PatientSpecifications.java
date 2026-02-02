package com.syntheaweb.backend.database.specification;

import com.syntheaweb.backend.database.entity.Patient;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class PatientSpecifications {

    public static Specification<Patient> withFilters(String runId, String name, String gender, Integer minAge, Integer maxAge, List<String> locations) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("run").get("runId"), runId));

            if (name != null && !name.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + name.toLowerCase() + "%"
                ));
            }

            if (gender != null && !gender.trim().isEmpty() && !gender.equalsIgnoreCase("all")) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), gender));
            }

            if (minAge != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("age"), minAge));
            }
            if (maxAge != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("age"), maxAge));
            }

            if (locations != null && !locations.isEmpty()) {
                predicates.add(root.get("location").in(locations));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}