package com.ToolRent.ToolRent.Service;

import com.ToolRent.ToolRent.DTO.ToolStockDTO;
import com.ToolRent.ToolRent.Entity.KardexEntity;
import com.ToolRent.ToolRent.Entity.ToolStatus;
import com.ToolRent.ToolRent.Entity.ToolsEntity;
import com.ToolRent.ToolRent.Repository.ToolsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToolsServiceTest {

    @Mock
    private ToolsRepository toolsRepository;

    @Mock
    private UserService userService;

    @Mock
    private KardexService kardexService;

    @InjectMocks
    private ToolsService toolsService;

    private String rut = "12.345.678-9";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- registerTool() ---
    @Test
    void testRegisterToolValid() {
        ToolsEntity tool = new ToolsEntity();
        tool.setName("Taladro");
        tool.setCategory("Electricas");
        tool.setReplacementValue(100);

        when(toolsRepository.save(any(ToolsEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        ToolsEntity result = toolsService.registerTool(tool, 2, rut);

        assertEquals("Taladro", result.getName());
        verify(kardexService, times(2)).save(any(KardexEntity.class));
        verify(toolsRepository, atLeast(2)).save(any(ToolsEntity.class));
    }

    @Test
    void testRegisterToolInvalidName() {
        ToolsEntity tool = new ToolsEntity();
        tool.setName("");
        tool.setCategory("Electricas");
        tool.setReplacementValue(100);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> toolsService.registerTool(tool, 1, rut));
        assertTrue(ex.getMessage().contains("nombre"));
    }

    @Test
    void testRegisterToolInvalidCategory() {
        ToolsEntity tool = new ToolsEntity();
        tool.setName("Taladro");
        tool.setCategory("");
        tool.setReplacementValue(100);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> toolsService.registerTool(tool, 1, rut));
        assertTrue(ex.getMessage().contains("categoría"));
    }

    @Test
    void testRegisterToolInvalidReplacementValue() {
        ToolsEntity tool = new ToolsEntity();
        tool.setName("Taladro");
        tool.setCategory("Electricas");
        tool.setReplacementValue(0); // <=0 para forzar excepción

        // No mocks necesarios, la excepción ocurre antes de save
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> toolsService.registerTool(tool, 1, rut));

        // El mensaje debe coincidir exactamente
        assertTrue(ex.getMessage().contains("reposición"));
    }


    // --- decommissionTool() ---
    @Test
    void testDecommissionTool() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setStatus(ToolStatus.DISPONIBLE);

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(tool));
        when(toolsRepository.save(tool)).thenReturn(tool);

        ToolsEntity result = toolsService.decommissionTool(1L, rut);

        assertEquals(ToolStatus.DADA_DE_BAJA, result.getStatus());
        verify(kardexService, times(1)).save(any(KardexEntity.class));
        verify(toolsRepository, times(1)).save(tool);
    }

    @Test
    void testDecommissionToolNotFound() {
        when(toolsRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> toolsService.decommissionTool(1L, rut));
        assertTrue(ex.getMessage().contains("no encontrada"));
    }

    // --- findAll() ---
    @Test
    void testFindAll() {
        ToolsEntity t1 = new ToolsEntity();
        ToolsEntity t2 = new ToolsEntity();
        when(toolsRepository.findAll()).thenReturn(Arrays.asList(t1, t2));

        List<ToolsEntity> result = toolsService.findAll();
        assertEquals(2, result.size());
    }

    // --- findById() ---
    @Test
    void testFindByIdExisting() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        when(toolsRepository.findById(1L)).thenReturn(Optional.of(tool));

        ToolsEntity result = toolsService.findById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void testFindByIdNotFound() {
        when(toolsRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> toolsService.findById(1L));
        assertTrue(ex.getMessage().contains("no encontrada"));
    }

    // --- getAvailableTool() ---
    @Test
    void testGetAvailableToolExists() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setStatus(ToolStatus.DISPONIBLE);

        when(toolsRepository.findByIdAndStatus(1L, ToolStatus.DISPONIBLE))
                .thenReturn(Optional.of(tool));

        ToolsEntity result = toolsService.getAvailableTool(1L);
        assertEquals(ToolStatus.DISPONIBLE, result.getStatus());
    }

    @Test
    void testGetAvailableToolNotExists() {
        when(toolsRepository.findByIdAndStatus(1L, ToolStatus.DISPONIBLE))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> toolsService.getAvailableTool(1L));
        assertTrue(ex.getMessage().contains("No hay unidades disponibles"));
    }

    // --- loanTool() ---
    @Test
    void testLoanToolAvailable() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setStatus(ToolStatus.DISPONIBLE);

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(tool));

        toolsService.loanTool(1L);

        assertEquals(ToolStatus.PRESTADA, tool.getStatus());
        verify(toolsRepository, times(1)).save(tool);
    }

    @Test
    void testLoanToolNotAvailable() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setStatus(ToolStatus.PRESTADA);

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(tool));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> toolsService.loanTool(1L));
        assertTrue(ex.getMessage().contains("no está disponible"));
    }

    // --- returnTool() ---
    @Test
    void testReturnTool() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setStatus(ToolStatus.PRESTADA);

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(tool));

        toolsService.returnTool(1L);

        assertEquals(ToolStatus.DISPONIBLE, tool.getStatus());
        verify(toolsRepository, times(1)).save(tool);
    }

    @Test
    void testReturnToolInvalid() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setStatus(ToolStatus.DISPONIBLE);

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(tool));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> toolsService.returnTool(1L));
        assertTrue(ex.getMessage().contains("no estaba prestada"));
    }

    // --- getToolsStock() ---
    @Test
    void testGetToolsStock() {
        Object[] tool1 = new Object[]{"Taladro", "Electricas"};
        Object[] tool2 = new Object[]{"Martillo", "Manual"};

        when(toolsRepository.findDistinctNameAndCategory()).thenReturn(Arrays.asList(tool1, tool2));
        when(toolsRepository.countByNameAndCategoryAndStatus(anyString(), anyString(), any()))
                .thenReturn(1);

        List<ToolStockDTO> stock = toolsService.getToolsStock();
        assertEquals(2, stock.size());
    }

    // --- updateTool() ---
    @Test
    void testUpdateTool() {
        ToolsEntity existing = new ToolsEntity();
        existing.setId(1L);
        existing.setName("Old");

        ToolsEntity update = new ToolsEntity();
        update.setName("New");
        update.setCategory("Cat");
        update.setReplacementValue(100);
        update.setDailyRate(10);
        update.setDailyLateRate(2);
        update.setRepairValue(5);
        update.setStatus(ToolStatus.DISPONIBLE);

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(toolsRepository.save(existing)).thenReturn(existing);

        ToolsEntity result = toolsService.updateTool(1L, update, rut);
        assertEquals("New", result.getName());
    }

    @Test
    void testUpdateToolChangesStatusToRepair() {
        ToolsEntity existing = new ToolsEntity();
        existing.setId(1L);
        existing.setName("Taladro");
        existing.setCategory("Electricas");
        existing.setStatus(ToolStatus.DISPONIBLE); // estado viejo

        ToolsEntity update = new ToolsEntity();
        update.setName("Taladro");
        update.setCategory("Electricas");
        update.setReplacementValue(100);
        update.setDailyRate(10);
        update.setDailyLateRate(2);
        update.setRepairValue(5);
        update.setStatus(ToolStatus.EN_REPARACION); // estado NUEVO

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(toolsRepository.save(existing)).thenReturn(existing);

        ToolsEntity result = toolsService.updateTool(1L, update, rut);

        assertEquals(ToolStatus.EN_REPARACION, result.getStatus());

        // Debe registrar 1 movimiento en Kardex
        verify(kardexService, times(1)).save(any(KardexEntity.class));

        // Verificar que el movimiento sea de tipo REPARACION
        verify(kardexService).save(argThat(k ->
                k.getType().equals("REPARACION") &&
                        k.getTool().getId().equals(1L) &&
                        k.getUserRut().equals(rut)
        ));
    }

    @Test
    void testUpdateToolChangesStatusToDecommission() {
        ToolsEntity existing = new ToolsEntity();
        existing.setId(1L);
        existing.setName("Taladro");
        existing.setCategory("Electricas");
        existing.setStatus(ToolStatus.DISPONIBLE); // estado viejo

        ToolsEntity update = new ToolsEntity();
        update.setName("Taladro");
        update.setCategory("Electricas");
        update.setReplacementValue(100);
        update.setDailyRate(10);
        update.setDailyLateRate(2);
        update.setRepairValue(5);
        update.setStatus(ToolStatus.DADA_DE_BAJA); // estado nuevo

        when(toolsRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(toolsRepository.save(existing)).thenReturn(existing);

        ToolsEntity result = toolsService.updateTool(1L, update, rut);

        assertEquals(ToolStatus.DADA_DE_BAJA, result.getStatus());

        // Debe registrar 1 movimiento en Kardex
        verify(kardexService, times(1)).save(any(KardexEntity.class));

        // Verificar que el movimiento sea de tipo BAJA
        verify(kardexService).save(argThat(k ->
                k.getType().equals("BAJA") &&
                        k.getTool().getId().equals(1L) &&
                        k.getUserRut().equals(rut)
        ));
    }


    // --- getAvailableTools() ---
    @Test
    void testGetAvailableTools() {
        ToolsEntity t1 = new ToolsEntity();
        t1.setStatus(ToolStatus.DISPONIBLE);
        ToolsEntity t2 = new ToolsEntity();
        t2.setStatus(ToolStatus.DISPONIBLE);

        when(toolsRepository.findByStatus(ToolStatus.DISPONIBLE)).thenReturn(Arrays.asList(t1, t2));

        List<ToolsEntity> available = toolsService.getAvailableTools();
        assertEquals(2, available.size());
    }
}