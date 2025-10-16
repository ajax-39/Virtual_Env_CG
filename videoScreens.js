/**
 * Video Screens and Dynamic Content Displays
 */

import * as THREE from "three";

/**
 * Create TV screen with canvas-based animation
 */
export function createTVScreen(scene, position, rotation = 0) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = rotation;

  // TV Frame
  const frameGeometry = new THREE.BoxGeometry(2.2, 1.4, 0.15);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.3,
    metalness: 0.7,
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.castShadow = true;
  group.add(frame);

  // Screen with canvas texture
  const canvas = createAnimatedCanvas();
  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.needsUpdate = true;

  const screenGeometry = new THREE.PlaneGeometry(2, 1.2);
  const screenMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    side: THREE.DoubleSide,
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.z = 0.08;
  group.add(screen);

  // Screen glow
  const glowLight = new THREE.PointLight(0x66ccff, 0.5, 3);
  glowLight.position.z = 0.5;
  group.add(glowLight);

  scene.add(group);

  return {
    tvGroup: group,
    screen: screen,
    canvas: canvas,
    texture: canvasTexture,
    material: screenMaterial,
  };
}

/**
 * Create animated canvas for screen content
 */
function createAnimatedCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  return canvas;
}

/**
 * Update TV screen with animated content
 */
export function updateTVScreen(tvData, deltaTime) {
  if (!tvData || !tvData.canvas) return;

  const canvas = tvData.canvas;
  const ctx = canvas.getContext("2d");
  const time = Date.now() * 0.001;

  // Clear canvas
  ctx.fillStyle = "#000033";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw animated content
  drawAnimatedGraphics(ctx, canvas.width, canvas.height, time);

  // Update texture
  if (tvData.texture) {
    tvData.texture.needsUpdate = true;
  }
}

/**
 * Draw animated graphics on canvas
 */
function drawAnimatedGraphics(ctx, width, height, time) {
  // Animated gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `hsl(${time * 50 % 360}, 70%, 30%)`);
  gradient.addColorStop(0.5, `hsl(${(time * 50 + 120) % 360}, 70%, 20%)`);
  gradient.addColorStop(1, `hsl(${(time * 50 + 240) % 360}, 70%, 30%)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Animated circles
  for (let i = 0; i < 5; i++) {
    const phase = time + i * Math.PI * 0.4;
    const x = width / 2 + Math.cos(phase) * (width * 0.3);
    const y = height / 2 + Math.sin(phase * 0.7) * (height * 0.3);
    const radius = 30 + Math.sin(time * 2 + i) * 20;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(i * 72 + time * 50) % 360}, 80%, 60%, 0.6)`;
    ctx.fill();
  }

  // Text display
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("VIRTUAL GALLERY", width / 2, height / 2);

  ctx.font = "24px Arial";
  ctx.fillText(`${new Date().toLocaleTimeString()}`, width / 2, height / 2 + 60);

  ctx.shadowBlur = 0;

  // Scan lines effect
  ctx.globalAlpha = 0.1;
  for (let y = 0; y < height; y += 4) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, y, width, 2);
  }
  ctx.globalAlpha = 1.0;
}

/**
 * Create information display panel
 */
export function createInfoPanel(scene, position, rotation = 0) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = rotation;

  // Panel backing
  const panelGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    roughness: 0.4,
    metalness: 0.6,
  });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.castShadow = true;
  group.add(panel);

  // Display canvas
  const canvas = createInfoCanvas();
  const canvasTexture = new THREE.CanvasTexture(canvas);

  const displayGeometry = new THREE.PlaneGeometry(1.4, 1.9);
  const displayMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    side: THREE.DoubleSide,
  });
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.z = 0.06;
  group.add(display);

  // Ambient glow
  const glowLight = new THREE.PointLight(0x00ffaa, 0.3, 2);
  glowLight.position.z = 0.3;
  group.add(glowLight);

  scene.add(group);

  return {
    panelGroup: group,
    display: display,
    canvas: canvas,
    texture: canvasTexture,
  };
}

/**
 * Create info canvas
 */
function createInfoCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 550;

  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#00d4ff";
  ctx.textAlign = "center";
  ctx.fillText("GALLERY INFO", canvas.width / 2, 50);

  // Border
  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Information sections
  const infoLines = [
    "",
    "CURRENT EXHIBITION:",
    "Modern Digital Art",
    "",
    "FEATURED ARTISTS:",
    "• Various Contemporary",
    "• Interactive Installations",
    "• Digital Sculptures",
    "",
    "GALLERY HOURS:",
    "24/7 Virtual Access",
    "",
    "SPECIAL FEATURES:",
    "• Interactive Elements",
    "• Dynamic Lighting",
    "• Spatial Audio",
    "• Wildlife Exhibits",
  ];

  ctx.font = "18px Arial";
  ctx.fillStyle = "#e0e0e0";
  ctx.textAlign = "left";

  let yPos = 100;
  infoLines.forEach((line) => {
    if (line.startsWith("•")) {
      ctx.fillStyle = "#00ff88";
    } else if (line.endsWith(":")) {
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 20px Arial";
    } else {
      ctx.fillStyle = "#e0e0e0";
      ctx.font = "18px Arial";
    }

    ctx.fillText(line, 30, yPos);
    yPos += 28;
  });

  return canvas;
}

/**
 * Create digital artwork with shader animation
 */
export function createDigitalArtwork(scene, position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Frame
  const frameGeometry = new THREE.BoxGeometry(1.6, 1.6, 0.08);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.8,
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  group.add(frame);

  // Animated artwork using shader
  const artworkGeometry = new THREE.PlaneGeometry(1.5, 1.5);
  const artworkMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(512, 512) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float d = length(uv);
        
        // Animated pattern
        float pattern = sin(d * 10.0 - time * 2.0) * 0.5 + 0.5;
        pattern *= sin(atan(uv.y, uv.x) * 6.0 + time) * 0.5 + 0.5;
        
        // Color
        vec3 color1 = vec3(0.2, 0.8, 1.0);
        vec3 color2 = vec3(1.0, 0.3, 0.8);
        vec3 color3 = vec3(0.3, 1.0, 0.5);
        
        vec3 finalColor = mix(color1, color2, pattern);
        finalColor = mix(finalColor, color3, sin(time * 0.5) * 0.5 + 0.5);
        
        // Vignette
        finalColor *= 1.0 - d * 0.3;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide,
  });

  const artwork = new THREE.Mesh(artworkGeometry, artworkMaterial);
  artwork.position.z = 0.05;
  group.add(artwork);

  scene.add(group);

  return {
    artworkGroup: group,
    material: artworkMaterial,
  };
}

/**
 * Update digital artwork
 */
export function updateDigitalArtwork(artworkData, deltaTime) {
  if (!artworkData || !artworkData.material) return;

  artworkData.material.uniforms.time.value += deltaTime;
}

/**
 * Create particle visualization screen
 */
export function createParticleScreen(scene, position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Canvas for particle visualization
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const canvasTexture = new THREE.CanvasTexture(canvas);

  const screenGeometry = new THREE.PlaneGeometry(2, 2);
  const screenMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    transparent: true,
    opacity: 0.9,
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  group.add(screen);

  scene.add(group);

  return {
    screenGroup: group,
    canvas: canvas,
    texture: canvasTexture,
    particles: initializeParticles(100),
  };
}

/**
 * Initialize particles for visualization
 */
function initializeParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 512,
      y: Math.random() * 512,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      hue: Math.random() * 360,
    });
  }
  return particles;
}

/**
 * Update particle screen
 */
export function updateParticleScreen(screenData, deltaTime) {
  if (!screenData || !screenData.canvas) return;

  const canvas = screenData.canvas;
  const ctx = canvas.getContext("2d");
  const particles = screenData.particles;

  // Fade effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, 0.8)`;
    ctx.fill();

    p.hue = (p.hue + 0.5) % 360;
  });

  // Update texture
  if (screenData.texture) {
    screenData.texture.needsUpdate = true;
  }
}
