package dev.project.Todo_Application;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "message", "✅ Todo App Server is running successfully!",
                "status", "OK",
                "timestamp", Instant.now().toString()
        );
    }

    // REMOVE OR COMMENT OUT THIS DUPLICATE ENDPOINT
    // @GetMapping("/auth/test")
    // public Map<String, String> test() {
    //     return Map.of("message", "Backend test endpoint working!");
    // }
}