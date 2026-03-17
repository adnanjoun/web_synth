package com.syntheaweb.backend.database.repository;

import com.syntheaweb.backend.database.entity.Patient;
import com.syntheaweb.backend.dto.PatientDto;
import com.syntheaweb.backend.dto.PatientCountResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {

    Page<Patient> findByRun_RunId(String runId, Pageable pageable);

    @Query("SELECT DISTINCT p.location FROM Patient p WHERE p.run.runId = :runId ORDER BY p.location ASC")
    List<String> findDistinctLocationsByRunId(@Param("runId") String runId);

    // Gender distribution stats
    @Query("SELECT " +
            "COUNT(p) as total, " +
            "SUM(CASE WHEN p.gender = 'male' THEN 1 ELSE 0 END) as males, " +
            "SUM(CASE WHEN p.gender = 'female' THEN 1 ELSE 0 END) as females " +
            "FROM Patient p " +
            "WHERE p.run.runId = :runId " +
            "AND (:name IS NULL OR p.name ILIKE concat('%', cast(:name as string), '%'))" +
            "AND (:gender IS NULL OR p.gender = :gender) " +
            "AND (:minAge IS NULL OR p.age >= :minAge) " +
            "AND (:maxAge IS NULL OR p.age <= :maxAge) " +
            "AND ((:locations) IS NULL OR p.location IN (:locations))")
    PatientCountResult countStatistics(
            @Param("runId") String runId,
            @Param("name") String name,
            @Param("gender") String gender,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("locations") List<String> locations
    );

    // for age distribution statistics
    @Query("SELECT p.age, COUNT(p) " +
            "FROM Patient p " +
            "WHERE p.run.runId = :runId " +
            "AND (:name IS NULL OR p.name ILIKE concat('%', cast(:name as string), '%'))" +
            "AND (:gender IS NULL OR p.gender = :gender) " +
            "AND (:minAge IS NULL OR p.age >= :minAge) " +
            "AND (:maxAge IS NULL OR p.age <= :maxAge) " +
            "AND ((:locations) IS NULL OR p.location IN (:locations)) " +
            "GROUP BY p.age")
    List<Object[]> countAgeDistribution(
            @Param("runId") String runId,
            @Param("name") String name,
            @Param("gender") String gender,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("locations") List<String> locations
    );
}