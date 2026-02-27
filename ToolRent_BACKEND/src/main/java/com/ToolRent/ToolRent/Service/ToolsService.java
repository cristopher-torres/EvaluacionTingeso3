package com.ToolRent.ToolRent.Service;

import com.ToolRent.ToolRent.DTO.ToolStockDTO;
import com.ToolRent.ToolRent.Entity.KardexEntity;
import com.ToolRent.ToolRent.Entity.ToolStatus;
import com.ToolRent.ToolRent.Entity.ToolsEntity;
import com.ToolRent.ToolRent.Repository.ToolsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;


@Service
@RequiredArgsConstructor
public class ToolsService {

    private final ToolsRepository toolsRepository;

    private final KardexService kardexService;

    private static final String TOOL_NOT_FOUND_MESSAGE = "Herramienta no encontrada";

    // Registrar herramienta
    @Transactional
    public ToolsEntity registerTool(ToolsEntity tool, int quantity, String rut) {

        if (tool.getName() == null || tool.getName().isBlank()) {
            throw new IllegalArgumentException("Se debe ingresar el nombre");
        }
        if (tool.getCategory() == null || tool.getCategory().isBlank()) {
            throw new IllegalArgumentException("Se debe ingresar la categoría");
        }
        if (tool.getReplacementValue() <= 0) {
            throw new IllegalArgumentException("El valor de reposición debe ser mayor que 0");
        }

        ToolsEntity firstSaved = null;

        for (int i = 0; i < quantity; i++) {

            ToolsEntity unit = new ToolsEntity();
            unit.setName(tool.getName());
            unit.setCategory(tool.getCategory());
            unit.setReplacementValue(tool.getReplacementValue());
            unit.setDailyRate(tool.getDailyRate());
            unit.setDailyLateRate(tool.getDailyLateRate());
            unit.setRepairValue(tool.getRepairValue());
            unit.setStatus(ToolStatus.DISPONIBLE);

            ToolsEntity savedTool = toolsRepository.save(unit);

            KardexEntity movement = new KardexEntity();
            movement.setType("INGRESO");
            movement.setQuantity(1);
            movement.setTool(savedTool);
            movement.setDateTime(LocalDateTime.now());
            movement.setUserRut(rut);
            kardexService.save(movement);

            if (i == 0) {
                firstSaved = savedTool;
            }
        }

        return firstSaved;  // devolvemos solo una unidad válida
    }


    @Transactional
    public ToolsEntity decommissionTool(Long toolId, String rut) {

        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException(TOOL_NOT_FOUND_MESSAGE));

        tool.setStatus(ToolStatus.DADA_DE_BAJA);

        // Registrar movimiento en Kardex
        KardexEntity movement = new KardexEntity();
        movement.setType("BAJA");
        movement.setQuantity(1);
        movement.setTool(tool);
        movement.setDateTime(LocalDateTime.now());
        movement.setUserRut(rut);
        kardexService.save(movement);

        return toolsRepository.save(tool);
    }


    public List<ToolsEntity> findAll() {
        return toolsRepository.findAll();
    }

    public ToolsEntity findById(Long id) {
        return toolsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(TOOL_NOT_FOUND_MESSAGE));
    }

    // Obtener una unidad disponible de un tipo de herramienta
    @Transactional
    public ToolsEntity getAvailableTool(long id) {
        return toolsRepository.findByIdAndStatus(id, ToolStatus.DISPONIBLE)
                .orElseThrow(() -> new RuntimeException("No hay unidades disponibles para préstamo"));
    }

    // Prestar una unidad
    @Transactional
    public void loanTool(Long toolId) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException(TOOL_NOT_FOUND_MESSAGE));

        if (tool.getStatus() != ToolStatus.DISPONIBLE) {
            throw new IllegalStateException("La herramienta no está disponible");
        }

        tool.setStatus(ToolStatus.PRESTADA);
        toolsRepository.save(tool);
    }

    // Devolver una unidad
    @Transactional
    public void returnTool(Long toolId) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException(TOOL_NOT_FOUND_MESSAGE));

        if (tool.getStatus() != ToolStatus.PRESTADA) {
            throw new IllegalStateException("La herramienta no estaba prestada");
        }

        tool.setStatus(ToolStatus.DISPONIBLE);

        toolsRepository.save(tool);
    }

    public List<ToolStockDTO> getToolsStock() {
        List<Object[]> toolNameCategory = toolsRepository.findDistinctNameAndCategory();
        List<ToolStockDTO> stockList = new ArrayList<>();

        for (Object[] pair : toolNameCategory) {
            String name = (String) pair[0];
            String category = (String) pair[1];

            ToolStockDTO dto = new ToolStockDTO();
            dto.setName(name);
            dto.setCategory(category);
            dto.setDisponible(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.DISPONIBLE));
            dto.setPrestada(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.PRESTADA));
            dto.setEnReparacion(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.EN_REPARACION));
            dto.setDadaDeBaja(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.DADA_DE_BAJA));

            stockList.add(dto);
        }

        return stockList;
    }

    public ToolsEntity updateTool(Long toolId, ToolsEntity toolDetails, String rut) {
        // 1. Obtener la herramienta existente
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException(TOOL_NOT_FOUND_MESSAGE));

        // Guardar el estado anterior
        ToolStatus oldStatus = tool.getStatus();

        // 2. Comprobar si algún precio fue modificado
        boolean preciosCambiaron =
                Double.compare(tool.getReplacementValue(), toolDetails.getReplacementValue()) != 0 ||
                        Double.compare(tool.getDailyRate(), toolDetails.getDailyRate()) != 0 ||
                        Double.compare(tool.getDailyLateRate(), toolDetails.getDailyLateRate()) != 0 ||
                        Double.compare(tool.getRepairValue(), toolDetails.getRepairValue()) != 0;

        // 3. Actualizar la herramienta principal
        tool.setName(toolDetails.getName());
        tool.setCategory(toolDetails.getCategory());
        tool.setReplacementValue(toolDetails.getReplacementValue());
        tool.setDailyRate(toolDetails.getDailyRate());
        tool.setDailyLateRate(toolDetails.getDailyLateRate());
        tool.setRepairValue(toolDetails.getRepairValue());
        tool.setStatus(toolDetails.getStatus());
        ToolsEntity updatedTool = toolsRepository.save(tool);

        // 4. Si los precios cambiaron, modificar todas las demás herramientas con el mismo nombre y categoría
        if (preciosCambiaron) {
            // Obtenemos todas las herramientas
            List<ToolsEntity> herramientasSimilares = toolsRepository.findByNameAndCategory(
                    toolDetails.getName(),
                    toolDetails.getCategory()
            );

            // Actualizamos los precios de cada una
            for (ToolsEntity h : herramientasSimilares) {
                if (!h.getId().equals(toolId)) {
                    h.setReplacementValue(toolDetails.getReplacementValue());
                    h.setDailyRate(toolDetails.getDailyRate());
                    h.setDailyLateRate(toolDetails.getDailyLateRate());
                    h.setRepairValue(toolDetails.getRepairValue());
                }
            }
            toolsRepository.saveAll(herramientasSimilares);
        }

        // 5. Crear movimiento en Kardex si el estado cambió a EN_REPARACION
        if (oldStatus != tool.getStatus() && tool.getStatus() == ToolStatus.EN_REPARACION) {
            KardexEntity reparacion = new KardexEntity();
            reparacion.setTool(updatedTool);
            reparacion.setDateTime(LocalDateTime.now());
            reparacion.setQuantity(1);
            reparacion.setLoan(null);
            reparacion.setUserRut(rut);
            reparacion.setType("REPARACION");
            kardexService.save(reparacion);
        }

        // 6. Crear movimiento en Kardex si el estado cambió a DADA_DE_BAJA
        if (oldStatus != tool.getStatus() && tool.getStatus() == ToolStatus.DADA_DE_BAJA) {
            KardexEntity baja = new KardexEntity();
            baja.setTool(updatedTool);
            baja.setDateTime(LocalDateTime.now());
            baja.setQuantity(1);
            baja.setLoan(null);
            baja.setUserRut(rut);
            baja.setType("BAJA");
            kardexService.save(baja);
        }

        return updatedTool;
    }


    public List<ToolsEntity> getAvailableTools() {
        return toolsRepository.findByStatus(ToolStatus.DISPONIBLE);
    }

}
