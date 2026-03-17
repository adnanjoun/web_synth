package com.syntheaweb.backend.database.repository;

import com.syntheaweb.backend.database.entity.FavoritePatient;
import com.syntheaweb.backend.database.entity.User;
import com.syntheaweb.backend.dto.PatientDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FavoritePatientRepository extends JpaRepository<FavoritePatient, Long> {

    boolean existsByUserAndOriginalRunIdAndPatientId(User user, String originalRunId, String patientId);

    @Transactional
    void deleteByUserAndOriginalRunId(User user, String originalRunId);


    @Query("""
        SELECT new com.syntheaweb.backend.dto.PatientDto(
            fp.id,
            fp.originalRunId, 
            fp.patientId, 
            p.name, 
            p.gender, 
            p.age, 
            p.location
        )
        FROM FavoritePatient fp
        JOIN Patient p ON p.patientId = fp.patientId AND p.run.runId = fp.originalRunId
        WHERE fp.user = :user
    """)
    List<PatientDto> findFavoriteDetailsByUser(@Param("user") User user);

    List<FavoritePatient> findByUserAndIdIn(User user, List<Long> ids);
    List<FavoritePatient> findByUser(User user);
}