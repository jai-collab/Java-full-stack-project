package dev.project.Todo_Application.repository;

import dev.project.Todo_Application.models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // Custom query to find todos by user (if you have user authentication)
    List<Todo> findByUserId(Long userId);
}