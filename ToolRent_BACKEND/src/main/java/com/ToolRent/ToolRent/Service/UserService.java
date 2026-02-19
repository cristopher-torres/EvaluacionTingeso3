package com.ToolRent.ToolRent.Service;

import com.ToolRent.ToolRent.Entity.UserEntity;
import com.ToolRent.ToolRent.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserEntity save(UserEntity user) {
        // Verificar si el RUT ya está registrado
        Optional<UserEntity> existingUser = userRepository.findByRut(user.getRut());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El RUT ya está registrado.");
        }

        // Si no existe un RUT duplicado, guardamos el usuario
        return userRepository.save(user);
    }


    // Obtener todos los usuarios
    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }


    public UserEntity findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void checkActiveLoans(Long userId) {
        long activeLoans = userRepository.countActiveLoans(userId);
        if (activeLoans >= 5) {
            throw new RuntimeException("El usuario ya tiene 5 prestamos activos no puede tomar otro prestamo.");
        }
    }

    public void checkDuplicateToolLoan(Long userId, String toolName) {
        int activeLoans = userRepository.countActiveLoansByToolName(userId, toolName);
        if (activeLoans >= 1) {
            throw new RuntimeException("El usuario ya tiene el máximo de préstamos permitidos para esta herramienta");
        }
    }

    @Transactional
    public void restrictUserById(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!"RESTRINGIDO".equalsIgnoreCase(user.getStatus())) {
            user.setStatus("RESTRINGIDO");
            userRepository.save(user);
        }
    }

    @Transactional
    public void updateUserStatus(Long userId, boolean finePaid) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (finePaid) {
            user.setStatus("ACTIVO");  // Usuario libre de restricciones
        } else {
            user.setStatus("RESTRINGIDO");  // Usuario con multa pendiente
        }

        userRepository.save(user);
    }

    public UserEntity updateUser(Long userId, UserEntity userDetails) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar los campos del usuario
        user.setRut(userDetails.getRut());
        user.setName(userDetails.getName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setStatus(userDetails.getStatus());
        user.setUsername(userDetails.getUsername());
        user.setRole(userDetails.getRole());

        // Guardar el usuario actualizado
        UserEntity updatedUser = userRepository.save(user);
        return updatedUser;
    }
}

