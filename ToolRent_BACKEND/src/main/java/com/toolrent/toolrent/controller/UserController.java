package com.toolrent.toolrent.controller;

import com.toolrent.toolrent.entity.UserEntity;
import com.toolrent.toolrent.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  // Crear usuario
  @PostMapping("/createUser")
  public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity user) {
    UserEntity savedUser = userService.save(user);
    return ResponseEntity.ok(savedUser);
  }

  // Obtener todos los usuarios
  @GetMapping("/getUsers")
  public ResponseEntity<List<UserEntity>> getAllUsers() {
    return ResponseEntity.ok(userService.findAll());
  }

  // Obtener usuario por id
  @GetMapping("/{id}")
  public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
    UserEntity user = userService.findById(id);
    return ResponseEntity.ok(user);
  }

  @PutMapping("/{userId}/status")
  public ResponseEntity<String> updateUserStatus(
      @PathVariable Long userId, @RequestParam boolean finePaid) {
    userService.updateUserStatus(userId, finePaid);
    return ResponseEntity.ok("Estado del usuario actualizado correctamente");
  }

  @PutMapping("/{userId}")
  public ResponseEntity<UserEntity> updateUser(
      @PathVariable Long userId, @RequestBody UserEntity userDetails) {
    UserEntity updatedUser = userService.updateUser(userId, userDetails);
    return ResponseEntity.ok(updatedUser);
  }
}
