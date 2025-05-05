/**
 * Custom Modal Component
 * A beautiful animated modal to replace all alert(), confirm() dialogs
 */

class CustomModal {
    constructor() {
        this.modalOverlay = null;
        this.modalContainer = null;
        this.isOpen = false;
        this.confirmCallback = null;
        this.cancelCallback = null;
        
        // Create modal elements
        this.createModalElements();
    }
    
    /**
     * Create modal DOM elements
     */
    createModalElements() {
        // Create overlay
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.className = 'modal-overlay';
        
        // Create container
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'modal-container';
        
        // Add container to overlay
        this.modalOverlay.appendChild(this.modalContainer);
        
        // Add overlay to body
        document.body.appendChild(this.modalOverlay);
        
        // Add click event to close modal when clicking overlay
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.close();
                if (this.cancelCallback) {
                    this.cancelCallback();
                }
            }
        });
        
        // Add keydown event to close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                if (this.cancelCallback) {
                    this.cancelCallback();
                }
            }
        });
    }
    
    /**
     * Show an alert modal
     * @param {string} message - The message to display
     * @param {string} title - The title of the modal (optional)
     * @param {string} type - The type of modal (default, success, error, info)
     * @param {Function} callback - Function to call when modal is closed
     */
    alert(message, title = 'Alert', type = 'default', callback = null) {
        // Clear previous content
        this.modalContainer.innerHTML = '';
        this.modalContainer.className = 'modal-container';
        
        if (type !== 'default') {
            this.modalContainer.classList.add(`modal-${type}`);
        }
        
        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'modal-title';
        titleElement.textContent = title;
        header.appendChild(titleElement);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        // Add icon based on type
        const iconContainer = document.createElement('div');
        iconContainer.className = 'modal-icon';
        
        const icon = document.createElement('i');
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle';
                break;
            default:
                icon.className = 'fas fa-bell';
        }
        
        iconContainer.appendChild(icon);
        body.appendChild(iconContainer);
        
        // Add message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        body.appendChild(messageElement);
        
        // Create footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        const okButton = document.createElement('button');
        okButton.className = 'modal-btn modal-btn-primary';
        okButton.textContent = 'OK';
        okButton.addEventListener('click', () => {
            this.close();
            if (callback) {
                callback(true);
            }
        });
        
        // Add ripple effect to button
        okButton.addEventListener('mousedown', this.createRippleEffect);
        
        footer.appendChild(okButton);
        
        // Assemble modal
        this.modalContainer.appendChild(header);
        this.modalContainer.appendChild(body);
        this.modalContainer.appendChild(footer);
        
        // Show modal
        this.open();
        
        // Focus on OK button
        setTimeout(() => {
            okButton.focus();
        }, 100);
    }
    
    /**
     * Show a confirm modal
     * @param {string} message - The message to display
     * @param {string} title - The title of the modal (optional)
     * @param {Function} confirmCallback - Function to call when confirmed
     * @param {Function} cancelCallback - Function to call when canceled
     */
    confirm(message, title = 'Confirm', confirmCallback = null, cancelCallback = null) {
        // Store callbacks
        this.confirmCallback = confirmCallback;
        this.cancelCallback = cancelCallback;
        
        // Clear previous content
        this.modalContainer.innerHTML = '';
        this.modalContainer.className = 'modal-container modal-confirm';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const titleElement = document.createElement('h3');
        titleElement.className = 'modal-title';
        titleElement.textContent = title;
        header.appendChild(titleElement);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        // Add icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'modal-icon';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-question-circle';
        
        iconContainer.appendChild(icon);
        body.appendChild(iconContainer);
        
        // Add message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        body.appendChild(messageElement);
        
        // Create footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'modal-btn modal-btn-secondary';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            this.close();
            if (cancelCallback) {
                cancelCallback();
            }
        });
        
        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-btn modal-btn-primary';
        confirmButton.textContent = 'Confirm';
        confirmButton.addEventListener('click', () => {
            this.close();
            if (confirmCallback) {
                confirmCallback();
            }
        });
        
        // Add ripple effect to buttons
        cancelButton.addEventListener('mousedown', this.createRippleEffect);
        confirmButton.addEventListener('mousedown', this.createRippleEffect);
        
        footer.appendChild(cancelButton);
        footer.appendChild(confirmButton);
        
        // Assemble modal
        this.modalContainer.appendChild(header);
        this.modalContainer.appendChild(body);
        this.modalContainer.appendChild(footer);
        
        // Show modal
        this.open();
        
        // Focus on confirm button
        setTimeout(() => {
            confirmButton.focus();
        }, 100);
        
        // Return false to prevent default confirm behavior
        return false;
    }
    
    /**
     * Open the modal
     */
    open() {
        this.isOpen = true;
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add pulse animation
        setTimeout(() => {
            this.modalContainer.classList.add('pulse');
            
            // Remove pulse class after animation completes
            setTimeout(() => {
                this.modalContainer.classList.remove('pulse');
            }, 1500);
        }, 300);
    }
    
    /**
     * Close the modal
     */
    close() {
        this.isOpen = false;
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset callbacks
        this.confirmCallback = null;
        this.cancelCallback = null;
    }
    
    /**
     * Create ripple effect on button click
     * @param {Event} e - The mouse event
     */
    createRippleEffect(e) {
        const button = e.currentTarget;
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Get position
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set position
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Create global modal instance
const modal = new CustomModal();

// Replace native alert
window.originalAlert = window.alert;
window.alert = function(message) {
    modal.alert(message);
};

// Replace native confirm
window.originalConfirm = window.confirm;
window.confirm = function(message) {
    return new Promise((resolve) => {
        modal.confirm(message, 'Confirm', () => resolve(true), () => resolve(false));
    });
};

/**
 * Show a success message
 * @param {string} message - The message to display
 * @param {string} title - The title of the modal (optional)
 * @param {Function} callback - Function to call when modal is closed
 */
window.showSuccess = function(message, title = 'Success', callback = null) {
    modal.alert(message, title, 'success', callback);
};

/**
 * Show an error message
 * @param {string} message - The message to display
 * @param {string} title - The title of the modal (optional)
 * @param {Function} callback - Function to call when modal is closed
 */
window.showError = function(message, title = 'Error', callback = null) {
    modal.alert(message, title, 'error', callback);
};

/**
 * Show an info message
 * @param {string} message - The message to display
 * @param {string} title - The title of the modal (optional)
 * @param {Function} callback - Function to call when modal is closed
 */
window.showInfo = function(message, title = 'Information', callback = null) {
    modal.alert(message, title, 'info', callback);
};