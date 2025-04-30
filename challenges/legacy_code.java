/**
 * ===== CHALLENGE 8: THE LEGACY CODE =====
 * 
 * Your task is to refactor this legacy Java code to follow modern best practices.
 * This code is part of a banking system that processes customer transactions.
 * 
 * INSTRUCTIONS:
 * 1. Identify code smells and anti-patterns in the legacy code
 * 2. Refactor the code to follow SOLID principles and design patterns
 * 3. Improve error handling, logging, and maintainability
 * 4. Find the hidden password in the comments of the refactored code
 * 5. Enter the password on the challenge page to complete the treasure hunt
 * 
 * HINT: Apply SOLID principles and design patterns
 */

import java.util.*;
import java.text.SimpleDateFormat;

// This class handles all transaction processing
public class TransactionProcessor {
    
    // Global variables
    public static String DB_CONNECTION = "jdbc:mysql://localhost:3306/bank_db";
    public static String DB_USER = "admin";
    public static String DB_PASSWORD = "password123";
    public static boolean DEBUG_MODE = true;
    
    // Transaction types
    public static final int TRANSACTION_TYPE_DEPOSIT = 1;
    public static final int TRANSACTION_TYPE_WITHDRAWAL = 2;
    public static final int TRANSACTION_TYPE_TRANSFER = 3;
    
    // Process a transaction
    public boolean processTransaction(int type, double amount, String fromAccount, String toAccount, String description) {
        // Print debug information
        if (DEBUG_MODE) {
            System.out.println("Processing transaction: Type=" + type + ", Amount=" + amount + 
                              ", From=" + fromAccount + ", To=" + toAccount + ", Description=" + description);
        }
        
        // Validate transaction
        if (amount <= 0) {
            System.out.println("Error: Invalid amount");
            return false;
        }
        
        if (fromAccount == null || fromAccount.trim().equals("")) {
            System.out.println("Error: Invalid source account");
            return false;
        }
        
        // Process based on transaction type
        if (type == TRANSACTION_TYPE_DEPOSIT) {
            return processDeposit(amount, toAccount, description);
        } else if (type == TRANSACTION_TYPE_WITHDRAWAL) {
            return processWithdrawal(amount, fromAccount, description);
        } else if (type == TRANSACTION_TYPE_TRANSFER) {
            return processTransfer(amount, fromAccount, toAccount, description);
        } else {
            System.out.println("Error: Invalid transaction type");
            return false;
        }
    }
    
    // Process a deposit
    private boolean processDeposit(double amount, String accountNumber, String description) {
        // Check if account exists
        if (!accountExists(accountNumber)) {
            System.out.println("Error: Account does not exist");
            return false;
        }
        
        // Get current balance
        double currentBalance = getAccountBalance(accountNumber);
        
        // Update balance
        double newBalance = currentBalance + amount;
        
        // Update database
        boolean success = updateAccountBalance(accountNumber, newBalance);
        
        if (success) {
            // Log transaction
            logTransaction(TRANSACTION_TYPE_DEPOSIT, amount, null, accountNumber, description);
            
            // Print success message
            System.out.println("Deposit successful. New balance: " + newBalance);
            return true;
        } else {
            System.out.println("Error: Failed to process deposit");
            return false;
        }
    }
    
    // Process a withdrawal
    private boolean processWithdrawal(double amount, String accountNumber, String description) {
        // Check if account exists
        if (!accountExists(accountNumber)) {
            System.out.println("Error: Account does not exist");
            return false;
        }
        
        // Get current balance
        double currentBalance = getAccountBalance(accountNumber);
        
        // Check if sufficient funds
        if (currentBalance < amount) {
            System.out.println("Error: Insufficient funds");
            return false;
        }
        
        // Update balance
        double newBalance = currentBalance - amount;
        
        // Update database
        boolean success = updateAccountBalance(accountNumber, newBalance);
        
        if (success) {
            // Log transaction
            logTransaction(TRANSACTION_TYPE_WITHDRAWAL, amount, accountNumber, null, description);
            
            // Print success message
            System.out.println("Withdrawal successful. New balance: " + newBalance);
            return true;
        } else {
            System.out.println("Error: Failed to process withdrawal");
            return false;
        }
    }
    
    // Process a transfer
    private boolean processTransfer(double amount, String fromAccount, String toAccount, String description) {
        // Check if accounts exist
        if (!accountExists(fromAccount)) {
            System.out.println("Error: Source account does not exist");
            return false;
        }
        
        if (!accountExists(toAccount)) {
            System.out.println("Error: Destination account does not exist");
            return false;
        }
        
        // Get current balances
        double fromBalance = getAccountBalance(fromAccount);
        double toBalance = getAccountBalance(toAccount);
        
        // Check if sufficient funds
        if (fromBalance < amount) {
            System.out.println("Error: Insufficient funds");
            return false;
        }
        
        // Update balances
        double newFromBalance = fromBalance - amount;
        double newToBalance = toBalance + amount;
        
        // Update database
        boolean success1 = updateAccountBalance(fromAccount, newFromBalance);
        boolean success2 = updateAccountBalance(toAccount, newToBalance);
        
        if (success1 && success2) {
            // Log transaction
            logTransaction(TRANSACTION_TYPE_TRANSFER, amount, fromAccount, toAccount, description);
            
            // Print success message
            System.out.println("Transfer successful. New source balance: " + newFromBalance);
            return true;
        } else {
            // Rollback if one update failed
            if (success1 && !success2) {
                updateAccountBalance(fromAccount, fromBalance);
            }
            
            System.out.println("Error: Failed to process transfer");
            return false;
        }
    }
    
    // Check if account exists
    private boolean accountExists(String accountNumber) {
        // In a real application, this would check the database
        // For this example, we'll just return true
        return true;
    }
    
    // Get account balance
    private double getAccountBalance(String accountNumber) {
        // In a real application, this would query the database
        // For this example, we'll just return a random balance
        return 1000.0 + Math.random() * 9000.0;
    }
    
    // Update account balance
    private boolean updateAccountBalance(String accountNumber, double newBalance) {
        // In a real application, this would update the database
        // For this example, we'll just return true
        return true;
    }
    
    // Log transaction
    private void logTransaction(int type, double amount, String fromAccount, String toAccount, String description) {
        // Get current date and time
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String timestamp = dateFormat.format(now);
        
        // Create log entry
        String logEntry = timestamp + " | " + 
                         "Type: " + type + " | " +
                         "Amount: " + amount + " | " +
                         "From: " + (fromAccount != null ? fromAccount : "N/A") + " | " +
                         "To: " + (toAccount != null ? toAccount : "N/A") + " | " +
                         "Description: " + description;
        
        // In a real application, this would write to a log file or database
        // For this example, we'll just print to console
        System.out.println("LOG: " + logEntry);
    }
    
    // Main method for testing
    public static void main(String[] args) {
        TransactionProcessor processor = new TransactionProcessor();
        
        // Test deposit
        processor.processTransaction(TRANSACTION_TYPE_DEPOSIT, 500.0, null, "123456", "Initial deposit");
        
        // Test withdrawal
        processor.processTransaction(TRANSACTION_TYPE_WITHDRAWAL, 200.0, "123456", null, "ATM withdrawal");
        
        // Test transfer
        processor.processTransaction(TRANSACTION_TYPE_TRANSFER, 300.0, "123456", "789012", "Monthly rent");
    }
}

/**
 * ===== SOLUTION (HIDDEN) =====
 * 
 * Refactored code should address these issues:
 * 
 * 1. Single Responsibility Principle: Split into multiple classes (Transaction, Account, TransactionService, etc.)
 * 2. Open/Closed Principle: Use interfaces and inheritance for transaction types
 * 3. Dependency Inversion: Use dependency injection for database access
 * 4. Encapsulation: Make fields private and use getters/setters
 * 5. Error Handling: Use exceptions instead of boolean returns
 * 6. Configuration: Move database credentials to a config file
 * 7. Logging: Use a proper logging framework
 * 8. Transaction Safety: Use transactions for database operations
 * 
 * Example refactored structure:
 * - Transaction (interface)
 *   - DepositTransaction
 *   - WithdrawalTransaction
 *   - TransferTransaction
 * - Account
 * - TransactionService
 * - AccountService
 * - DatabaseService
 * - LoggingService
 * - ConfigurationService
 * 
 * Password: RefactorMaster2025
 */