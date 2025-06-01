# SSENSE Navigator Chrome Extension

🛍️ **Navigate SSENSE like a pro with keyboard shortcuts, smart size selection, and instant wishlist management**

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID?style=flat-square)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![Users](https://img.shields.io/chrome-web-store/users/YOUR_EXTENSION_ID?style=flat-square)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/ssense-navigator?style=flat-square)](https://github.com/yourusername/ssense-navigator)

## ✨ Features

### 🎯 **Smart Navigation**
- **Arrow Key Navigation**: Use `←` and `→` to browse through product images instantly
- **Carousel Integration**: Works seamlessly with SSENSE's modern image gallery system
- **Visual Progress**: See your current position with clean "2/5" style indicators

### 🧠 **Intelligent Size Selection**
- **Automatic Detection**: Recognizes shoes, clothing, and pants automatically
- **Personalized Preferences**: 
  - **Shoes**: EU 42, 10.5, 11 (with smart fallbacks)
  - **Clothing**: M, Medium sizes
  - **Pants**: 31, 32, 31/32 waist sizes
- **Fallback Logic**: Automatically selects closest available size if preferred isn't available

### 💖 **One-Click Wishlist Management**
- **Toggle Wishlist**: Press `W` to add/remove items from wishlist
- **Smart Auto-Selection**: Automatically picks your size before adding to wishlist
- **Clear Feedback**: Unified black notifications show exactly what happened

### 🎨 **Clean UI Integration**
- **Non-Intrusive**: Maintains SSENSE's minimalist design philosophy
- **Consistent Styling**: Black notifications that match the site's aesthetic
- **No Visual Clutter**: Works silently in the background

## 🎮 Keyboard Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `←` | Previous Image | Navigate to the previous product image |
| `→` | Next Image | Navigate to the next product image |
| `W` | Toggle Wishlist | Add to wishlist (with auto size selection) or remove |
| `?` | Show Help | Display available keyboard shortcuts |

## 📸 Screenshots

### Navigation in Action
*Screenshots showing the extension working on SSENSE product pages*

### Size Selection Demo
*Screenshots showing the auto-selection notification*

### Wishlist Management
*Screenshots showing the wishlist toggle functionality*

## 🚀 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
2. Click "Add to Chrome"
3. Confirm installation
4. Navigate to any SSENSE product page and start using arrow keys!

### From Source (For Developers)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ssense-navigator.git
   cd ssense-navigator
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the cloned repository folder

3. Visit any SSENSE product page to test the extension

## 🛠️ Development

### Project Structure
```
ssense-navigator/
├── manifest.json          # Extension manifest (Manifest V3)
├── content.js            # Main content script
├── popup/
│   ├── popup.html        # Extension popup interface
│   ├── popup.js          # Popup functionality
│   └── popup.css         # Popup styling
├── icons/
│   ├── icon-16.png       # Extension icons (16x16)
│   ├── icon-32.png       # Extension icons (32x32)
│   ├── icon-48.png       # Extension icons (48x48)
│   └── icon-128.png      # Extension icons (128x128)
├── docs/                 # Documentation
└── .github/              # GitHub Actions workflows
```

### Building and Testing

1. **Local Testing**:
   ```bash
   # Clone and load in Chrome as described above
   # Test on various SSENSE product pages
   ```

2. **Code Quality**:
   ```bash
   # Run linting (if you add ESLint)
   npm run lint
   
   # Format code (if you add Prettier)
   npm run format
   ```

3. **Package for Distribution**:
   ```bash
   # Create a production-ready zip file
   zip -r ssense-navigator.zip . -x "*.git*" "node_modules/*" "*.md" "docs/*"
   ```

### Contributing

We welcome contributions! Here's how to get started:

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**:
   - Follow the existing code style
   - Test thoroughly on SSENSE
   - Add documentation for new features
4. **Commit Your Changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to Your Fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Use consistent JavaScript formatting
- **Testing**: Test on multiple SSENSE product types (shoes, clothing, accessories)
- **Performance**: Keep the extension lightweight and fast
- **Compatibility**: Ensure compatibility with SSENSE's frequent UI updates

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension standard for better security and performance
- **Content Script**: Runs only on SSENSE product pages for optimal performance
- **Vue.js Integration**: Works seamlessly with SSENSE's Vue.js framework
- **DOM Events**: Properly dispatches events to integrate with SSENSE's reactivity system

### Browser Compatibility
- ✅ **Chrome**: Fully supported (primary target)
- ✅ **Edge**: Supported (Chromium-based)
- ✅ **Brave**: Supported
- ✅ **Opera**: Supported
- ❓ **Firefox**: Not tested (would require WebExtensions port)

### Privacy & Security
- **No Data Collection**: Extension doesn't collect or transmit any user data
- **Minimal Permissions**: Only requests access to SSENSE domains
- **Local Processing**: All logic runs locally in your browser
- **Open Source**: Complete transparency with public source code

## 📋 Publishing to Chrome Web Store

Follow these steps to publish your own version:

### Prerequisites
1. **Google Account**: You'll need a Google account
2. **Developer Fee**: One-time $5 registration fee for Chrome Web Store
3. **Extension Ready**: Complete, tested extension package

### Step-by-Step Publishing

1. **Prepare Your Extension**:
   ```bash
   # Create a clean build
   zip -r ssense-navigator.zip . -x "*.git*" "node_modules/*" "*.md" "docs/*" "*.DS_Store"
   ```

2. **Register as Developer**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Sign in with your Google account
   - Pay the $5 one-time registration fee
   - Complete your developer profile

3. **Upload Extension**:
   - Click "Add new item" in the dashboard
   - Upload your ZIP file
   - Fill out the required information:
     - **Name**: SSENSE Navigator
     - **Description**: Navigate SSENSE product images with arrow keys, smart size selection, and wishlist management
     - **Category**: Shopping
     - **Language**: English

4. **Add Store Assets**:
   - **Store Icon**: 128x128 pixel icon
   - **Screenshots**: At least one screenshot (1280x800 or 640x400)
   - **Promotional Images**: Optional but recommended

5. **Privacy Information**:
   - **Single Purpose**: Enhance SSENSE browsing experience with keyboard navigation
   - **Permissions**: Explain why you need access to SSENSE domains
   - **Data Usage**: State that no user data is collected

6. **Submit for Review**:
   - Click "Submit for Review"
   - Wait for Google's review (usually 1-3 business days)
   - Address any feedback if rejected

### Post-Publication
- **Monitor Reviews**: Respond to user feedback
- **Update Regularly**: Keep the extension compatible with SSENSE changes
- **Analytics**: Use Chrome Web Store analytics to track usage

## 🎯 Roadmap

### v1.1 - Enhanced Features
- [ ] Configurable size preferences in popup
- [ ] Support for multiple currencies
- [ ] Quick view mode for product details

### v1.2 - Advanced Navigation  
- [ ] Search within images
- [ ] Zoom functionality with keyboard
- [ ] Product comparison shortcuts

### v1.3 - User Experience
- [ ] Dark/light mode toggle
- [ ] Custom notification styling
- [ ] Accessibility improvements

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? We'd love to hear from you!

- **Bug Reports**: [Open an issue](https://github.com/yourusername/ssense-navigator/issues/new?template=bug_report.md)
- **Feature Requests**: [Request a feature](https://github.com/yourusername/ssense-navigator/issues/new?template=feature_request.md)
- **General Discussion**: [Start a discussion](https://github.com/yourusername/ssense-navigator/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SSENSE**: For creating an amazing fashion platform
- **Chrome Extensions Community**: For excellent documentation and examples
- **Contributors**: Everyone who helps improve this extension

## 📞 Support

Need help? Here are your options:

- **Documentation**: Check this README and the [docs](docs/) folder
- **Issues**: Search existing [issues](https://github.com/yourusername/ssense-navigator/issues) or create a new one
- **Discussions**: Join the [community discussions](https://github.com/yourusername/ssense-navigator/discussions)

---

**Made with ❤️ for the SSENSE community**

*If you find this extension helpful, please ⭐ star the repository and leave a review on the Chrome Web Store!*