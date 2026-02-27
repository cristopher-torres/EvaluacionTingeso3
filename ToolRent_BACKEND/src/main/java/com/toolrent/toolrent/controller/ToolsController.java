package com.toolrent.toolrent.controller;

import com.toolrent.toolrent.dto.ToolStockDTO;
import com.toolrent.toolrent.entity.ToolsEntity;
import com.toolrent.toolrent.service.ToolsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/tools")
@RequiredArgsConstructor
public class ToolsController {

  private final ToolsService toolsService;

  @PostMapping("/createTool/{quantity}/{rut}")
  public ResponseEntity<ToolsEntity> createTool(
      @RequestBody ToolsEntity tool,
      @PathVariable("quantity") int quantity,
      @PathVariable("rut") String rut) {
    ToolsEntity savedTool = toolsService.registerTool(tool, quantity, rut);
    return ResponseEntity.ok(savedTool);
  }

  @GetMapping("/getTools")
  public ResponseEntity<List<ToolsEntity>> getAllTools() {
    return ResponseEntity.ok(toolsService.findAll());
  }

  @GetMapping("/stock")
  public ResponseEntity<List<ToolStockDTO>> getToolsStock() {
    List<ToolStockDTO> stock = toolsService.getToolsStock();
    return ResponseEntity.ok(stock);
  }

  @PutMapping("/updateTool/{toolId}/{rut}")
  public ResponseEntity<ToolsEntity> updateTool(
      @PathVariable Long toolId, @PathVariable String rut, @RequestBody ToolsEntity toolDetails) {

    ToolsEntity updatedTool = toolsService.updateTool(toolId, toolDetails, rut);
    return ResponseEntity.ok(updatedTool);
  }

  @GetMapping("/getTool/{toolId}")
  public ResponseEntity<ToolsEntity> getToolById(@PathVariable Long toolId) {
    ToolsEntity tool = toolsService.findById(toolId);
    return ResponseEntity.ok(tool);
  }

  @GetMapping("/available")
  public List<ToolsEntity> getAvailableTools() {
    return toolsService.getAvailableTools();
  }
}
