package dev.project.Todo_Application.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "todos")
@Data
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private boolean isCompleted = false;

    // Many-to-one relationship with User (if you have user authentication)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Default constructor
    public Todo() {}

    // Constructor for easy creation
    public Todo(String title) {
        this.title = title;
        this.isCompleted = false;
    }
}