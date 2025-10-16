# 🎨 Enhanced Virtual Art Gallery - Three.js

An **advanced interactive 3D Virtual Art Gallery** built with Three.js that demonstrates comprehensive computer graphics concepts including lighting, textures, shading, camera controls, animated visual actors, post-processing effects, wildlife simulation, and spatial audio.

![Virtual Art Gallery](https://img.shields.io/badge/Three.js-v0.160.0-blue)
![Enhanced](https://img.shields.io/badge/Version-Enhanced-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Enhanced Features (NEW!)

### 🌟 Advanced Visual Effects

- **Post-Processing Pipeline**:
  - **Bloom Effect**: Glowing lights and highlights
  - **SSAO (Screen Space Ambient Occlusion)**: Realistic contact shadows
  - **FXAA Anti-aliasing**: Smooth edges
  - **Adjustable Settings**: Real-time effect controls
  
- **Volumetric Lighting**:
  - **God Rays**: Dramatic light beams through windows
  - **Light Scattering Shader**: Atmospheric volumetric effects
  - **Dust Particles in Light Beams**: 150+ particles per beam
  
- **Advanced Materials**:
  - **Reflective Mirror**: Real-time planar reflections
  - **Animated Water Fountain**: Custom water shader with ripples
  - **Holographic Display**: Sci-fi shader with scan lines
  - **Weather Effects**: Toggle rain/snow particles

### � Wildlife & Living Environment

- **Flying Birds** (12): Realistic flocking behavior with wing animations
- **Butterflies** (8): Wandering AI with colorful wing patterns
- **Aquarium with Fish** (8): Swimming behavior with tail animations
- **Kinetic Sculpture**: Rotating gears with synchronized movements

### 🤖 Smart NPCs

- **Smart Visitor**: Reacts to player proximity, waves when approached
- **Conversation Group**: Three NPCs engaged in animated discussion
- **Security Guard**: Patrols gallery, warns if too close to artworks
- **Emotion Indicators**: Visual feedback showing NPC states

### 🎮 Enhanced Interactivity

- **Interactive Sculpture**: Click and drag to rotate with momentum
- **Artwork Zoom**: Double-click artworks for detailed view
- **Light Switches**: Toggle individual spotlights on/off
- **Minimap**: Real-time 2D overview showing player and NPC positions
- **Weather Toggle**: Control rain effects

### 📺 Digital Displays

- **TV Screens**: Animated canvas-based content with glow effects
- **Info Panels**: Gallery information displays
- **Digital Artwork**: Shader-based animated art pieces
- **Particle Visualization**: Real-time particle simulations

### 🎵 Spatial Audio System

- **3D Positional Audio**: Sound changes based on location
- **Ambient Gallery Sounds**: Procedurally generated atmosphere
- **Footstep Sounds**: Dynamic footsteps while walking
- **Interactive Sound Effects**: Click sounds, chimes
- **Audio Controls**: Toggle audio on/off

## �📋 Core Features

### Core Environment

- **Room Structure**: 20m × 15m × 4m gallery space with entrance
- **Realistic Materials**:
  - Polished marble floor with reflections
  - Matte painted walls with subtle texture
  - Smooth ceiling
- **Procedural Textures**: Wood, marble, and wall textures generated dynamically

### Lighting System (7+ Light Sources)

1. **Ambient Light**: Base illumination (0.3 intensity)
2. **Directional Light**: Simulated skylight with shadows
3. **Spotlights** (5): Individual artwork highlighting with soft edges
4. **Point Lights** (3): Corner atmospheric lighting
5. **Volumetric Light Beams** (3): God rays through windows
6. **Display Glows**: Hologram and screen lighting

- Shadow mapping enabled (2048×2048 resolution)
- PCF Soft Shadow Maps for smooth shadows
- Dynamic lighting system with real-time controls

### Artworks & Displays

- **7 Paintings**: Various sizes with procedural abstract art
- **Custom Frames**: Wood/metallic materials with proper shading
- **3 Pedestals**: Marble columns for sculptures
- **Glass Display Case**: Transparent with internal lighting
- **Interactive Hotspots**: Glowing indicators with click interactions
- **Digital Artwork**: Shader-animated pieces
- **Video Screens**: Dynamic content displays

### Shading Models Demonstrated

- **Diffuse/Lambert**: Matte walls and canvas
- **Phong/Blinn-Phong**: Polished floor with specular highlights
- **PBR (Physically Based)**: Metal frames, stone pedestals
- **Transparent/Refractive**: Glass display cases, aquarium
- **Custom Shaders**: Holograms, digital art, volumetric lighting

### Visual Actors (15+ Animated Elements)

1. **Standing Visitor**: Idle animation with subtle sway
2. **Walking Visitor**: Follows predefined path, pauses at artworks
3. **Security Camera**: Sweeping rotation with red indicator light
4. **Animated Sculpture**: Abstract geometric rings with rotation
5. **Dust Particles** (800+): Floating particles in light beams
6. **Smart NPC**: Reacts to player with emotions
7. **Conversation Group** (3 NPCs): Animated discussion
8. **Security Guard**: Intelligent patrolling and warnings
9. **Flying Birds** (12): Flocking behavior
10. **Butterflies** (8): Wandering behavior
11. **Swimming Fish** (8): Aquarium inhabitants
12. **Kinetic Gears** (3): Rotating mechanical sculpture
13. **Water Fountain**: Animated spray particles
14. **Hologram**: Rotating with shader effects
15. **Weather Particles**: Optional rain effect

### Camera Controls

#### Orbit Mode (Default)

- **Mouse**: Rotate view
- **Scroll**: Zoom in/out
- **Drag**: Pan camera
- Features: Damping, auto-rotate option, collision prevention

#### First-Person Mode

- **C Key**: Toggle mode
- **WASD**: Movement controls
- **Mouse**: Look around (pointer lock)
- **Collision Detection**: Stay within room bounds
- **Footstep Audio**: Dynamic walking sounds

### Interactive Features

- **Artwork Information**: Click hotspots to view details
- **Artwork Zoom**: Double-click for close-up view
- **Sculpture Rotation**: Click and drag interactive sculptures
- **Light Control**: Toggle individual spotlights
- **Hover Effects**: Hotspots glow and scale on hover
- **Modal Display**: Professional artwork information panels
- **Teleport Points**: Quick navigation markers (optional)
- **Real-time FPS Counter**: Performance monitoring
- **Minimap**: Overhead view with NPC tracking
- **Weather Control**: Toggle rain effects
- **Audio Control**: Enable/disable spatial audio
- **Post-Processing Controls**: Adjust visual effects

## 🚀 Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Local web server (for loading modules)

### Installation

1. **Clone or download the project files**

2. **Start a local server**:

   Using Python:

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js (with http-server):

   ```bash
   npx http-server -p 8000
   ```

   Using PHP:

   ```bash
   php -S localhost:8000
   ```

3. **Open browser**:
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
enhanced-virtual-gallery/
├── index.html              # Main HTML file
├── styles.css              # UI styling
├── main.js                 # Application entry point & orchestration
├── environment.js          # Room geometry and materials
├── lighting.js             # Lighting system & day/night cycle
├── artworks.js             # Paintings and displays
├── actors.js               # Basic animated characters
├── controls.js             # Camera controls (Orbit & FPS)
├── interactions.js         # User interactions & raycasting
├── utils.js                # Helper functions
│
├── NEW ENHANCED MODULES:
├── postProcessing.js       # Bloom, SSAO, FXAA effects
├── volumetricLight.js      # God rays & light scattering
├── advancedEffects.js      # Mirror, water, hologram, weather
├── enhancedInteractions.js # Sculpture rotation, zoom, switches, minimap
├── wildlife.js             # Birds, butterflies, fish, kinetic sculpture
├── enhancedNPC.js          # Smart NPCs with AI behavior
├── videoScreens.js         # TV screens & digital displays
├── audioSystem.js          # Spatial audio & sound effects
│
└── README.md               # Documentation
```

## 🎮 Controls

### Movement & Camera

| Action                   | Control          |
| ------------------------ | ---------------- |
| Look Around (Orbit)      | Mouse Drag       |
| Look Around (FPS)        | Mouse Move       |
| Move Forward             | W                |
| Move Backward            | S                |
| Move Left                | A                |
| Move Right               | D                |
| Toggle Camera Mode       | C                |
| Zoom In/Out              | Scroll Wheel     |

### Interactions

| Action                   | Control          |
| ------------------------ | ---------------- |
| View Artwork Info        | Left Click       |
| Zoom to Artwork          | Double Click     |
| Rotate Sculpture         | Click & Drag     |
| Toggle Light Switch      | Left Click       |
| Close Modal              | ESC or X         |

### Special Features

| Action                   | Control/Location |
| ------------------------ | ---------------- |
| Toggle Rain              | Button (Bottom Left) |
| Enable Audio             | Button (Top Left)    |
| Toggle Audio             | Audio Controls (Top Right) |
| Post-Processing Settings | Controls (Top Right)     |
| View Minimap             | Bottom Right             |

## 🎨 Technical Details

### Scene Graph Organization

```
Scene
├── Environment Group
│   ├── Floor (Reflective marble)
│   ├── Walls (Matte painted)
│   ├── Ceiling
│   └── Entrance
├── Lighting Group
│   ├── Ambient Light
│   ├── Directional Light
│   ├── Spotlights [5]
│   └── Point Lights [3]
├── Artworks Group
│   ├── Paintings [7]
│   ├── Pedestals [3]
│   └── Display Case
├── Actors Group
│   ├── Standing Visitor
│   ├── Walking Visitor
│   ├── Security Camera
│   └── Animated Sculpture
└── Particles Group
    └── Dust Particles [800+]
```

### Material Types

- **MeshStandardMaterial**: Walls, floor, pedestals (PBR workflow)
- **MeshPhysicalMaterial**: Glass display case (transmission)
- **MeshBasicMaterial**: Light indicators, hotspots (emissive)

### Performance Optimizations

- Efficient shadow mapping (selective casting)
- Procedural textures (reduced file size)
- Frustum culling (automatic by Three.js)
- Optimized particle count
- Responsive rendering resolution

## 🔧 Customization

### Adding New Artworks

Edit `artworks.js`:

```javascript
const paintingConfigs = [
  {
    width: 1.5,
    height: 2,
    x: -7,
    z: -roomDepth / 2 + 0.15,
    wallNormal: new THREE.Vector3(0, 0, 1),
    title: "Your Title",
    artist: "Artist Name",
    description: "Description here",
    seed: 1,
  },
];
```

### Modifying Room Size

Edit `environment.js`:

```javascript
const roomWidth = 20; // Change width
const roomDepth = 15; // Change depth
const roomHeight = 4; // Change height
```

### Adjusting Lighting

Edit `lighting.js`:

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Color, intensity
const directionalLight = new THREE.DirectionalLight(0xfffaf0, 0.6);
```

### Changing Visitor Behavior

Edit `actors.js`:

```javascript
visitor.userData = {
  speed: 0.02, // Walking speed
  pauseDuration: 3, // Pause time at artworks (seconds)
  // ...
};
```

## 📊 Performance Metrics

### Target Performance

- **FPS**: 60 FPS on modern hardware, 30+ FPS on mid-range
- **Load Time**: < 8 seconds with all enhanced features
- **Memory Usage**: Optimized texture management & particle systems
- **Rendering**: Efficient post-processing pipeline

### Performance Features

- LOD (Level of Detail) ready
- Frustum culling (automatic by Three.js)
- Optimized particle systems (1500+ particles total)
- Efficient shadow mapping
- Conditional rendering for weather effects
- Post-processing with optimized passes

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+ (limited post-processing)
- ⚠️ Requires WebGL 2.0 support

## 🎯 Computer Graphics Concepts Demonstrated

### Rendering Techniques
- ✅ Forward rendering pipeline
- ✅ Shadow mapping (PCF soft shadows)
- ✅ Post-processing effects
- ✅ Screen-space effects (SSAO)
- ✅ Volumetric rendering
- ✅ Real-time reflections

### Shading & Materials
- ✅ Phong/Blinn-Phong shading
- ✅ Physically-Based Rendering (PBR)
- ✅ Custom shader programming (GLSL)
- ✅ Procedural textures
- ✅ Transparency & refraction
- ✅ Emissive materials

### Lighting Models
- ✅ Ambient lighting
- ✅ Directional lights (sun simulation)
- ✅ Point lights (omnidirectional)
- ✅ Spotlights (focused illumination)
- ✅ Volumetric light scattering
- ✅ HDR tone mapping

### Animation & Simulation
- ✅ Skeletal animation (humanoid characters)
- ✅ Procedural animation
- ✅ Particle systems
- ✅ Flocking algorithms (birds)
- ✅ AI behavior (NPCs)
- ✅ Physics simulation (water, particles)

### Interaction & Controls
- ✅ Raycasting for object selection
- ✅ First-person camera controls
- ✅ Orbit camera controls
- ✅ Collision detection
- ✅ Mouse & keyboard input handling
- ✅ Pointer lock API

### Advanced Techniques
- ✅ Post-processing pipeline (bloom, SSAO, FXAA)
- ✅ Planar reflections
- ✅ Canvas-based textures (procedural content)
- ✅ Spatial audio (3D positional sound)
- ✅ Dynamic content generation
- ✅ Real-time shader compilation

## 🌟 Feature Highlights by Module

### postProcessing.js
- **Bloom**: Realistic light glow and HDR effects
- **SSAO**: Contact shadows for depth perception
- **FXAA**: Anti-aliasing for smooth edges
- **Real-time controls**: Adjustable effect parameters

### volumetricLight.js
- **God Rays**: Atmospheric light scattering through windows
- **Volumetric Cone**: Visible light beam geometry
- **Dust Particles**: Enhanced atmosphere with 450+ particles
- **Custom Shaders**: GLSL-based light scattering

### advancedEffects.js
- **Mirror**: Real-time planar reflections (Reflector object)
- **Water Fountain**: Custom water shader with ripples
- **Hologram**: Sci-fi shader with scan lines & distortion
- **Rain System**: Toggleable weather particles

### enhancedInteractions.js
- **Interactive Sculpture**: Physics-based drag rotation
- **Artwork Zoom**: Smooth camera interpolation
- **Light Switches**: Toggle spotlights with visual feedback
- **Minimap**: 2D canvas-based navigation aid

### wildlife.js
- **Birds**: Reynolds' flocking algorithm (separation, alignment, cohesion)
- **Butterflies**: Wandering behavior with perlin-like movement
- **Fish**: Bounded swimming in aquarium
- **Kinetic Sculpture**: Synchronized gear rotations

### enhancedNPC.js
- **State Machine AI**: Idle, walking, looking, waving states
- **Proximity Detection**: React to player distance
- **Emotion System**: Visual indicators for NPC states
- **Security Guard**: Patrol routes & warning system

### videoScreens.js
- **Canvas Textures**: Real-time procedural content
- **Animated Graphics**: Time-based visual effects
- **Digital Art**: Shader-based animations
- **Particle Visualization**: Live particle simulation displays

### audioSystem.js
- **Spatial Audio**: 3D positional sound based on listener position
- **Procedural Sounds**: Generated footsteps, clicks, chimes
- **Ambient Atmosphere**: Gallery background ambience
- **Interactive SFX**: User action feedback

## 🎓 Educational Value

This project serves as a comprehensive example for learning:

1. **Three.js Fundamentals**: Scene setup, geometry, materials, lights
2. **Advanced Rendering**: Post-processing, custom shaders, effects
3. **Game Development**: Camera controls, interactions, AI
4. **Optimization**: Performance tuning, LOD, efficient rendering
5. **User Experience**: UI/UX design, feedback systems, accessibility
6. **Software Architecture**: Modular design, separation of concerns

## 🔧 Customization
- ✅ Safari 14+
- ✅ Edge 90+

## 🎓 Educational Value

This project demonstrates:

1. **3D Scene Construction**: Hierarchical scene graphs
2. **Lighting Techniques**: Multiple light types and shadows
3. **Material Systems**: PBR, transparency, reflections
4. **Animation**: Character movement, procedural motion
5. **User Interaction**: Raycasting, modal systems
6. **Camera Control**: Multiple control schemes
7. **Performance**: Optimization techniques

## 🐛 Troubleshooting

### Issue: Black Screen

- **Solution**: Ensure running on local server (not file://)
- Check browser console for errors

### Issue: Low FPS

- **Solution**: Reduce particle count in `actors.js`
- Disable some spotlights in `lighting.js`
- Lower shadow map resolution

### Issue: Controls Not Working

- **Solution**: Check console for errors
- Ensure canvas has focus (click on it)
- Try refreshing the page

### Issue: Textures Not Loading

- **Solution**: Procedural textures should work offline
- Check browser WebGL support

## 🔮 Future Enhancements

Potential additions:

- [ ] VR support with WebXR
- [ ] Audio system (ambient sounds, footsteps)
- [ ] Multiple gallery rooms
- [ ] Real artwork loading from URLs
- [ ] Mobile touch controls
- [ ] Screenshot/photo mode
- [ ] Guided tour mode
- [ ] Multiplayer support
- [ ] Admin panel for artwork management

## 📝 Code Quality

- **Modular Architecture**: Separated concerns across files
- **Clean Code**: Well-commented and documented
- **ES6+ Standards**: Modern JavaScript practices
- **Performance-Focused**: Optimized rendering pipeline

## 🎯 Assignment Checklist

### Core Environment ✓

- [x] Room geometry (20×15×4m)
- [x] 4 types of lighting
- [x] 7 artworks with frames
- [x] 3 pedestals with varied materials
- [x] Proper shadows enabled
- [x] 3+ shading models demonstrated
- [x] Textures on all surfaces
- [x] Two camera control modes

### Visual Actors ✓

- [x] 2 animated visitor characters
- [x] Environmental animation (particles/sculpture)
- [x] Interactive elements (hotspots)
- [x] Proper scene graph organization
- [x] Smooth animations
- [x] Visual hierarchy

### Technical ✓

- [x] 60 FPS target performance
- [x] Responsive to window resize
- [x] Clean, commented code
- [x] No console errors
- [x] Professional appearance

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

**Virtual Art Gallery Project**

- Computer Graphics Lab Assignment
- Three.js Implementation

## 🙏 Acknowledgments

- Three.js library and documentation
- WebGL and computer graphics community
- Procedural generation techniques

---

**Enjoy exploring the Virtual Art Gallery! 🎨**

For questions or issues, check the browser console for debug information.
