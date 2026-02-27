package com.toolrent.toolrent.service;

import com.toolrent.toolrent.entity.KardexEntity;
import com.toolrent.toolrent.entity.ToolsEntity;
import com.toolrent.toolrent.repository.KardexRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class KardexServiceTest {

  @Mock private KardexRepository kardexRepository;

  @InjectMocks private KardexService kardexService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  // ------------------ save() ------------------
  @Test
  void testSaveSingleMovement() {
    ToolsEntity tool = new ToolsEntity();
    tool.setId(1L);
    tool.setName("Martillo");

    KardexEntity movement = new KardexEntity();
    movement.setType("INGRESO");
    movement.setQuantity(5);
    movement.setDateTime(LocalDateTime.now());
    movement.setTool(tool);

    when(kardexRepository.save(movement)).thenReturn(movement);

    KardexEntity saved = kardexService.save(movement);

    assertNotNull(saved);
    assertEquals("INGRESO", saved.getType());
    assertEquals(tool, saved.getTool());
    verify(kardexRepository, times(1)).save(movement);
  }

  @Test
  void testSaveMultipleMovements() {
    ToolsEntity tool1 = new ToolsEntity();
    tool1.setId(1L);
    tool1.setName("Taladro");

    ToolsEntity tool2 = new ToolsEntity();
    tool2.setId(2L);
    tool2.setName("Destornillador");

    KardexEntity m1 = new KardexEntity();
    m1.setType("PRESTAMO");
    m1.setQuantity(2);
    m1.setTool(tool1);

    KardexEntity m2 = new KardexEntity();
    m2.setType("DEVOLUCION");
    m2.setQuantity(1);
    m2.setTool(tool1);

    KardexEntity m3 = new KardexEntity();
    m3.setType("BAJA");
    m3.setQuantity(1);
    m3.setTool(tool2);

    when(kardexRepository.save(m1)).thenReturn(m1);
    when(kardexRepository.save(m2)).thenReturn(m2);
    when(kardexRepository.save(m3)).thenReturn(m3);

    assertEquals(m1, kardexService.save(m1));
    assertEquals(m2, kardexService.save(m2));
    assertEquals(m3, kardexService.save(m3));

    verify(kardexRepository, times(1)).save(m1);
    verify(kardexRepository, times(1)).save(m2);
    verify(kardexRepository, times(1)).save(m3);
  }

  // ------------------ getMovementsByTool() ------------------
  @Test
  void testGetMovementsByToolSingle() {
    ToolsEntity tool = new ToolsEntity();
    tool.setId(1L);

    KardexEntity movement = new KardexEntity();
    movement.setType("INGRESO");
    movement.setTool(tool);

    when(kardexRepository.findByTool(tool)).thenReturn(List.of(movement));

    List<KardexEntity> result = kardexService.getMovementsByTool(tool);

    assertEquals(1, result.size());
    assertEquals("INGRESO", result.get(0).getType());
    verify(kardexRepository, times(1)).findByTool(tool);
  }

  @Test
  void testGetMovementsByToolMultiple() {
    ToolsEntity tool = new ToolsEntity();
    tool.setId(2L);

    KardexEntity m1 = new KardexEntity();
    m1.setType("PRESTAMO");
    m1.setTool(tool);

    KardexEntity m2 = new KardexEntity();
    m2.setType("DEVOLUCION");
    m2.setTool(tool);

    when(kardexRepository.findByTool(tool)).thenReturn(Arrays.asList(m1, m2));

    List<KardexEntity> movements = kardexService.getMovementsByTool(tool);

    assertEquals(2, movements.size());
    assertEquals("PRESTAMO", movements.get(0).getType());
    assertEquals("DEVOLUCION", movements.get(1).getType());
    verify(kardexRepository, times(1)).findByTool(tool);
  }

  // ------------------ getMovementsByDateRange() ------------------
  @Test
  void testGetMovementsByDateRangeSingle() {
    LocalDateTime start = LocalDateTime.now().minusDays(1);
    LocalDateTime end = LocalDateTime.now().plusDays(1);

    ToolsEntity tool = new ToolsEntity();
    tool.setId(1L);

    KardexEntity movement = new KardexEntity();
    movement.setType("INGRESO");
    movement.setTool(tool);

    when(kardexRepository.findByDateTimeBetween(start, end)).thenReturn(List.of(movement));

    List<KardexEntity> result = kardexService.getMovementsByDateRange(start, end);

    assertEquals(1, result.size());
    assertEquals("INGRESO", result.get(0).getType());
    verify(kardexRepository, times(1)).findByDateTimeBetween(start, end);
  }

  @Test
  void testGetMovementsByDateRangeMultiple() {
    LocalDateTime start = LocalDateTime.now().minusDays(3);
    LocalDateTime end = LocalDateTime.now();

    ToolsEntity tool1 = new ToolsEntity();
    tool1.setId(1L);
    ToolsEntity tool2 = new ToolsEntity();
    tool2.setId(2L);

    KardexEntity m1 = new KardexEntity();
    m1.setType("INGRESO");
    m1.setTool(tool1);
    KardexEntity m2 = new KardexEntity();
    m2.setType("PRESTAMO");
    m2.setTool(tool2);
    KardexEntity m3 = new KardexEntity();
    m3.setType("DEVOLUCION");
    m3.setTool(tool1);

    List<KardexEntity> list = Arrays.asList(m1, m2, m3);

    when(kardexRepository.findByDateTimeBetween(start, end)).thenReturn(list);

    List<KardexEntity> result = kardexService.getMovementsByDateRange(start, end);

    assertEquals(3, result.size());
    assertEquals("INGRESO", result.get(0).getType());
    assertEquals("PRESTAMO", result.get(1).getType());
    assertEquals("DEVOLUCION", result.get(2).getType());
    verify(kardexRepository, times(1)).findByDateTimeBetween(start, end);
  }

  // ------------------ getAll() ------------------
  @Test
  void testGetAllMovementsOrdered() {
    // Preparación de datos
    KardexEntity m1 = new KardexEntity();
    m1.setType("INGRESO");
    KardexEntity m2 = new KardexEntity();
    m2.setType("PRESTAMO");

    List<KardexEntity> movements = Arrays.asList(m1, m2);

    // Configuración del Mock
    when(kardexRepository.findAllByOrderByDateTimeDesc()).thenReturn(movements);

    // EJECUCIÓN: Corregido el tipo de retorno a List<KardexEntity>
    List<KardexEntity> result = kardexService.getAll();

    // VERIFICACIONES
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("INGRESO", result.get(0).getType());
    verify(kardexRepository, times(1)).findAllByOrderByDateTimeDesc();
  }

  // ------------------ getFilteredKardex() ------------------
  @Test
  void testGetFilteredKardex() {
    // Preparación de datos
    Long toolId = 1L;
    LocalDateTime start = LocalDateTime.now().minusDays(5);
    LocalDateTime end = LocalDateTime.now();

    KardexEntity m1 = new KardexEntity();
    m1.setType("DEVOLUCION");

    List<KardexEntity> expectedList = List.of(m1);

    // Configuración del Mock
    when(kardexRepository.findByToolAndDateRange(toolId, start, end)).thenReturn(expectedList);

    // EJECUCIÓN
    List<KardexEntity> result = kardexService.getFilteredKardex(toolId, start, end);

    // VERIFICACIONES
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals("DEVOLUCION", result.get(0).getType());
    verify(kardexRepository, times(1)).findByToolAndDateRange(toolId, start, end);
  }
}
