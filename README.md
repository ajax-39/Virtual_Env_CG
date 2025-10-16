# 🎨 Virtual Art Gallery - Three.js

An interactive 3D Virtual Art Gallery built with Three.js that demonstrates computer graphics fundamentals including lighting, textures, shading, camera controls, and animated visual actors.

![Virtual Art Gallery](https://img.shields.io/badge/Three.js-v0.160.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Features

### Core Environment

- **Room Structure**: 20m × 15m × 4m gallery space with entrance
- **Realistic Materials**:
  - Polished marble floor with reflections
  - Matte painted walls with subtle texture
  - Smooth ceiling
- **Procedural Textures**: Wood, marble, and wall textures generated dynamically

### Lighting System (4 Types)

1. **Ambient Light**: Base illumination (0.3 intensity)
2. **Directional Light**: Simulated skylight with shadows
3. **Spotlights** (5): Individual artwork highlighting with soft edges
4. **Point Lights** (3): Corner atmospheric lighting

- Shadow mapping enabled (2048×2048 resolution)
- PCF Soft Shadow Maps for smooth shadows
- Dynamic lighting system

### Artworks & Displays

- **7 Paintings**: Various sizes with procedural abstract art
- **Custom Frames**: Wood/metallic materials with proper shading
- **3 Pedestals**: Marble columns for sculptures
- **Glass Display Case**: Transparent with internal lighting
- **Interactive Hotspots**: Glowing indicators with click interactions

### Shading Models Demonstrated

- **Diffuse/Lambert**: Matte walls and canvas
- **Phong/Blinn-Phong**: Polished floor with specular highlights
- **PBR (Physically Based)**: Metal frames, stone pedestals
- **Transparent/Refractive**: Glass display cases

### Visual Actors (Animated Characters)

1. **Standing Visitor**: Idle animation with subtle sway
2. **Walking Visitor**: Follows predefined path, pauses at artworks
3. **Security Camera**: Sweeping rotation with red indicator light
4. **Animated Sculpture**: Abstract geometric rings with rotation
5. **Dust Particles** (800+): Floating particles in light beams

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

### Interactive Features

- **Artwork Information**: Click hotspots to view details
- **Hover Effects**: Hotspots glow and scale on hover
- **Modal Display**: Professional artwork information panels
- **Teleport Points**: Quick navigation markers (optional)
- **Real-time FPS Counter**: Performance monitoring

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
virtual-art-gallery/
├── index.html          # Main HTML file
├── styles.css          # UI styling
├── main.js            # Application entry point
├── environment.js     # Room geometry and materials
├── lighting.js        # Lighting system
├── artworks.js        # Paintings and displays
├── actors.js          # Animated characters
├── controls.js        # Camera controls
├── interactions.js    # User interactions
├── utils.js           # Helper functions
└── README.md          # Documentation
```

## 🎮 Controls

| Action                | Control      |
| --------------------- | ------------ |
| Look Around (Orbit)   | Mouse Drag   |
| Look Around (FPS)     | Mouse Move   |
| Move Forward          | W            |
| Move Backward         | S            |
| Move Left             | A            |
| Move Right            | D            |
| Toggle Camera Mode    | C            |
| Zoom In/Out           | Scroll Wheel |
| Interact with Artwork | Left Click   |
| Close Modal           | ESC or X     |

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

- **FPS**: 60 FPS on modern hardware
- **Load Time**: < 5 seconds
- **Memory Usage**: Optimized texture management

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
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
