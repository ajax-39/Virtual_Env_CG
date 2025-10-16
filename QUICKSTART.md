# 🚀 Quick Start Guide - Virtual Art Gallery

## Step-by-Step Setup

### Method 1: Python Server (Recommended)

1. **Open PowerShell or Command Prompt**

   - Press `Win + X` and select "Windows PowerShell"

2. **Navigate to the project folder**

   ```powershell
   cd "Z:\Sem-5\CG\LAB\Extra Lab"
   ```

3. **Start Python server**

   ```powershell
   python -m http.server 8000
   ```

4. **Open your browser**

   - Go to: `http://localhost:8000`

5. **Start exploring!**
   - Wait for the loading screen to complete
   - Use mouse to look around
   - Press `C` to switch to first-person mode

### Method 2: VS Code Live Server

1. **Install Live Server extension** in VS Code

   - Open Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install by Ritwick Dey

2. **Right-click `index.html`**

   - Select "Open with Live Server"

3. **Gallery opens automatically** in your browser

### Method 3: Node.js http-server

1. **Run this command**

   ```powershell
   npx http-server -p 8000
   ```

2. **Open browser**
   - Go to: `http://localhost:8000`

## 🎮 First Time Usage

### Initial View

- You'll start in **Orbit Mode**
- Camera positioned at the center of the gallery
- All controls visible in top-left corner

### What to Try First

1. **Look Around**

   - Click and drag with mouse
   - Scroll to zoom in/out

2. **View Artworks**

   - Click the glowing green spheres near paintings
   - Read artwork information in the modal

3. **Switch to First-Person**

   - Press `C` key
   - Click on screen to lock pointer
   - Use WASD to walk around
   - Move close to paintings for detail

4. **Observe the Actors**

   - Watch the visitor standing by a painting
   - Follow the walking visitor on their tour
   - Look up at the security camera sweeping
   - Find the animated sculpture on the center pedestal

5. **Notice the Details**
   - Shadows cast by lights
   - Dust particles floating in light beams
   - Reflections on the marble floor
   - Different textures on walls and frames

## 🎨 Gallery Tour Guide

### Best Viewing Spots

1. **Center Position** (Default start)

   - Overview of entire gallery
   - Good for screenshots

2. **Back Wall View** (Press C, walk backward)

   - See the large painting
   - Notice the entrance doorway

3. **Close to Paintings**

   - Walk up to artworks in first-person mode
   - Observe texture details and frames

4. **Corner Views**
   - See lighting effects
   - Watch security camera

## ⚙️ Performance Tips

### If Running Slow

1. **Close other browser tabs**
2. **Check FPS counter** (top-right)
3. **Try a different browser** (Chrome recommended)
4. **Reduce browser window size**

### Optimal Settings

- Chrome/Edge: Best performance
- Hardware acceleration: Enabled
- Resolution: 1920×1080 or lower

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /"

**Solution**: Must run through a web server, not open file directly

- Use one of the methods above

### Issue: Controls Panel Says "Mode: First-Person" but mouse doesn't work

**Solution**: Click on the canvas to lock the pointer

### Issue: Can't click on artworks

**Solution**:

- Make sure you're in Orbit mode (press C if needed)
- Release pointer lock (press ESC)
- Click the green glowing spheres

### Issue: Walking through walls

**Solution**: Collision detection limits movement, but can walk near walls. Stay back from edges.

## 📊 What to Look For

### Lighting System

- **Ambient**: Overall brightness
- **Directional**: Main light from above
- **Spotlights**: Bright spots on ceiling aimed at art
- **Point Lights**: Corner atmospheric lights
- **Shadows**: Notice soft shadows on floor and walls

### Material Types

- **Matte**: Walls (no reflection)
- **Glossy**: Floor (some reflection)
- **Metallic**: Some frames (shiny)
- **Glass**: Display case (transparent)

### Animated Elements

1. Standing visitor - subtle idle sway
2. Walking visitor - following path
3. Security camera - rotation sweep
4. Sculpture - rotating rings
5. Dust particles - floating upward
6. Hotspot spheres - pulsing glow

## 🎓 For Evaluation/Demo

### Points to Highlight

1. **Room Structure**

   - Show entrance (doorway in back wall)
   - Point out floor, walls, ceiling differences

2. **Lighting Demo**

   - Count 4 types of lights
   - Show shadows following objects
   - Notice spotlight cones

3. **Textures**

   - Zoom into floor (marble pattern)
   - Look at wall texture (subtle noise)
   - Examine painting surfaces

4. **Shading Models**

   - Floor: High glossiness
   - Walls: Matte finish
   - Glass case: Transparency

5. **Actors**

   - Point out each character
   - Explain their behaviors
   - Show particle system

6. **Interaction**

   - Click artwork hotspot
   - Show modal information
   - Demonstrate camera switching

7. **Controls**
   - Both camera modes
   - Smooth movement
   - Collision boundaries

## 💡 Pro Tips

- **Best Screenshots**: Orbit mode with auto-rotate enabled
- **Smooth Walk**: Hold W in first-person, move mouse slowly
- **Quick View**: Use orbit mode to survey entire gallery
- **Detail Inspection**: Use first-person to get close to art
- **FPS Boost**: Stay in orbit mode if computer is slow

## 📞 Need Help?

Check the browser console (F12) for any error messages or debug information.

---

**Have fun exploring! 🎨✨**
