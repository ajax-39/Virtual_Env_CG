/**
 * Advanced Effects - Mirrors, Water Fountains, Holograms, Weather
 */

import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { Water } from "three/examples/jsm/objects/Water.js";

/**
 * Create a reflective mirror on the wall
 */
export function createMirror(scene, position, width = 3, height = 4) {
  const group = new THREE.Group();

  // Mirror frame
  const frameThickness = 0.15;
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.3,
    metalness: 0.8,
  });

  // Create ornate frame with border pieces
  const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, 0.1),
    frameMaterial
  );
  topFrame.position.y = height / 2 + frameThickness / 2;

  const bottomFrame = new THREE.Mesh(
    new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, 0.1),
    frameMaterial
  );
  bottomFrame.position.y = -(height / 2 + frameThickness / 2);

  const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, height, 0.1),
    frameMaterial
  );
  leftFrame.position.x = -(width / 2 + frameThickness / 2);

  const rightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, height, 0.1),
    frameMaterial
  );
  rightFrame.position.x = width / 2 + frameThickness / 2;

  group.add(topFrame, bottomFrame, leftFrame, rightFrame);

  // Reflective surface
  const mirrorGeometry = new THREE.PlaneGeometry(width, height);
  const mirror = new Reflector(mirrorGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999,
  });

  group.add(mirror);

  // Position the mirror group
  group.position.copy(position);
  group.position.z -= 0.05; // Slightly recessed

  scene.add(group);

  return {
    mirrorGroup: group,
    mirror: mirror,
  };
}

/**
 * Create animated water fountain
 */
export function createWaterFountain(scene, position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Fountain basin
  const basinGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.5, 32);
  const basinMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b8680,
    roughness: 0.4,
    metalness: 0.3,
  });
  const basin = new THREE.Mesh(basinGeometry, basinMaterial);
  basin.castShadow = true;
  basin.receiveShadow = true;
  group.add(basin);

  // Water surface using Water shader
  const waterGeometry = new THREE.CircleGeometry(1.4, 32);
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(0.7, 0.7, 0),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.26;
  group.add(water);

  // Central fountain pillar
  const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16);
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    roughness: 0.3,
    metalness: 0.5,
  });
  const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  pillar.position.y = 0.65;
  pillar.castShadow = true;
  group.add(pillar);

  // Water spray particles
  const sprayParticles = createWaterSpray(100);
  sprayParticles.position.y = 1.05;
  group.add(sprayParticles);

  scene.add(group);

  return {
    fountainGroup: group,
    water: water,
    sprayParticles: sprayParticles,
  };
}

/**
 * Create water spray particle system
 */
function createWaterSpray(count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;
    velocities.push({
      x: Math.cos(angle) * speed * 0.02,
      y: speed * 0.04,
      z: Math.sin(angle) * speed * 0.02,
      life: Math.random(),
      maxLife: 1.0 + Math.random(),
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  particles.userData.velocities = velocities;

  return particles;
}

/**
 * Update water fountain animation
 */
export function updateWaterFountain(fountain, deltaTime) {
  if (!fountain) return;

  // Update water shader
  if (fountain.water) {
    fountain.water.material.uniforms["time"].value += deltaTime;
  }

  // Update spray particles
  if (fountain.sprayParticles) {
    const positions =
      fountain.sprayParticles.geometry.attributes.position.array;
    const velocities = fountain.sprayParticles.userData.velocities;

    for (let i = 0; i < velocities.length; i++) {
      velocities[i].life += deltaTime;

      if (velocities[i].life > velocities[i].maxLife) {
        // Reset particle
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        velocities[i].life = 0;

        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        velocities[i].x = Math.cos(angle) * speed * 0.02;
        velocities[i].y = speed * 0.04;
        velocities[i].z = Math.sin(angle) * speed * 0.02;
      } else {
        // Update particle position
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // Apply gravity
        velocities[i].y -= 0.002;
      }
    }

    fountain.sprayParticles.geometry.attributes.position.needsUpdate = true;
  }
}

/**
 * Create holographic display
 */
export function createHologram(scene, position, content = "GALLERY") {
  const group = new THREE.Group();
  group.position.copy(position);

  // Hologram pedestal
  const pedestalGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 8);
  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x0f3460,
    emissiveIntensity: 0.5,
  });
  const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal.castShadow = true;
  group.add(pedestal);

  // Holographic plane with custom shader
  const holoGeometry = new THREE.PlaneGeometry(1.5, 2);
  const holoMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x00ffff) },
      opacity: { value: 0.7 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        pos.z += sin(position.y * 5.0 + time * 2.0) * 0.05;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform float opacity;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Scan lines
        float scanline = sin(vUv.y * 100.0 + time * 3.0) * 0.1 + 0.9;
        
        // Flicker
        float flicker = sin(time * 10.0) * 0.05 + 0.95;
        
        // Vignette
        float vignette = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
        
        // Grid pattern
        float grid = step(0.95, fract(vUv.x * 20.0)) + step(0.95, fract(vUv.y * 20.0));
        
        vec3 finalColor = color * scanline * flicker * vignette + grid * 0.3;
        float finalOpacity = opacity * vignette * flicker;
        
        gl_FragColor = vec4(finalColor, finalOpacity);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const hologram = new THREE.Mesh(holoGeometry, holoMaterial);
  hologram.position.y = 1.5;
  group.add(hologram);

  // Hologram glow light
  const glowLight = new THREE.PointLight(0x00ffff, 1, 5);
  glowLight.position.y = 1.5;
  group.add(glowLight);

  // Rotating ring at base
  const ringGeometry = new THREE.TorusGeometry(0.35, 0.02, 16, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.41;
  group.add(ring);

  scene.add(group);

  return {
    hologramGroup: group,
    hologram: hologram,
    ring: ring,
    material: holoMaterial,
  };
}

/**
 * Update hologram animation
 */
export function updateHologram(hologramData, deltaTime) {
  if (!hologramData) return;

  // Update shader time
  if (hologramData.material) {
    hologramData.material.uniforms.time.value += deltaTime;
  }

  // Rotate hologram slowly
  if (hologramData.hologram) {
    hologramData.hologram.rotation.y += deltaTime * 0.3;
  }

  // Rotate base ring
  if (hologramData.ring) {
    hologramData.ring.rotation.z += deltaTime * 2;
  }
}

/**
 * Create weather effect (rain)
 */
export function createRainEffect(scene, roomWidth, roomDepth, roomHeight) {
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * roomWidth * 2;
    positions[i * 3 + 1] = Math.random() * roomHeight * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * roomDepth - roomDepth / 2 - 5;

    velocities.push({
      y: -0.3 - Math.random() * 0.2,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
  });

  const rain = new THREE.Points(geometry, material);
  rain.userData = { velocities, roomHeight };

  scene.add(rain);
  return rain;
}

/**
 * Update rain particles
 */
export function updateRain(rain, deltaTime) {
  if (!rain || !rain.userData.velocities) return;

  const positions = rain.geometry.attributes.position.array;
  const velocities = rain.userData.velocities;
  const maxHeight = rain.userData.roomHeight * 2;

  for (let i = 0; i < velocities.length; i++) {
    positions[i * 3 + 1] += velocities[i].y;

    if (positions[i * 3 + 1] < 0) {
      positions[i * 3 + 1] = maxHeight;
    }
  }

  rain.geometry.attributes.position.needsUpdate = true;
}
