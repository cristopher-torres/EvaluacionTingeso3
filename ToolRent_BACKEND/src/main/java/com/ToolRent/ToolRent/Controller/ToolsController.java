package com.ToolRent.ToolRent.Controller;


import com.ToolRent.ToolRent.DTO.ToolStockDTO;
import com.ToolRent.ToolRent.Entity.ToolsEntity;
import com.ToolRent.ToolRent.Service.ToolsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/tools")
public class ToolsController {

    @Autowired
    private ToolsService toolsService;

    @PostMapping("/createTool/{quantity}/{rut}")
    public ResponseEntity<ToolsEntity> createTool(
            @RequestBody ToolsEntity tool,
            @PathVariable("quantity") int quantity,
            @PathVariable("rut") String rut
    ) {
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
            @PathVariable Long toolId,
            @PathVariable String rut,
            @RequestBody ToolsEntity toolDetails) {

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

