package dev.project.Todo_Application.controller;

import dev.project.Todo_Application.models.Todo;
import dev.project.Todo_Application.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/todo")
public class TodoController {

    @Autowired
    private TodoService todoService;

    // Get all todos
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        try {
            List<Todo> todos = todoService.getAllTodos();
            return ResponseEntity.ok(todos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get todo by ID
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        try {
            Optional<Todo> todo = todoService.getTodoById(id);
            if (todo.isPresent()) {
                return ResponseEntity.ok(todo.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Create new todo
    @PostMapping("/create")
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        try {
            Todo createdTodo = todoService.createTodo(todo);
            return ResponseEntity.ok(createdTodo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update todo
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        try {
            Todo updatedTodo = todoService.updateTodo(id, todoDetails);
            if (updatedTodo != null) {
                return ResponseEntity.ok(updatedTodo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete todo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        try {
            todoService.deleteTodo(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}