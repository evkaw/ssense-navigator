// ==UserScript==
// @name         SSENSE Navigator v4.0 - Fixed Matching + Enhanced Sizes
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Navigate SSENSE with exact size matching and comprehensive options
// @author       Navigator
// @match        https://www.ssense.com/*/product/*
// @match        https://ssense.com/*/product/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🔥 SSENSE Navigator v4.0 - Fixed & Enhanced!');
    
    let currentPage = 0;
    let totalPages = 0;
    
    // ========== ENHANCED SIZE MAPPING SYSTEM ==========
    const SIZE_MAPPINGS = {
        // CLOTHING SIZES (Unified with Italian equivalents)
        'XS': ['XS', 'Extra Small', 'IT 44', '44', 'XXS'],
        'S': ['S', 'Small', 'SM', 'IT 46', '46'],
        'M': ['M', 'Medium', 'MD', 'Med', 'IT 48', '48'],
        'L': ['L', 'Large', 'LG', 'IT 50', '50'],
        'XL': ['XL', 'Extra Large', 'IT 52', '52'],
        'XXL': ['XXL', '2XL', 'IT 54', '54'],
        'XXXL': ['XXXL', '3XL', 'IT 56', '56'],
        
        // SHOES SIZES (US + EU + IT comprehensive range)
        '6': ['6', 'US 6', 'EU 39', 'IT 39', '39'],
        '6.5': ['6.5', 'US 6.5', 'EU 39.5', 'IT 39.5', '6½'],
        '7': ['7', 'US 7', 'EU 40', 'IT 40', '40'],
        '7.5': ['7.5', 'US 7.5', 'EU 40.5', 'IT 40.5', '7½'],
        '8': ['8', 'US 8', 'EU 41', 'IT 41', '41'],
        '8.5': ['8.5', 'US 8.5', 'EU 41.5', 'IT 41.5', '8½'],
        '9': ['9', 'US 9', 'EU 42', 'IT 42', '42'],
        '9.5': ['9.5', 'US 9.5', 'EU 42.5', 'IT 42.5', '9½'],
        '10': ['10', 'US 10', 'EU 43', 'IT 43', '43'],
        '10.5': ['10.5', 'US 10.5', 'EU 43.5', 'IT 43.5', '10½'],
        '11': ['11', 'US 11', 'EU 44', 'IT 44', '44'],
        '11.5': ['11.5', 'US 11.5', 'EU 44.5', 'IT 44.5', '11½'],
        '12': ['12', 'US 12', 'EU 45', 'IT 45', '45'],
        '13': ['13', 'US 13', 'EU 46', 'IT 46', '46'],
        '14': ['14', 'US 14', 'EU 47', 'IT 47', '47'],
        '15': ['15', 'US 15', 'EU 48', 'IT 48', '48'],
        
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
    
    // ========== ENHANCED CATEGORY DETECTION ==========
    function detectProductCategory() {
        const text = document.body.textContent.toLowerCase();
        const url = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();

        // Force shoes category for any sneaker or shoe keyword in title or URL
        if (title.includes('sneaker') || title.includes('shoe') || url.includes('sneaker') || url.includes('shoe')) {
            return 'shoes';
        }

        // Comprehensive SSENSE categories
        const BAG_KEYWORDS = [
            'backpack', 'briefcase', 'duffle', 'duffel', 'top handle', 
            'messenger', 'satchel', 'pouch', 'document holder', 'tote', 
            'travel bag', 'crossbody', 'shoulder bag', 'clutch', 'wallet bag',
            'camera bag', 'belt bag', 'fanny pack', 'bum bag', 'carryall',
            'bag', 'purse', 'handbag', 'case', 'carrier'
        ];
        
        const ACCESSORY_KEYWORDS = [
            'belt', 'suspender', 'eyewear', 'sunglasses', 'glasses', 'face mask',
            'glove', 'hat', 'cap', 'beanie', 'jewelry', 'necklace', 'bracelet',
            'ring', 'earring', 'keychain', 'pocket square', 'tie bar', 'cufflink',
            'scarf', 'sock', 'tech', 'phone case', 'charger', 'tie', 'necktie',
            'towel', 'umbrella', 'wallet', 'card holder', 'watch', 'timepiece',
            'accessory', 'charm', 'pin', 'badge', 'chain', 'strap'
        ];
        
        const CLOTHING_KEYWORDS = [
            'jacket', 'coat', 'blazer', 'hoodie', 'sweater', 'shirt', 'dress',
            'top', 'blouse', 'cardigan', 'vest', 'tank', 'tee', 't-shirt'
        ];
        
        const SHOE_KEYWORDS = [
            'shoe', 'sneaker', 'boot', 'loafer', 'oxford', 'sandal', 'heel',
            'pump', 'flat', 'slipper', 'moccasin', 'derby', 'brogue', 'monk'
        ];
        
        const PANTS_KEYWORDS = [
            'pant', 'jean', 'trouser', 'short', 'cargo', 'legging', 'chino',
            'sweatpant', 'jogger', 'trackpant'
        ];
        
        // Combine all text sources
        const allText = `${text} ${url} ${title}`;
        
        // Count matches with weighted scoring
        let bagScore = 0, accessoryScore = 0, clothingScore = 0, shoeScore = 0, pantsScore = 0;
        
        BAG_KEYWORDS.forEach(keyword => {
            if (title.includes(keyword) || url.includes(keyword)) bagScore += 3;
            else if (text.includes(keyword)) bagScore += 1;
        });
        
        ACCESSORY_KEYWORDS.forEach(keyword => {
            if (title.includes(keyword) || url.includes(keyword)) accessoryScore += 3;
            else if (text.includes(keyword)) accessoryScore += 1;
        });
        
        CLOTHING_KEYWORDS.forEach(keyword => {
            if (title.includes(keyword) || url.includes(keyword)) clothingScore += 2;
            else if (text.includes(keyword)) clothingScore += 1;
        });
        
        SHOE_KEYWORDS.forEach(keyword => {
            if (title.includes(keyword) || url.includes(keyword)) shoeScore += 2;
            else if (text.includes(keyword)) shoeScore += 1;
        });
        
        PANTS_KEYWORDS.forEach(keyword => {
            if (title.includes(keyword) || url.includes(keyword)) pantsScore += 2;
            else if (text.includes(keyword)) pantsScore += 1;
        });
        
        // Log scores for debugging
        console.log(`🔍 Category scores - Bags: ${bagScore}, Accessories: ${accessoryScore}, Shoes: ${shoeScore}, Pants: ${pantsScore}, Clothing: ${clothingScore}`);
        
        // Return highest scoring category
        const scores = [
            { category: 'bags', score: bagScore },
            { category: 'accessories', score: accessoryScore },
            { category: 'shoes', score: shoeScore },
            { category: 'pants', score: pantsScore },
            { category: 'clothing', score: clothingScore }
        ];
        
        const winner = scores.reduce((max, current) => current.score > max.score ? current : max);
        
        // Default to clothing if no clear winner
        return winner.score > 0 ? winner.category : 'clothing';
    }
    
    // ========== FIXED SIZE MATCHING ALGORITHM ==========
    function findExactSizeMatch(availableOptions, targetSize, variations) {
        console.log(`🔍 Searching for: "${targetSize}"`);
        console.log(`🔄 Checking variations: ${JSON.stringify(variations)}`);
        
        for (const option of availableOptions) {
            const optionText = option.textContent.trim();
            console.log(`🧪 Testing option: "${optionText}"`);
            
            // EXACT MATCHING - Extract just the size part before any additional text
            const sizePart = optionText.split(' - ')[0].split(' ')[0].trim();
            
            // Check each variation for EXACT match
            for (const variation of variations) {
                // Method 1: Exact size match
                if (sizePart === variation) {
                    console.log(`✅ EXACT MATCH: "${optionText}" matches variation "${variation}"`);
                    return option;
                }
                
                // Method 2: Size at start of text
                if (optionText.startsWith(variation + ' ') || optionText.startsWith(variation + '-')) {
                    console.log(`✅ START MATCH: "${optionText}" starts with variation "${variation}"`);
                    return option;
                }
                
                // Method 3: For Italian sizes, check "IT XX" pattern
                if (variation.startsWith('IT ') && optionText.includes(variation)) {
                    console.log(`✅ ITALIAN MATCH: "${optionText}" contains Italian size "${variation}"`);
                    return option;
                }
            }
        }
        
        console.log(`❌ No match found for "${targetSize}"`);
        return null;
    }
    
    // ========== ENHANCED SIZE SELECTION ==========
    async function selectPreferredSize() {
    const category = detectProductCategory();
    const sizeDropdown = document.querySelector('#pdpSizeDropdown');
    
    if (!sizeDropdown) {
        return { success: false, error: 'No size selector found' };
    }

    // Get available options (non-disabled only)
    const availableOptions = Array.from(sizeDropdown.options)
        .filter(option => !option.disabled && option.value);

    // Load user preferences
    const storageData = await new Promise(resolve => {
        chrome.storage.sync.get(['sizePreferences'], resolve);
    });
    const preferences = storageData.sizePreferences || {};
    const userSizes = preferences[category] || getDefaultSizes(category);

    // Try each preferred size in order
    for (const preferredSize of userSizes) {
        const variations = SIZE_MAPPINGS[preferredSize] || [preferredSize];
        
        for (const variation of variations) {
            const match = availableOptions.find(option => 
                option.text.split(' - ')[0].trim() === variation
            );
            
            if (match) {
                // Vue.js compatible selection
                sizeDropdown.value = match.value;
                sizeDropdown.dispatchEvent(new Event('input', { bubbles: true }));
                sizeDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                return { 
                    success: true,
                    size: variation,
                    autoSelected: true
                };
            }
        }
    }

    // Fallback to first available size
    if (availableOptions.length > 0) {
        const fallbackSize = availableOptions[0].text.split(' - ')[0].trim();
        sizeDropdown.value = availableOptions[0].value;
        sizeDropdown.dispatchEvent(new Event('input', { bubbles: true }));
        sizeDropdown.dispatchEvent(new Event('change', { bubbles: true }));
        return {
            success: true,
            size: fallbackSize,
            fallback: true
        };
    }

    return { success: false, error: 'No sizes available' };
}
    
    // Default size preferences
    function getDefaultSizes(category) {
        switch(category) {
            case 'shoes': return ['10', '10.5', '11', '9.5'];
            case 'clothing': return ['M', 'L'];
            case 'pants': return ['32', '31', '33'];
            default: return ['M'];
        }
    }
    
    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message) {
        const existing = document.querySelector('[data-ssense-notification]');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.setAttribute('data-ssense-notification', 'true');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000000;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: normal;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2500);
    }
    
    // ========== CAROUSEL NAVIGATION ==========
    function getCarouselInfo() {
        const pagination = document.querySelector('.carousel-pagination');
        if (!pagination) return false;
        
        totalPages = parseInt(pagination.getAttribute('page-count')) || 0;
        currentPage = parseInt(pagination.getAttribute('current-page')) || 0;
        
        return totalPages > 1;
    }
    
    function navigateCarousel(direction) {
        if (!getCarouselInfo()) return;
        
        let newPage = currentPage + direction;
        
        if (newPage >= totalPages) newPage = 0;
        else if (newPage < 0) newPage = totalPages - 1;
        
        const targetDot = document.querySelector(`.carousel-dot[aria-label="Item ${newPage}"]`);
        if (targetDot) {
            targetDot.click();
            showNotification(`${newPage + 1}/${totalPages}`);
        }
    }
    
    // ========== WISHLIST MANAGEMENT ==========
    function getWishlistState() {
        const wishlistBtn = document.querySelector('#pdpAddToWishListButton');
        if (!wishlistBtn) return null;
        
        const buttonText = wishlistBtn.textContent.toLowerCase();
        const isInWishlist = buttonText.includes('remove') || 
                           buttonText.includes('in wishlist') ||
                           wishlistBtn.classList.contains('active');
        
        return { button: wishlistBtn, isInWishlist };
    }

    function triggerVueClick(element) {
    // Realistic click simulation for Vue.js
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;

    // Full mouse event sequence
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
        const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY
        });
        element.dispatchEvent(event);
    });

    // Force Vue.js update if detected
    const vueInstance = element.__vue__ || element.__vue_app__;
    if (vueInstance?.$forceUpdate) {
        vueInstance.$forceUpdate();
    }
}
    
    async function toggleWishlist() {
    const category = detectProductCategory();
    const wishlistState = getWishlistState();
    
    if (!wishlistState) {
        showNotification('❌ Wishlist button not found');
        return;
    }

    const { button, isInWishlist } = wishlistState;

    if (isInWishlist) {
        triggerVueClick(button);
        showNotification('🗑️ Removed from wishlist');
    } else {
        // If no size selector, just add to wishlist
        if (!document.querySelector('#pdpSizeDropdown')) {
            triggerVueClick(button);
            setTimeout(() => {
                const newState = getWishlistState();
                if (newState?.isInWishlist) {
                    showNotification('💖 Added to wishlist');
                } else {
                    showNotification('❌ Failed to add to wishlist');
                }
            }, 500);
            return;
        }
        try {
            const sizeResult = await selectPreferredSize();
            if (!sizeResult.success) {
                showNotification(`❌ ${sizeResult.error}`);
                return;
            }
            if (sizeResult.fallback) {
                showNotification(`⚠️ No preferred sizes - selected ${sizeResult.size}`);
            } else if (sizeResult.autoSelected) {
                showNotification(`⚡ Auto-selected ${sizeResult.size}`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            triggerVueClick(button);
            await new Promise(resolve => setTimeout(resolve, 300));
            const newState = getWishlistState();
            if (newState?.isInWishlist) {
                const message = sizeResult.autoSelected 
                    ? `💖 ${sizeResult.size} - Added to wishlist`
                    : '💖 Added to wishlist';
                showNotification(message);
            } else {
                showNotification('❌ Failed to add - check console');
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            showNotification('❌ Size selection failed');
        }
    }
}
    
    // ========== KEYBOARD CONTROLS ==========
    function handleKeyDown(event) {
        if (event.target.tagName === 'INPUT' || 
            event.target.tagName === 'TEXTAREA' || 
            event.target.isContentEditable) {
            return;
        }
        
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                navigateCarousel(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                navigateCarousel(1);
                break;
            case 'w':
            case 'W':
                event.preventDefault();
                toggleWishlist();
                break;
            case '?':
                event.preventDefault();
                showNotification('← → Navigate • W Wishlist • ? Help');
                break;
        }
    }
    
    // ========== INITIALIZATION ==========
    function initialize() {
        console.log('✅ SSENSE Navigator v4.0 initialized with enhanced size matching!');
        document.addEventListener('keydown', handleKeyDown);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }
    
})();
