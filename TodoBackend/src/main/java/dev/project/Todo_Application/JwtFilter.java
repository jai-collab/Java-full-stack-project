package dev.project.Todo_Application;

import dev.project.Todo_Application.utils.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("🔐 JWT Filter - Authorization Header: " + authHeader);
        System.out.println("🔐 JWT Filter - Request URI: " + request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("🔐 JWT Filter - Token received: " + token.substring(0, Math.min(20, token.length())) + "...");

            try {
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.extractUsername(token);
                    System.out.println("✅ JWT Filter - Token valid for user: " + email);

                    var auth = new UsernamePasswordAuthenticationToken(email, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("✅ JWT Filter - Authentication set for: " + email);
                } else {
                    System.out.println("❌ JWT Filter - Token validation failed");
                }
            } catch (Exception e) {
                System.out.println("❌ JWT Filter - Error validating token: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("🔐 JWT Filter - No Bearer token found");
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Don't filter auth endpoints
        boolean shouldNotFilter = path.startsWith("/auth/");
        System.out.println("🔐 JWT Filter - Should not filter " + path + ": " + shouldNotFilter);
        return shouldNotFilter;
    }
}