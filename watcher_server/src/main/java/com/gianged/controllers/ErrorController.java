package com.gianged.controllers;

import com.gianged.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("watcher/error")
public class ErrorController {

    @GetMapping
    public ResponseEntity<ErrorResponse> handleError(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        String message = (String) request.getAttribute("javax.servlet.error.message");

        ErrorResponse errorResponse = new ErrorResponse(
                statusCode != null ? statusCode : 500,
                message != null ? message : "An unexpected error occurred"
        );

        return ResponseEntity.status(errorResponse.getErrorCode()).body(errorResponse);
    }
}
