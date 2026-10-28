package com.steppingtech.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "testimonials")
public class Testimonial {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

    private String name;
    private String role;

    @Column(columnDefinition = "TEXT")
    private String text;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}