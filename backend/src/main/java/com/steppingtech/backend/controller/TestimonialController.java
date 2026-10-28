package com.steppingtech.backend.controller;


import com.steppingtech.backend.model.Testimonial;
import com.steppingtech.backend.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    @Autowired
    private TestimonialRepository repository;

    @GetMapping
    public List<Testimonial> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Testimonial create(@RequestBody Testimonial testimonial) {
        return repository.save(testimonial);
    }

    @PutMapping("/{id}")
    public Testimonial update(@PathVariable Long id, @RequestBody Testimonial testimonial) {
        testimonial.setId(id);
        return repository.save(testimonial);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}