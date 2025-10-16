/**
 * Advanced Animations - Kinetic sculptures, Holograms, Clock, Animated Paintings
 */

import * as THREE from "three";

/**
 * Create kinetic sculpture with complex movements
 */
export function createKineticSculpture(x, y, z) {
  const sculptureGroup = new THREE.Group();
  sculptureGroup.name = "KineticSculpture";

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.1, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    metalness: 0.8,
    roughness: 0.2,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.castShadow = true;
  sculptureGroup.add(base);

  // Create multiple rotating rings
  const rings = [];
  const ringCount = 5;

  for (let i = 0; i < ringCount; i++) {
    const radius = 0.3 + i * 0.15;
    const ringGeometry = new THREE.TorusGeometry(radius, 0.03, 16, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(i / ringCount, 0.8, 0.5),
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color().setHSL(i / ringCount, 0.8, 0.3),
      emissiveIntensity: 0.3,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 0.1 + i * 0.2;
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;

    ring.userData.rotationSpeed = 0.5 + Math.random() * 0.5;
    ring.userData.axis = Math.random() > 0.5 ? "x" : "y";
    ring.userData.phase = Math.random() * Math.PI * 2;

    rings.push(ring);
    sculptureGroup.add(ring);
  }

  // Add central sphere
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.0,
    emissive: 0x4444ff,
    emissiveIntensity: 0.5,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.y = 0.5;
  sphere.castShadow = true;
  sculptureGroup.add(sphere);

  sculptureGroup.position.set(x, y, z);
  sculptureGroup.userData.rings = rings;
  sculptureGroup.userData.sphere = sphere;

  return sculptureGroup;
}

/**
 * Create holographic display with shader effects
 */
export function createHologram(x, y, z, text = "HOLOGRAM") {
  const hologramGroup = new THREE.Group();
  hologramGroup.name = "Hologram";

  // Hologram projector base
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.1, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  hologramGroup.add(base);

  // Holographic plane with custom shader
  const holoGeometry = new THREE.PlaneGeometry(1.5, 1.5, 32, 32);
  const holoMaterial = createHologramShader();

  const holoPlane = new THREE.Mesh(holoGeometry, holoMaterial);
  holoPlane.position.y = 1.2;
  hologramGroup.add(holoPlane);

  // Add particles around hologram
  const particles = createHologramParticles();
  particles.position.y = 1.2;
  hologramGroup.add(particles);

  // Light beam
  const beamGeometry = new THREE.CylinderGeometry(0.05, 0.2, 1.0, 8, 1, true);
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.y = 0.6;
  hologramGroup.add(beam);

  hologramGroup.position.set(x, y, z);
  hologramGroup.userData.holoMaterial = holoMaterial;
  hologramGroup.userData.particles = particles;

  return hologramGroup;
}

/**
 * Create hologram shader material
 */
function createHologramShader() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00ffff) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Wave effect
        vec3 pos = position;
        pos.z += sin(pos.y * 5.0 + time * 2.0) * 0.1;
        pos.z += cos(pos.x * 5.0 + time * 3.0) * 0.1;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Grid pattern
        vec2 grid = fract(vUv * 10.0);
        float gridLine = step(0.95, max(grid.x, grid.y));
        
        // Scanlines
        float scanline = sin(vUv.y * 50.0 + time * 5.0) * 0.5 + 0.5;
        
        // Fade edges
        float edgeFade = 1.0 - length(vUv - 0.5) * 1.5;
        
        // Combine effects
        vec3 finalColor = color * (gridLine * 0.5 + scanline * 0.3 + 0.5);
        float alpha = edgeFade * (scanline * 0.3 + 0.7);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Create particles for hologram effect
 */
function createHologramParticles() {
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = Math.random() * 1.0;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Create animated clock
 */
export function createClock(x, y, z) {
  const clockGroup = new THREE.Group();
  clockGroup.name = "Clock";

  // Clock face
  const faceGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
  const faceMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.7,
  });
  const face = new THREE.Mesh(faceGeometry, faceMaterial);
  face.rotation.x = Math.PI / 2;
  face.castShadow = true;
  clockGroup.add(face);

  // Clock rim
  const rimGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    metalness: 0.5,
    roughness: 0.5,
  });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  clockGroup.add(rim);

  // Hour markers
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const markerGeometry = new THREE.BoxGeometry(0.03, 0.08, 0.02);
    const markerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    const radius = 0.4;
    marker.position.x = Math.sin(angle) * radius;
    marker.position.y = Math.cos(angle) * radius;
    marker.position.z = 0.06;
    marker.rotation.z = -angle;

    clockGroup.add(marker);
  }

  // Hour hand
  const hourHandGeometry = new THREE.BoxGeometry(0.04, 0.25, 0.02);
  const hourHandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
  hourHand.position.z = 0.08;
  hourHand.position.y = 0.08;
  clockGroup.add(hourHand);

  // Minute hand
  const minuteHandGeometry = new THREE.BoxGeometry(0.03, 0.35, 0.02);
  const minuteHandMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
  });
  const minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
  minuteHand.position.z = 0.09;
  minuteHand.position.y = 0.12;
  clockGroup.add(minuteHand);

  // Second hand
  const secondHandGeometry = new THREE.BoxGeometry(0.02, 0.4, 0.01);
  const secondHandMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
  });
  const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
  secondHand.position.z = 0.1;
  secondHand.position.y = 0.15;
  clockGroup.add(secondHand);

  // Center dot
  const dotGeometry = new THREE.SphereGeometry(0.03, 16, 16);
  const dotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);
  dot.position.z = 0.11;
  clockGroup.add(dot);

  clockGroup.position.set(x, y, z);
  clockGroup.rotation.y = Math.PI;
  clockGroup.userData.hourHand = hourHand;
  clockGroup.userData.minuteHand = minuteHand;
  clockGroup.userData.secondHand = secondHand;

  return clockGroup;
}

/**
 * Create animated painting with shader effects
 */
export function createAnimatedPainting(x, y, z, width = 2, height = 1.5) {
  const paintingGroup = new THREE.Group();
  paintingGroup.name = "AnimatedPainting";

  // Frame
  const frameThickness = 0.08;
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b6914,
    metalness: 0.3,
    roughness: 0.7,
  });

  // Frame pieces
  const frameTop = new THREE.Mesh(
    new THREE.BoxGeometry(
      width + frameThickness * 2,
      frameThickness,
      frameThickness
    ),
    frameMaterial
  );
  frameTop.position.y = height / 2 + frameThickness / 2;
  paintingGroup.add(frameTop);

  const frameBottom = frameTop.clone();
  frameBottom.position.y = -height / 2 - frameThickness / 2;
  paintingGroup.add(frameBottom);

  const frameLeft = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, height, frameThickness),
    frameMaterial
  );
  frameLeft.position.x = -width / 2 - frameThickness / 2;
  paintingGroup.add(frameLeft);

  const frameRight = frameLeft.clone();
  frameRight.position.x = width / 2 + frameThickness / 2;
  paintingGroup.add(frameRight);

  // Animated canvas with shader
  const canvasGeometry = new THREE.PlaneGeometry(width, height, 64, 64);
  const canvasMaterial = createAnimatedPaintingShader();

  const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
  canvas.position.z = frameThickness / 2;
  paintingGroup.add(canvas);

  paintingGroup.position.set(x, y, z);
  paintingGroup.userData.canvasMaterial = canvasMaterial;

  return paintingGroup;
}

/**
 * Create shader for animated painting
 */
function createAnimatedPaintingShader() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x1e3a8a) },
      color2: { value: new THREE.Color(0x7c3aed) },
      color3: { value: new THREE.Color(0xfbbf24) },
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Subtle wave animation
        pos.z += sin(pos.x * 3.0 + time) * cos(pos.y * 3.0 + time) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;
      
      // Noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Moving gradient
        float gradient = sin(uv.x * 3.14159 + time * 0.5) * cos(uv.y * 3.14159 + time * 0.3);
        
        // Swirling colors
        float angle = atan(uv.y - 0.5, uv.x - 0.5);
        float radius = length(uv - 0.5);
        float swirl = sin(angle * 5.0 + time + radius * 10.0);
        
        // Mix colors
        vec3 color = mix(color1, color2, gradient * 0.5 + 0.5);
        color = mix(color, color3, swirl * 0.3 + 0.3);
        
        // Add some noise for texture
        float noise = random(uv * 10.0 + time * 0.1) * 0.1;
        color += noise;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * Update all advanced animations
 */
export function updateAdvancedAnimations(objects, deltaTime, elapsedTime) {
  objects.forEach((obj) => {
    if (!obj) return;

    // Update kinetic sculptures
    if (obj.name === "KineticSculpture") {
      updateKineticSculpture(obj, elapsedTime);
    }

    // Update holograms
    if (obj.name === "Hologram") {
      updateHologram(obj, elapsedTime);
    }

    // Update clocks
    if (obj.name === "Clock") {
      updateClock(obj);
    }

    // Update animated paintings
    if (obj.name === "AnimatedPainting") {
      updateAnimatedPainting(obj, elapsedTime);
    }
  });
}

/**
 * Update kinetic sculpture animation
 */
function updateKineticSculpture(sculpture, elapsedTime) {
  const rings = sculpture.userData.rings;
  const sphere = sculpture.userData.sphere;

  rings.forEach((ring, index) => {
    const speed = ring.userData.rotationSpeed;
    const axis = ring.userData.axis;
    const phase = ring.userData.phase;

    if (axis === "x") {
      ring.rotation.x += speed * 0.01;
      ring.rotation.y = Math.sin(elapsedTime * speed + phase) * 0.5;
    } else {
      ring.rotation.y += speed * 0.01;
      ring.rotation.x = Math.sin(elapsedTime * speed + phase) * 0.5;
    }
  });

  // Sphere bobbing and spinning
  sphere.position.y = 0.5 + Math.sin(elapsedTime * 2) * 0.1;
  sphere.rotation.y += 0.02;
  sphere.rotation.x += 0.01;
}

/**
 * Update hologram animation
 */
function updateHologram(hologram, elapsedTime) {
  const material = hologram.userData.holoMaterial;
  const particles = hologram.userData.particles;

  // Update shader time
  if (material && material.uniforms) {
    material.uniforms.time.value = elapsedTime;
  }

  // Rotate hologram plane
  if (hologram.children[1]) {
    hologram.children[1].rotation.y = elapsedTime * 0.5;
  }

  // Rotate particles
  if (particles) {
    particles.rotation.y = elapsedTime * 0.3;
  }
}

/**
 * Update clock to show real time
 */
function updateClock(clock) {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourHand = clock.userData.hourHand;
  const minuteHand = clock.userData.minuteHand;
  const secondHand = clock.userData.secondHand;

  // Calculate angles (clockwise from 12 o'clock)
  const secondAngle = (seconds / 60) * Math.PI * 2;
  const minuteAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2;
  const hourAngle = ((hours + minutes / 60) / 12) * Math.PI * 2;

  secondHand.rotation.z = -secondAngle;
  minuteHand.rotation.z = -minuteAngle;
  hourHand.rotation.z = -hourAngle;
}

/**
 * Update animated painting
 */
function updateAnimatedPainting(painting, elapsedTime) {
  const material = painting.userData.canvasMaterial;

  if (material && material.uniforms) {
    material.uniforms.time.value = elapsedTime;
  }
}
