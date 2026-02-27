package com.ToolRent.ToolRent.Controller;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleIllegalStateExceptionTest() {
        // Simula el error de "Cliente no disponible"
        String errorMessage = "El cliente no esta disponible para realizar un prestamo";
        IllegalStateException ex = new IllegalStateException(errorMessage);

        ResponseEntity<String> response = handler.handleIllegalStateException(ex);

        // Verifica que devuelva 409 CONFLICT como configuramos
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleEntityNotFoundExceptionTest() {
        // Simula el error de "Préstamo no encontrado"
        String errorMessage = "Préstamo no encontrado";
        EntityNotFoundException ex = new EntityNotFoundException(errorMessage);

        ResponseEntity<String> response = handler.handleEntityNotFoundException(ex);

        // Verifica que devuelva 404 NOT FOUND
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleIllegalArgumentExceptionTest() {
        String errorMessage = "Argumento inválido";
        IllegalArgumentException ex = new IllegalArgumentException(errorMessage);

        ResponseEntity<String> response = handler.handleIllegalArgumentException(ex);

        // Verifica que devuelva 400 BAD REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleRuntimeExceptionTest() {
        String errorMessage = "Error inesperado";
        RuntimeException ex = new RuntimeException(errorMessage);

        ResponseEntity<String> response = handler.handleRuntimeException(ex);

        // Verifica que devuelva 500 INTERNAL SERVER ERROR como red de seguridad
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Ocurrió un error inesperado: " + errorMessage, response.getBody());
    }
}