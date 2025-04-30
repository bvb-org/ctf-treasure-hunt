/**
 * ===== CHALLENGE 3: SQL INJECTION PREVENTION =====
 * 
 * Your task is to identify and fix the SQL injection vulnerability in this Java code.
 * This code is part of a user authentication system for a banking application.
 * 
 * INSTRUCTIONS:
 * 1. Identify the SQL injection vulnerability in the code
 * 2. Fix the vulnerability using proper security practices
 * 3. Find the hidden password in the comments of the fixed code
 * 4. Enter the password on the challenge page to unlock the next challenge
 * 
 * HINT: Always use parameterized queries instead of string concatenation
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class UserAuthentication {
    
    private static final String DB_URL = "jdbc:mysql://localhost:3306/bank_db";
    private static final String DB_USER = "app_user";
    private static final String DB_PASSWORD = "db_password_123";
    
    /**
     * Authenticates a user based on username and password
     * 
     * VULNERABLE CODE: This method is vulnerable to SQL injection attacks
     * For example, if username is: admin' --
     * The query becomes: SELECT * FROM users WHERE username='admin' --' AND password='anything'
     * This will comment out the password check and log in as admin
     */
    public boolean authenticateUser(String username, String password) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        boolean isAuthenticated = false;
        
        try {
            // Establish database connection
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            
            // Create statement
            stmt = conn.createStatement();
            
            // VULNERABILITY: Direct string concatenation in SQL query
            String sql = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
            
            // Execute query
            rs = stmt.executeQuery(sql);
            
            // Check if user exists
            if (rs.next()) {
                isAuthenticated = true;
                System.out.println("User authenticated successfully: " + username);
            } else {
                System.out.println("Authentication failed for user: " + username);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Close resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        
        return isAuthenticated;
    }
    
    /**
     * Main method to test the authentication
     */
    public static void main(String[] args) {
        UserAuthentication auth = new UserAuthentication();
        
        // Test with valid credentials
        boolean result1 = auth.authenticateUser("john.doe", "password123");
        System.out.println("Authentication result: " + result1);
        
        // Test with SQL injection attack
        boolean result2 = auth.authenticateUser("admin' --", "anything");
        System.out.println("Authentication result with injection: " + result2);
    }
}

/**
 * ===== SOLUTION (HIDDEN) =====
 * 
 * Fixed code should use PreparedStatement instead of Statement:
 * 
 * public boolean authenticateUser(String username, String password) {
 *     Connection conn = null;
 *     PreparedStatement pstmt = null;
 *     ResultSet rs = null;
 *     boolean isAuthenticated = false;
 *     
 *     try {
 *         // Establish database connection
 *         conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
 *         
 *         // Create prepared statement with placeholders
 *         String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
 *         pstmt = conn.prepareStatement(sql);
 *         
 *         // Set parameters safely
 *         pstmt.setString(1, username);
 *         pstmt.setString(2, password);
 *         
 *         // Execute query
 *         rs = pstmt.executeQuery();
 *         
 *         // Check if user exists
 *         if (rs.next()) {
 *             isAuthenticated = true;
 *             System.out.println("User authenticated successfully: " + username);
 *         } else {
 *             System.out.println("Authentication failed for user: " + username);
 *         }
 *         
 *     } catch (SQLException e) {
 *         e.printStackTrace();
 *     } finally {
 *         // Close resources
 *         try {
 *             if (rs != null) rs.close();
 *             if (pstmt != null) pstmt.close();
 *             if (conn != null) conn.close();
 *         } catch (SQLException e) {
 *             e.printStackTrace();
 *         }
 *     }
 *     
 *     return isAuthenticated;
 * }
 * 
 * Password: ParamQuery789
 */