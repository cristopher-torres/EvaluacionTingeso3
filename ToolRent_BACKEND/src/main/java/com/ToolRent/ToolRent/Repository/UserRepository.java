package com.ToolRent.ToolRent.Repository;

import com.ToolRent.ToolRent.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    @Query("SELECT COUNT(l) " +
            "FROM LoanEntity l " +
            "WHERE l.client.id = :userId " +
            "AND l.delivered = false")
    long countActiveLoans(@Param("userId") Long userId);

    @Query("SELECT COUNT(l) " +
            "FROM LoanEntity l " +
            "WHERE l.client.id = :clientId " +
            "AND l.tool.name = :toolName " +
            "AND l.delivered = false")
    int countActiveLoansByToolName(@Param("clientId") Long clientId, @Param("toolName") String toolName);

    Optional<UserEntity> findByRut(String rut);

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

}