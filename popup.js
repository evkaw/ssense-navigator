// SSENSE Navigator Popup Script
// Handles the extension popup interface

document.addEventListener('DOMContentLoaded', function() {
    console.log('SSENSE Navigator popup loaded');
    
    // Check if we're on a SSENSE page
    checkCurrentPage();
    
    // Add event listeners for any interactive elements
    setupEventListeners();
});

// Check what page the user is currently on
async function checkCurrentPage() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentPageElement = document.getElementById('currentPage');
        
        if (tab.url && (tab.url.includes('ssense.com') && tab.url.includes('/product/'))) {
            currentPageElement.textContent = 'SSENSE Product Page ✅';
            currentPageElement.style.color = '#2d5a2d';
            
            // Show extension is active
            showExtensionStatus(true);
        } else if (tab.url && tab.url.includes('ssense.com')) {
            currentPageElement.textContent = 'SSENSE (Navigate to product)';
            currentPageElement.style.color = '#b8860b';
            
            showExtensionStatus(false);
        } else {
            currentPageElement.textContent = 'Not on SSENSE';
            currentPageElement.style.color = '#cc6666';
            
            showExtensionStatus(false);
        }
    } catch (error) {
        console.error('Error checking current page:', error);
        document.getElementById('currentPage').textContent = 'Unknown';
    }
}

// Show/hide extension status
function showExtensionStatus(isActive) {
    const shortcuts = document.querySelector('.shortcuts');
    const sizePrefs = document.querySelector('.size-preferences');
    
    if (isActive) {
        shortcuts.style.opacity = '1';
        sizePrefs.style.opacity = '1';
        
        // Add a subtle animation to show it's active
        shortcuts.style.animation = 'fadeIn 0.3s ease-in-out';
        sizePrefs.style.animation = 'fadeIn 0.3s ease-in-out';
    } else {
        shortcuts.style.opacity = '0.6';
        sizePrefs.style.opacity = '0.6';
    }
}

// Setup event listeners for popup interactions
function setupEventListeners() {
    // Add click handlers for keyboard shortcuts (for demonstration)
    const shortcutItems = document.querySelectorAll('.shortcut-item');
    
    shortcutItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.querySelector('.action').textContent;
            showTemporaryFeedback(this, `Click ${action.toLowerCase()}`);
        });
    });
    
    // Add click handlers for size preferences
    const preferenceItems = document.querySelectorAll('.preference-item');
    
    preferenceItems.forEach(item => {
        item.addEventListener('click', function() {
            showTemporaryFeedback(this, 'Future: Customize sizes');
        });
    });
    
    // Handle external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            chrome.tabs.create({ url: this.href });
            window.close(); // Close popup after opening link
        });
    });
}

// Show temporary feedback when clicking items
function showTemporaryFeedback(element, message) {
    const originalContent = element.innerHTML;
    const feedback = document.createElement('div');
    
    feedback.textContent = message;
    feedback.style.cssText = `
        color: #0066cc;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        width: 100%;
    `;
    
    element.innerHTML = '';
    element.appendChild(feedback);
    element.style.background = '#e6f3ff';
    
    setTimeout(() => {
        element.innerHTML = originalContent;
        element.style.background = '';
        
        // Re-setup event listeners for the restored content
        setupEventListeners();
    }, 1000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0.6; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .shortcut-item:hover,
    .preference-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .shortcut-item:active,
    .preference-item:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

document.head.appendChild(style);

// Add some helpful information based on the current context
async function addContextualInfo() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab.url && tab.url.includes('ssense.com/') && tab.url.includes('/product/')) {
            // We're on a product page, could show product-specific info
            console.log('On SSENSE product page:', tab.url);
            
            // Future enhancement: Could inject a script to get product info
            // and show it in the popup
        }
    } catch (error) {
        console.error('Error getting contextual info:', error);
    }
}

// Call contextual info function
addContextualInfo();