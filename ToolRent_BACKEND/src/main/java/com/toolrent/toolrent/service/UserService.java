package com.toolrent.toolrent.service;

import com.toolrent.toolrent.entity.UserEntity;
import com.toolrent.toolrent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  private static final String USER_NOT_FOUND_MESSAGE = "Usuario no encontrado";

  private static final String STATUS_RESTRICTED = "RESTRINGIDO";

  public UserEntity save(UserEntity user) {
    // 1. Validar RUT único
    if (userRepository.findByRut(user.getRut()).isPresent()) {
      throw new IllegalStateException("El RUT ya está registrado.");
    }

    // 2. Validar Username único
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
      throw new IllegalStateException(
          "El nombre de usuario '" + user.getUsername() + "' ya está en uso.");
    }

    // 3. Validar Email único
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new IllegalStateException("El correo electrónico ya está registrado.");
    }

    // 4. Validar Teléfono único
    if (userRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
      throw new IllegalStateException("El número de teléfono ya está registrado.");
    }

    return userRepository.save(user);
  }

  // Obtener todos los usuarios
  public List<UserEntity> findAll() {
    return userRepository.findAll();
  }

  public UserEntity findById(Long id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MESSAGE));
  }

  public void checkActiveLoans(Long userId) {
    long activeLoans = userRepository.countActiveLoans(userId);
    if (activeLoans >= 5) {
      throw new IllegalStateException(
          "El usuario ya tiene 5 prestamos activos no puede tomar otro prestamo.");
    }
  }

  public void checkDuplicateToolLoan(Long userId, String toolName) {
    int activeLoans = userRepository.countActiveLoansByToolName(userId, toolName);
    if (activeLoans >= 1) {
      throw new IllegalStateException(
          "El usuario ya tiene el máximo de préstamos permitidos para esta herramienta");
    }
  }

  @Transactional
  public void restrictUserById(Long userId) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MESSAGE));

    if (!STATUS_RESTRICTED.equalsIgnoreCase(user.getStatus())) {
      user.setStatus(STATUS_RESTRICTED);
      userRepository.save(user);
    }
  }

  @Transactional
  public void updateUserStatus(Long userId, boolean finePaid) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MESSAGE));

    if (finePaid) {
      user.setStatus("ACTIVO"); // Usuario libre de restricciones
    } else {
      user.setStatus(STATUS_RESTRICTED); // Usuario con multa pendiente
    }

    userRepository.save(user);
  }

  public UserEntity updateUser(Long userId, UserEntity userDetails) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MESSAGE));

    // Actualizar los campos del usuario
    user.setRut(userDetails.getRut());
    user.setName(userDetails.getName());
    user.setLastName(userDetails.getLastName());
    user.setEmail(userDetails.getEmail());
    user.setPhoneNumber(userDetails.getPhoneNumber());
    user.setStatus(userDetails.getStatus());
    user.setUsername(userDetails.getUsername());
    user.setRole(userDetails.getRole());

    return userRepository.save(user);
  }

  public boolean hasUnpaidFinesOrDebts(Long userId) {
    return userRepository.countUnpaidLoansByUserId(userId) > 0;
  }

  public boolean hasOverdueLoans(Long userId) {
    return userRepository.countOverdueLoansByUserId(userId, LocalDate.now()) > 0;
  }
}
