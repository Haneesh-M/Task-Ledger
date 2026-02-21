package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.request.LoginRequest;
import com.blaze.expense.tracking.dto.request.RegisterRequest;
import com.blaze.expense.tracking.dto.response.MessageResponse;
import com.blaze.expense.tracking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        String responseMessage = authService.register(signUpRequest);
        return ResponseEntity.ok(new MessageResponse(responseMessage));
    }
}
