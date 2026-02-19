package com.ToolRent.ToolRent.Service;

import com.ToolRent.ToolRent.Entity.UserEntity;
import com.ToolRent.ToolRent.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- save() ---
    @Test
    void testSaveUser() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setStatus("ACTIVO");

        when(userRepository.save(user)).thenReturn(user);

        UserEntity result = userService.save(user);

        assertNotNull(result);
        assertEquals("ACTIVO", result.getStatus());
        assertEquals("test@test.com", result.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    // --- findAll() ---
    @Test
    void testFindAllUsers() {
        UserEntity u1 = new UserEntity();
        u1.setId(1L);
        u1.setEmail("user1@test.com");
        UserEntity u2 = new UserEntity();
        u2.setId(2L);
        u2.setEmail("user2@test.com");

        List<UserEntity> users = new ArrayList<>();
        users.add(u1);
        users.add(u2);

        when(userRepository.findAll()).thenReturn(users);

        List<UserEntity> result = userService.findAll();

        assertEquals(2, result.size());
        assertEquals("user1@test.com", result.get(0).getEmail());
        verify(userRepository, times(1)).findAll();
    }

    // --- findById() ---
    @Test
    void testFindByIdExisting() {
        UserEntity user = new UserEntity();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserEntity result = userService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByIdNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.findById(1L);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(userRepository, times(1)).findById(1L);
    }

    // --- checkActiveLoans() ---
    @Test
    void testCheckActiveLoansUnderLimit() {
        when(userRepository.countActiveLoans(1L)).thenReturn(3L);

        assertDoesNotThrow(() -> userService.checkActiveLoans(1L));
        verify(userRepository, times(1)).countActiveLoans(1L);
    }

    @Test
    void testCheckActiveLoansAtLimit() {
        when(userRepository.countActiveLoans(1L)).thenReturn(5L);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.checkActiveLoans(1L));
        assertTrue(ex.getMessage().contains("ya tiene 5 prestamos activos"));
        verify(userRepository, times(1)).countActiveLoans(1L);
    }

    // --- checkDuplicateToolLoan() ---
    @Test
    void testCheckDuplicateToolLoanNone() {
        when(userRepository.countActiveLoansByToolName(1L, "Taladro")).thenReturn(0);

        assertDoesNotThrow(() -> userService.checkDuplicateToolLoan(1L, "Taladro"));
        verify(userRepository, times(1)).countActiveLoansByToolName(1L, "Taladro");
    }

    @Test
    void testCheckDuplicateToolLoanExists() {
        when(userRepository.countActiveLoansByToolName(1L, "Taladro")).thenReturn(1);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.checkDuplicateToolLoan(1L, "Taladro"));
        assertTrue(ex.getMessage().contains("ya tiene el máximo de préstamos"));
        verify(userRepository, times(1)).countActiveLoansByToolName(1L, "Taladro");
    }

    // --- restrictUserById() ---
    @Test
    void testRestrictUserByIdNotRestricted() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setStatus("ACTIVO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.restrictUserById(1L);

        assertEquals("RESTRINGIDO", user.getStatus());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testRestrictUserByIdAlreadyRestricted() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setStatus("RESTRINGIDO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.restrictUserById(1L);

        assertEquals("RESTRINGIDO", user.getStatus());
        verify(userRepository, never()).save(user);
    }

    // --- updateUserStatus() ---
    @Test
    void testUpdateUserStatusFinePaid() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setStatus("RESTRINGIDO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.updateUserStatus(1L, true);

        assertEquals("ACTIVO", user.getStatus());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testUpdateUserStatusFineNotPaid() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setStatus("ACTIVO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.updateUserStatus(1L, false);

        assertEquals("RESTRINGIDO", user.getStatus());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testUpdateUser() {
        // Crear un usuario inicial con algunos valores
        UserEntity existingUser = new UserEntity();
        existingUser.setId(1L);
        existingUser.setRut("12345678");
        existingUser.setName("Juan");
        existingUser.setLastName("Pérez");
        existingUser.setEmail("juan.perez@test.com");
        existingUser.setPhoneNumber("123456789");
        existingUser.setStatus("ACTIVO");
        existingUser.setUsername("juanperez");
        existingUser.setRole("USER");

        // Detalles nuevos para actualizar
        UserEntity updatedDetails = new UserEntity();
        updatedDetails.setRut("87654321");
        updatedDetails.setName("Juan Carlos");
        updatedDetails.setLastName("Pérez García");
        updatedDetails.setEmail("juancarlos.perez@test.com");
        updatedDetails.setPhoneNumber("987654321");
        updatedDetails.setStatus("ACTIVO");
        updatedDetails.setUsername("juancarlosperez");
        updatedDetails.setRole("ADMIN");


        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));


        when(userRepository.save(any(UserEntity.class))).thenReturn(updatedDetails);


        UserEntity result = userService.updateUser(1L, updatedDetails);

        // Verificar que el usuario actualizado es el esperado
        assertNotNull(result);
        assertEquals("87654321", result.getRut());
        assertEquals("Juan Carlos", result.getName());
        assertEquals("Pérez García", result.getLastName());
        assertEquals("juancarlos.perez@test.com", result.getEmail());
        assertEquals("987654321", result.getPhoneNumber());
        assertEquals("ACTIVO", result.getStatus());
        assertEquals("juancarlosperez", result.getUsername());
        assertEquals("ADMIN", result.getRole());

        // Verificar que se llama al repositorio save
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }


}