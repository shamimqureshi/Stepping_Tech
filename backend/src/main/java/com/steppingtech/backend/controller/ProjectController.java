package com.steppingtech.backend.controller;


import com.steppingtech.backend.model.Project;
import com.steppingtech.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository repository;

    @GetMapping
    public List<Project> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return repository.save(project);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return repository.save(project);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}