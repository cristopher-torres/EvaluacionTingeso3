package com.ToolRent.ToolRent.Repository;

import com.ToolRent.ToolRent.Entity.KardexEntity;
import com.ToolRent.ToolRent.Entity.ToolsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface KardexRepository extends JpaRepository<KardexEntity, Long> {

    List<KardexEntity> findByTool(ToolsEntity tool);
    List<KardexEntity> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    List<KardexEntity> findAllByOrderByDateTimeDesc();
}