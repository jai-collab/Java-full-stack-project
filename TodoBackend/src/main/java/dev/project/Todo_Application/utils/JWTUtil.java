package dev.project.Todo_Application.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTUtil {

    private static final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long expiration = 1000 * 60 * 60 * 10; // 10 hours

    public static String generateToken(String email) {
        System.out.println("🔐 Generating token for: " + email);
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            System.out.println("🔐 Extracted username from token: " + username);
            return username;
        } catch (Exception e) {
            System.out.println("❌ Error extracting username from token: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("🔐 Validating token...");
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            System.out.println("✅ Token is valid");
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("❌ Token expired: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("❌ Invalid token format: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("❌ Token validation failed: " + e.getMessage());
        }
        return false;
    }
}