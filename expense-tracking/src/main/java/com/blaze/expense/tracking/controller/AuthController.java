package com.blaze.expense.tracking.controller;

import com.blaze.expense.tracking.dto.request.LoginRequest;
import com.blaze.expense.tracking.dto.request.RegisterRequest;
import com.blaze.expense.tracking.dto.response.MessageResponse;
import com.blaze.expense.tracking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.blaze.expense.tracking.dto.request.ChangePasswordRequest;
import com.blaze.expense.tracking.dto.request.ForgotPasswordRequest;
import com.blaze.expense.tracking.dto.request.ResetPasswordRequest;
import com.blaze.expense.tracking.security.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String responseMessage = authService.forgotPassword(request);
        return ResponseEntity.ok(new MessageResponse(responseMessage));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String responseMessage = authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponse(responseMessage));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String responseMessage = authService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(new MessageResponse(responseMessage));
    }
}
