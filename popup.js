// SSENSE Navigator v4.0 - Enhanced Popup Manager
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 SSENSE Navigator Popup v4.0 loaded!');
    
    // Enhanced Size Mappings (matches content.js)
    const SIZE_MAPPINGS = {
        // CLOTHING SIZES (Unified with Italian equivalents)
        'XS': ['XS', 'Extra Small', 'IT 44', '44', 'XXS'],
        'S': ['S', 'Small', 'SM', 'IT 46', '46'],
        'M': ['M', 'Medium', 'MD', 'Med', 'IT 48', '48'],
        'L': ['L', 'Large', 'LG', 'IT 50', '50'],
        'XL': ['XL', 'Extra Large', 'IT 52', '52'],
        'XXL': ['XXL', '2XL', 'IT 54', '54'],
        'XXXL': ['XXXL', '3XL', 'IT 56', '56'],
        
        // SHOES SIZES (US + EU comprehensive range)
        '6': ['6', 'US 6', 'EU 39', '39'],
        '6.5': ['6.5', 'US 6.5', '6½'],
        '7': ['7', 'US 7', 'EU 40', '40'],
        '7.5': ['7.5', 'US 7.5', '7½'],
        '8': ['8', 'US 8', 'EU 41', '41'],
        '8.5': ['8.5', 'US 8.5', '8½'],
        '9': ['9', 'US 9', 'EU 42', '42'],
        '9.5': ['9.5', 'US 9.5', '9½'],
        '10': ['10', 'US 10', 'EU 43', '43'],
        '10.5': ['10.5', 'US 10.5', '10½'],
        '11': ['11', 'US 11', 'EU 44', '44'],
        '11.5': ['11.5', 'US 11.5', '11½'],
        '12': ['12', 'US 12', 'EU 45', '45'],
        '13': ['13', 'US 13', 'EU 46', '46'],
        '14': ['14', 'US 14', 'EU 47', '47'],
        '15': ['15', 'US 15', 'EU 48', '48'],
        
        // PANTS SIZES (Comprehensive waist range)
        '28': ['28', 'W28', '28"', 'W28"'],
        '29': ['29', 'W29', '29"', 'W29"'],
        '30': ['30', 'W30', '30"', 'W30"', '30/32'],
        '31': ['31', 'W31', '31"', 'W31"', '31/32'],
        '32': ['32', 'W32', '32"', 'W32"', '32/34'],
        '33': ['33', 'W33', '33"', 'W33"', '33/34'],
        '34': ['34', 'W34', '34"', 'W34"'],
        '35': ['35', 'W35', '35"', 'W35"'],
        '36': ['36', 'W36', '36"', 'W36"'],
        '38': ['38', 'W38', '38"', 'W38"'],
        '40': ['40', 'W40', '40"', 'W40"']
    };
    
    // Default Preferences
    const DEFAULT_PREFERENCES = {
        clothing: ['M', 'L'],
        shoes: ['10', '10.5', '11'],
        pants: ['32', '31', '33']
    };
    
    // DOM Elements
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    const statusMsg = document.getElementById('status-msg');
    
    // Auto-save timeout
    let autoSaveTimeout;
    
    // Status Message Display
    function showStatus(message, type = 'success') {
        statusMsg.textContent = message;
        statusMsg.className = `status ${type}`;
        statusMsg.style.display = 'block';
        
        setTimeout(() => {
            statusMsg.style.display = 'none';
        }, 3000);
    }
    
    // Load Saved Preferences
    function loadPreferences() {
        chrome.storage.sync.get(['sizePreferences'], (result) => {
            const preferences = result.sizePreferences || DEFAULT_PREFERENCES;
            
            console.log('📋 Loading preferences:', preferences);
            
            // Load clothing preferences
            const clothingPrefs = preferences.clothing || DEFAULT_PREFERENCES.clothing;
            clothingPrefs.forEach(size => {
                const checkbox = document.getElementById(`clothing-${size.toLowerCase()}`);
                if (checkbox) checkbox.checked = true;
            });
            
            // Load shoes preferences
            const shoesPrefs = preferences.shoes || DEFAULT_PREFERENCES.shoes;
            shoesPrefs.forEach(size => {
                const checkbox = document.getElementById(`shoes-${size.replace('.', '-')}`);
                if (checkbox) checkbox.checked = true;
            });
            
            // Load pants preferences
            const pantsPrefs = preferences.pants || DEFAULT_PREFERENCES.pants;
            pantsPrefs.forEach(size => {
                const checkbox = document.getElementById(`pants-${size}`);
                if (checkbox) checkbox.checked = true;
            });
        });
    }
    
    // Save Preferences
    function savePreferences(showMessage = true) {
        const preferences = {
            clothing: [],
            shoes: [],
            pants: []
        };
        
        // Collect clothing preferences
        document.querySelectorAll('input[id^="clothing-"]:checked').forEach(checkbox => {
            preferences.clothing.push(checkbox.value);
        });
        
        // Collect shoes preferences
        document.querySelectorAll('input[id^="shoes-"]:checked').forEach(checkbox => {
            preferences.shoes.push(checkbox.value);
        });
        
        // Collect pants preferences
        document.querySelectorAll('input[id^="pants-"]:checked').forEach(checkbox => {
            preferences.pants.push(checkbox.value);
        });
        
        // Validate - at least one size per category
        if (preferences.clothing.length === 0) preferences.clothing = ['M'];
        if (preferences.shoes.length === 0) preferences.shoes = ['10'];
        if (preferences.pants.length === 0) preferences.pants = ['32'];
        
        console.log('💾 Saving preferences:', preferences);
        
        chrome.storage.sync.set({ sizePreferences: preferences }, () => {
            if (chrome.runtime.lastError) {
                console.error('❌ Error saving preferences:', chrome.runtime.lastError);
                if (showMessage) showStatus('Error saving preferences!', 'error');
            } else {
                console.log('✅ Preferences saved successfully');
                if (showMessage) showStatus('✅ Preferences saved!', 'success');
                
                // Notify content script of changes
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0] && tabs[0].url && tabs[0].url.includes('ssense.com')) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: 'PREFERENCES_UPDATED',
                            preferences: preferences
                        }).catch(() => {
                            // Content script not available, ignore
                        });
                    }
                });
            }
        });
    }
    
    // Reset to Defaults
    function resetPreferences() {
        // Clear all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Apply default preferences
        DEFAULT_PREFERENCES.clothing.forEach(size => {
            const checkbox = document.getElementById(`clothing-${size.toLowerCase()}`);
            if (checkbox) checkbox.checked = true;
        });
        
        DEFAULT_PREFERENCES.shoes.forEach(size => {
            const checkbox = document.getElementById(`shoes-${size.replace('.', '-')}`);
            if (checkbox) checkbox.checked = true;
        });
        
        DEFAULT_PREFERENCES.pants.forEach(size => {
            const checkbox = document.getElementById(`pants-${size}`);
            if (checkbox) checkbox.checked = true;
        });
        
        savePreferences();
        showStatus('🔄 Reset to defaults!', 'success');
    }
    
    // Auto-save on Change
    function setupAutoSave() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Clear previous timeout
                if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
                
                // Set new timeout for auto-save (1 second delay)
                autoSaveTimeout = setTimeout(() => {
                    savePreferences(false); // Don't show message for auto-save
                }, 1000);
            });
        });
    }
    
    // Event Listeners
    saveBtn.addEventListener('click', () => {
        savePreferences(true);
    });
    
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all size preferences to defaults?')) {
            resetPreferences();
        }
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    savePreferences(true);
                    break;
                case 'r':
                    event.preventDefault();
                    if (confirm('Reset all size preferences to defaults?')) {
                        resetPreferences();
                    }
                    break;
            }
        }
    });
    
    // Initialize
    function initialize() {
        console.log('🚀 Initializing SSENSE Navigator popup...');
        loadPreferences();
        setupAutoSave();
        
        // Show initialization message
        setTimeout(() => {
            showStatus('🔥 SSENSE Navigator ready!', 'success');
        }, 500);
    }
    
    // Start initialization
    initialize();
    
    // Storage change listener
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.sizePreferences) {
            console.log('📡 Storage changed, reloading preferences...');
            loadPreferences();
        }
    });
    
    // Debug info
    console.log('📊 SIZE_MAPPINGS loaded:', Object.keys(SIZE_MAPPINGS).length, 'mappings');
    console.log('🎯 DEFAULT_PREFERENCES:', DEFAULT_PREFERENCES);
});