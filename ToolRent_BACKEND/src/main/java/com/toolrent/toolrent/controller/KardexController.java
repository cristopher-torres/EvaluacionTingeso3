package com.toolrent.toolrent.controller;

import com.toolrent.toolrent.entity.KardexEntity;
import com.toolrent.toolrent.entity.ToolsEntity;
import com.toolrent.toolrent.service.KardexService;
import com.toolrent.toolrent.service.ToolsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/kardex")
@CrossOrigin("*")
@RequiredArgsConstructor
public class KardexController {

  private final KardexService kardexService;
  private final ToolsService toolsService;

  @GetMapping("/tool/{toolId}")
  public List<KardexEntity> getMovementsByTool(@PathVariable Long toolId) {
    ToolsEntity tool = toolsService.findById(toolId);
    return kardexService.getMovementsByTool(tool);
  }

  @GetMapping("/dates")
  public List<KardexEntity> getMovementsByDateRange(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
    if (start == null && end == null) {
      return kardexService.getAll();
    }

    return kardexService.getMovementsByDateRange(start, end);
  }

  @GetMapping("/all")
  public ResponseEntity<List<KardexEntity>> getAllMovements() {
    List<KardexEntity> movements = kardexService.getAll();
    if (movements.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(movements);
  }

  @GetMapping("/filter")
  public List<KardexEntity> getFiltered(
      @RequestParam Long toolId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
    return kardexService.getFilteredKardex(toolId, start, end);
  }
}
