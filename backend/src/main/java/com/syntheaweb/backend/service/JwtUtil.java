package com.syntheaweb.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Utility class for JWT generation, validation, and extraction.
 */
@Service
public class JwtUtil {

    private static final long EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

    private final Key key;

    /**
     * Constructor for JwtUtil.
     *
     * @param secretKey The JWT secret key loaded from the environment.
     * 
     * If you want to build the backend without docker you need to set the key manually as a variable or in application.properties
     */
    public JwtUtil(@Value("${jwt.secret.key}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }
    /**
     * Generates a JWT token for a given username.
     *
     * @param username the username for which the token is generated.
     * @return a signed JWT token.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts the username from a given JWT token.
     *
     * @param token the JWT token.
     * @return the extracted username.
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Validates the given token against a username.
     *
     * @param token    the JWT token.
     * @param username the expected username.
     * @return true if the token is valid and not expired, otherwise false.
     */
    public boolean validateToken(String token, String username) {
        try {
            return extractUsername(token).equals(username) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
        } catch (JwtException e) {
            System.err.println("Token validation failed: " + e.getMessage());
        }
        return false;
    }

    /**
     * Checks if a given token has expired.
     *
     * @param token the JWT token.
     * @return true if the token is expired, otherwise false.
     */
    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }
}
