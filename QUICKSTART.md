# 🚀 Quick Start Guide - Enhanced Virtual Art Gallery

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
- Post-processing effects active (Bloom, SSAO)
- Multiple UI controls visible on screen

### Essential First Steps

1. **Enable Audio** (Optional but Recommended)

   - Click the "🔊 Enable Audio" button (top-left)
   - Experience spatial audio and ambient sounds
   - Hear footsteps when walking

2. **Look Around**

   - Click and drag with mouse to orbit
   - Scroll to zoom in/out
   - Notice the enhanced lighting and god rays

3. **Explore New Visual Effects**

   - **God Rays**: Look at the window with volumetric light beams
   - **Mirror**: Find the reflective mirror on the left wall
   - **Water Fountain**: See the animated fountain in the back
   - **Hologram**: Check out the sci-fi holographic display

### Interactive Features to Try

1. **View Artwork Info**

   - Click the glowing green spheres near paintings
   - Read artwork details in the modal

2. **Zoom to Artworks**

   - **Double-click** any painting to zoom in
   - Double-click again to zoom out
   - Experience smooth camera interpolation

3. **Rotate Interactive Sculpture**

   - Find the colorful geometric sculpture
   - **Click and drag** to rotate it
   - Release to see momentum physics

4. **Toggle Light Switches**

   - Find wall-mounted light switches near spotlights
   - **Click** to turn individual lights on/off
   - Watch the lighting change in real-time

5. **Switch to First-Person**

   - Press `C` key
   - Click on screen to lock pointer
   - Use **WASD** to walk around
   - Hear footsteps as you move
   - Get close to paintings for detail

### Discover Living Elements

1. **Wildlife**

   - **Birds**: Watch 12 birds flying with flocking behavior
   - **Butterflies**: Spot 8 colorful butterflies wandering
   - **Fish**: Visit the aquarium to see swimming fish
   - **Kinetic Sculpture**: Find the rotating gears

2. **Smart NPCs**

   - **Smart Visitor**: Approach them - they'll wave at you!
   - **Conversation Group**: Find 3 NPCs chatting together
   - **Security Guard**: Don't get too close to artworks!
   - Watch NPCs react to your presence

3. **Digital Displays**

   - **TV Screens**: Animated content displays
   - **Info Panels**: Gallery information
   - **Digital Art**: Shader-based animated artwork
   - **Particle Visualization**: Live particle simulations

### Special Features

1. **Minimap** (Bottom-right)

   - See your position in green
   - NPCs shown as red dots
   - Useful for navigation

2. **Weather Control** (Bottom-left)

   - Click "☔ Toggle Rain" to add weather effects
   - Toggle on/off for different atmospheres

3. **Post-Processing Controls** (Top-right)

   - Toggle Bloom effect
   - Toggle SSAO (ambient occlusion)
   - Adjust Bloom strength with slider

4. **Audio Controls** (Top-right)
   - Toggle spatial audio on/off
   - All sounds generated procedurally

### Observation Points

1. **Notice the Details**
   - Shadows cast by multiple lights
   - Dust particles floating in light beams (450+)
   - Reflections in mirror and marble floor
   - God rays through windows
   - NPCs with emotions and behaviors
   - Different textures and materials

## 🎨 Enhanced Gallery Tour Guide

### Must-See Locations

1. **Center Position** (Default start)

   - Overview of entire gallery
   - Perfect for screenshots
   - Check minimap orientation

2. **Window Area**

   - See dramatic god rays
   - Dust particles in light beams
   - Atmospheric volumetric effects

3. **Mirror Wall** (Left side)

   - Real-time reflections
   - Ornate gold frame
   - See yourself and the gallery reflected

4. **Water Fountain** (Back area)

   - Animated water with shaders
   - Particle spray effects
   - Listen to water sounds (with audio)

5. **Hologram Display**

   - Sci-fi shader effects
   - Scan lines and distortion
   - Rotating base ring

6. **Aquarium** (Right side)

   - Swimming fish with tail animations
   - Glass refraction effects
   - Interior lighting

7. **Digital Displays**

   - TV screens with animated content
   - Info panels
   - Particle visualizations

8. **Interactive Sculpture**

   - Try dragging to rotate
   - Colorful geometric design
   - Hover for glow effect

### Best Viewing Sequences

**Sequence 1: Visual Effects Tour**

1. Start at center
2. Look at window god rays
3. Walk to mirror
4. Visit water fountain
5. Check out hologram

## 📋 Complete Controls Reference

### Movement (First-Person Mode)

| Key | Action          |
| --- | --------------- |
| W   | Move Forward    |
| S   | Move Backward   |
| A   | Move Left       |
| D   | Move Right      |
| C   | Toggle FPS Mode |

### Camera (Orbit Mode)

| Action        | Control      |
| ------------- | ------------ |
| Rotate View   | Mouse Drag   |
| Zoom In/Out   | Scroll Wheel |
| Pan Camera    | Right Drag   |
| Toggle to FPS | Press C      |

### Interactions

| Action                | How To                      |
| --------------------- | --------------------------- |
| View Artwork Info     | Click green hotspot         |
| Zoom to Artwork       | Double-click painting       |
| Zoom Out              | Double-click again          |
| Rotate Sculpture      | Click & drag sculpture      |
| Toggle Light Switch   | Click wall switch           |
| Close Modal           | ESC key or X button         |
| Enable Audio          | Click audio button          |
| Toggle Rain           | Click rain button           |
| Adjust Effects        | Use sliders (top-right)     |

### UI Elements

| Element                  | Location     | Function                      |
| ------------------------ | ------------ | ----------------------------- |
| FPS Counter              | Top-Left     | Shows frame rate              |
| Audio Enable             | Top-Left     | Enable spatial audio          |
| Audio Controls           | Top-Right    | Toggle audio on/off           |
| Post-Processing Controls | Top-Right    | Adjust visual effects         |
| Rain Toggle              | Bottom-Left  | Enable/disable weather        |
| Minimap                  | Bottom-Right | Navigation aid                |

## 🎓 Learning Path

### Beginner (5 minutes)

1. Start the gallery
2. Use mouse to look around
3. Click a green hotspot
4. Try WASD movement
5. Double-click an artwork

### Intermediate (15 minutes)

1. Enable audio
2. Find and interact with all NPCs
3. Try rotating the interactive sculpture
4. Toggle some light switches
5. Enable rain effect
6. Watch birds and butterflies
7. Visit the aquarium

### Advanced (30+ minutes)

1. Explore all digital displays
2. Experiment with post-processing settings
3. Observe NPC AI behaviors
4. Find all wildlife (birds, butterflies, fish)
5. Study the volumetric lighting effects
6. Examine the mirror reflections
7. Analyze the water fountain shader
8. Check out the hologram display
9. Use minimap for complete exploration
10. Try viewing from different camera angles

## 🐛 Troubleshooting

### Gallery doesn't load

- **Issue**: Blank screen or errors
- **Solution**: Check browser console (F12), ensure you're using a local server

### Low FPS (< 30)

- **Issue**: Gallery runs slowly
- **Solutions**:
  1. Disable Bloom in post-processing controls
  2. Disable SSAO for performance boost
  3. Turn off rain effect
  4. Close other browser tabs
  5. Try a different browser (Chrome recommended)

### Audio doesn't play

- **Issue**: No sound
- **Solutions**:
  1. Click "Enable Audio" button
  2. Check browser audio permissions
  3. Ensure volume is up
  4. Try refreshing the page

### Controls not working

- **Issue**: Mouse/keyboard don't respond
- **Solutions**:
  1. Click on the canvas area
  2. Press ESC to exit pointer lock
  3. Refresh the page
  4. Check browser console for errors

### Textures missing or black

- **Issue**: Objects appear black
- **Solutions**:
  1. Ensure WebGL 2.0 support
  2. Update graphics drivers
  3. Try a different browser

### Post-processing looks weird

- **Issue**: Visual artifacts
- **Solutions**:
  1. Toggle effects off and back on
  2. Adjust Bloom strength
  3. Refresh the page

## 🌟 Hidden Features

### Easter Eggs to Find

1. **Security Guard Behavior**: Get very close to artworks and watch what happens!
2. **NPC Emotions**: Smart NPC changes color based on interaction
3. **Bird Flocking**: Watch birds naturally avoid each other
4. **Water Physics**: Fountain particles have realistic gravity
5. **Hologram Glitches**: Shader creates authentic sci-fi effects

### Advanced Interactions

- **FPS in modal view**: You can still move while viewing artwork info
- **Minimap tracking**: NPCs show up as red dots in real-time
- **Light switch patterns**: Try turning all lights off
- **Rain + God rays**: Amazing combined effect
- **Mirror + Butterflies**: Watch butterflies in the mirror

## 📚 Additional Resources

### Understanding the Technology

- **Three.js Documentation**: https://threejs.org/docs/
- **WebGL Fundamentals**: https://webglfundamentals.org/
- **Shader Programming**: https://thebookofshaders.com/

### Learning Computer Graphics

This gallery demonstrates:

- ✅ Multiple lighting models
- ✅ Shadow mapping
- ✅ Post-processing effects
- ✅ Custom shaders (GLSL)
- ✅ Particle systems
- ✅ AI behavior
- ✅ Physics simulation
- ✅ Spatial audio
- ✅ Interactive 3D interfaces

Perfect for students learning computer graphics fundamentals!

## 💡 Tips for Presentations

### Best Screenshots

1. **God Rays**: Position camera to show window beams
2. **Mirror**: Capture reflection effect
3. **NPCs**: Get close-up of smart NPC waving
4. **Birds**: Show flocking behavior from above
5. **Aquarium**: Side view showing fish swimming

### Demonstration Flow

1. **Start**: Overview from center (10 sec)
2. **Movement**: Show FPS mode walking (20 sec)
3. **Interaction**: Click artwork, zoom in (15 sec)
4. **Sculpture**: Drag-rotate demonstration (15 sec)
5. **Effects**: Toggle rain, lights (15 sec)
6. **NPCs**: Approach smart NPC (15 sec)
7. **Wildlife**: Show birds/butterflies (20 sec)
8. **Tech**: Show post-processing controls (10 sec)

**Total**: ~2 minutes for comprehensive demo

---

## 🎉 Enjoy Exploring!

This enhanced virtual gallery showcases cutting-edge web-based 3D graphics. Take your time to explore all the features, interact with NPCs, and appreciate the advanced visual effects!

**Happy Exploring! 🎨✨**

**Sequence 3: Interactive Elements**

1. Double-click artwork to zoom
2. Drag sculpture to rotate
3. Toggle a light switch
4. Enable rain effect
5. Adjust post-processing settings

## ⚙️ Performance Tips

### For Best Performance

- Modern GPU recommended (GTX 1060 / RX 580 or better)
- Close other browser tabs
- Use Chrome or Firefox for best compatibility
- Disable post-processing if FPS drops below 30

### Optimizing Settings

1. **Post-Processing Controls** (top-right):
   - Disable Bloom if performance is low
   - Disable SSAO for ~10 FPS boost
   - Reduce Bloom strength

2. **Weather Effects**:
   - Keep rain disabled unless needed
   - Rain adds ~500 particles

3. **Audio**:
   - Can be disabled to save a bit of CPU

### FPS Counter

- Located in top-left corner
- **Green**: 50+ FPS (excellent)
- **Yellow**: 30-50 FPS (good)
- **Red**: <30 FPS (consider optimizing)

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
