package com.toolrent.toolrent.service;

import com.toolrent.toolrent.entity.KardexEntity;
import com.toolrent.toolrent.entity.ToolsEntity;
import com.toolrent.toolrent.repository.KardexRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KardexService {

  private final KardexRepository kardexRepository;

  public KardexEntity save(KardexEntity movement) {
    return kardexRepository.save(movement);
  }

  public List<KardexEntity> getMovementsByTool(ToolsEntity tool) {
    return kardexRepository.findByTool(tool);
  }

  public List<KardexEntity> getMovementsByDateRange(LocalDateTime start, LocalDateTime end) {
    return kardexRepository.findByDateTimeBetween(start, end);
  }

  public List<KardexEntity> getAll() {
    return kardexRepository.findAllByOrderByDateTimeDesc();
  }

  public List<KardexEntity> getFilteredKardex(Long toolId, LocalDateTime start, LocalDateTime end) {
    return kardexRepository.findByToolAndDateRange(toolId, start, end);
  }
}
