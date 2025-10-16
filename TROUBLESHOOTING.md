# 🔧 Troubleshooting Guide - Loading Issues

## Issue: Stuck at Loading Screen

### ✅ FIXED: Import Path Issue

**Problem:** The post-processing imports were using wrong paths

- ❌ Old: `three/examples/jsm/postprocessing/...`
- ✅ New: `three/addons/postprocessing/...`

**Solution:** Updated `postProcessing.js` to use correct import paths that match the importmap in `index.html`.

---

## Quick Fixes

### 1. Hard Refresh

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 2. Clear Browser Cache

```
1. Press F12 (Open DevTools)
2. Go to Network tab
3. Check "Disable cache"
4. Refresh page
```

### 3. Check Browser Console

```
1. Press F12
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - "Failed to fetch"  → File path issue
   - "Unexpected token" → Syntax error
   - "Cannot find module" → Import path issue
```

---

## Diagnostic Steps

### Step 1: Open Browser Console (F12)

Look for these messages:

✅ **Good signs:**

```
Initializing Virtual Art Gallery...
✓ THREE.js loaded
✓ environment.js loaded
✓ lighting.js loaded
...
```

❌ **Error signs:**

```
Failed to load module
SyntaxError
TypeError
404 Not Found
```

### Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for files with:
   - ❌ Red status (404 = not found)
   - ⚠️ Yellow status (warnings)

All JavaScript files should show:

- ✅ Status: 200 or 304 (OK)
- ✅ Type: `javascript`

### Step 3: Verify File Structure

All these files should be in the same folder:

```
Extra Lab/
├── index.html
├── main.js
├── postProcessing.js      ← UPDATED
├── environmentalEffects.js
├── interactiveExhibits.js
├── advancedAnimations.js
├── enhancedAI.js
├── wildlife.js
├── uiEnhancements.js
├── environment.js
├── lighting.js
├── artworks.js
├── actors.js
├── controls.js
├── interactions.js
├── utils.js
└── styles.css
```

---

## Common Error Messages & Fixes

### Error: "Failed to fetch module"

**Cause:** File doesn't exist or wrong path
**Fix:**

1. Check file name spelling
2. Ensure all files are in same directory
3. Check import paths in files

### Error: "Unexpected token '<'"

**Cause:** HTML being loaded as JavaScript (404 error)
**Fix:**

1. Check file actually exists
2. Verify file extension is `.js`
3. Check web server is serving files correctly

### Error: "Cannot find export 'XXX'"

**Cause:** Missing export in module
**Fix:**

1. Check the function/class is actually exported
2. Verify export name matches import

### Error: "THREE is not defined"

**Cause:** Three.js not loaded
**Fix:**

1. Check internet connection (Three.js loads from CDN)
2. Verify importmap in index.html
3. Try different CDN version

---

## Testing Procedure

### Test 1: Basic Gallery (No Advanced Features)

Temporarily comment out advanced features in `main.js`:

```javascript
// Comment out these lines:
// this.setupAdvancedFeatures();
```

If this works, issue is in advanced features.

### Test 2: Use Debug Page

1. Open `index-debug.html` instead of `index.html`
2. Check console for specific errors
3. Errors will appear on screen too

### Test 3: Check Individual Modules

Open console and run:

```javascript
import("./postProcessing.js")
  .then(() => console.log("✓ OK"))
  .catch((e) => console.error("✗ FAIL:", e));
```

---

## Browser Compatibility

### ✅ Recommended Browsers:

- Chrome 90+
- Firefox 88+
- Edge 90+

### ⚠️ May Have Issues:

- Safari (limited WebGL support)
- Opera (try Chromium version)
- Internet Explorer (NOT SUPPORTED)

### Browser-Specific Fixes:

**Chrome/Edge:**

- Usually works best
- Enable hardware acceleration in settings

**Firefox:**

- May need to enable WebGL in about:config
- Check: `webgl.force-enabled = true`

**Safari:**

- Limited support for some features
- Try Chrome/Firefox instead

---

## Performance Issues

### If Gallery Loads but Runs Slowly:

1. **Toggle Post-Processing:** Press `P` key
2. **Disable Weather:** Press `R` and `S` keys
3. **Check FPS:** Look at FPS counter (top-right)
   - ✅ Good: 50-60 FPS
   - ⚠️ OK: 30-50 FPS
   - ❌ Poor: <30 FPS

### Low FPS Fixes:

```
1. Press P - Disable post-processing
2. Press R - Turn off rain
3. Press S - Turn off snow
4. Close other browser tabs
5. Update graphics drivers
```

---

## Quick Test Commands

Open browser console (F12) and paste:

### Test 1: Check Three.js

```javascript
import("three").then((THREE) =>
  console.log("✓ Three.js version:", THREE.REVISION)
);
```

### Test 2: Check All Modules

```javascript
Promise.all([
  import("./postProcessing.js"),
  import("./environmentalEffects.js"),
  import("./interactiveExhibits.js"),
  import("./advancedAnimations.js"),
  import("./enhancedAI.js"),
  import("./wildlife.js"),
  import("./uiEnhancements.js"),
])
  .then(() => console.log("✓ All modules loaded!"))
  .catch((e) => console.error("✗ Error:", e));
```

---

## Still Not Working?

### Last Resort Fixes:

1. **Try a different browser**
2. **Disable browser extensions** (especially ad-blockers)
3. **Clear ALL browser data**
4. **Restart computer**
5. **Check antivirus/firewall** isn't blocking

### Report Issue:

If still broken, provide these details:

1. Browser name and version
2. Operating system
3. Full console error message
4. Network tab screenshot
5. Which files show 404 errors

---

## Success Indicators

✅ **Gallery Successfully Loaded:**

- Loading bar reaches 100%
- Loading screen fades away
- You see the 3D gallery
- FPS counter shows in top-right
- No red errors in console

✅ **All Features Working:**

- Press M - Minimap appears
- Press I - Inventory opens
- Press A - Achievements show
- Press T - Tour guide starts
- Can move with WASD
- Can look around with mouse

---

## Emergency Fallback

If nothing works, use the original gallery without advanced features:

1. Rename `main.js` to `main-advanced.js`
2. Create simple `main.js` with just basic gallery
3. Remove advanced imports from `index.html`

This will give you a working basic gallery while you debug the advanced features.

---

**After the fix (changing import paths), try:**

1. Hard refresh: **Ctrl + Shift + R**
2. Check console for new errors
3. Should now load successfully!

**Report any remaining errors in browser console!** 🔍
