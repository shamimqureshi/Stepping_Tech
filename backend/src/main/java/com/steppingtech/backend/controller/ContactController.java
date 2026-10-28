package com.steppingtech.backend.controller;

import com.steppingtech.backend.model.ContactMessage;
import com.steppingtech.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*") // Allows your frontend to communicate with backend
public class ContactController {

    @Autowired
    private ContactMessageRepository contactRepository;

    @PostMapping
    public ResponseEntity<String> receiveContactForm(@RequestBody ContactMessage contactMessage) {
        try {
            // Save to Database
            contactRepository.save(contactMessage);

            // Return success to the frontend
            return ResponseEntity.ok("Message saved to database successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving message to database.");
        }
    }
}