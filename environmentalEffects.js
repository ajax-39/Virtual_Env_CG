/**
 * Environmental Effects - Rain, Snow, Volumetric Lighting, Water Fountain, Fire
 */

import * as THREE from "three";

/**
 * Create rain particles outside windows
 */
export function createRain(scene, roomWidth, roomDepth, roomHeight) {
  const rainGroup = new THREE.Group();
  rainGroup.name = "Rain";

  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    // Position rain outside the room
    positions[i * 3] = (Math.random() - 0.5) * roomWidth * 2;
    positions[i * 3 + 1] = Math.random() * roomHeight * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * roomDepth * 2;

    velocities.push({
      x: -0.01,
      y: -0.15 - Math.random() * 0.1,
      z: -0.02,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  const rain = new THREE.Points(geometry, material);
  rain.userData = { velocities, roomHeight, enabled: false };
  rainGroup.add(rain);

  return rainGroup;
}

/**
 * Create snow particles
 */
export function createSnow(scene, roomWidth, roomDepth, roomHeight) {
  const snowGroup = new THREE.Group();
  snowGroup.name = "Snow";

  const particleCount = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * roomWidth * 2;
    positions[i * 3 + 1] = Math.random() * roomHeight * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * roomDepth * 2;

    velocities.push({
      x: Math.sin(i) * 0.01,
      y: -0.03 - Math.random() * 0.02,
      z: Math.cos(i) * 0.01,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.8,
    map: createSnowflakeTexture(),
    blending: THREE.AdditiveBlending,
  });

  const snow = new THREE.Points(geometry, material);
  snow.userData = { velocities, roomHeight, enabled: false };
  snowGroup.add(snow);

  return snowGroup;
}

/**
 * Create volumetric lighting (god rays)
 */
export function createVolumetricLighting(scene, roomWidth, roomHeight) {
  const volumetricGroup = new THREE.Group();
  volumetricGroup.name = "VolumetricLighting";

  // Create light shafts using cone geometry with transparent material
  const positions = [
    { x: -roomWidth / 3, z: -5 },
    { x: roomWidth / 3, z: -5 },
    { x: 0, z: 0 },
  ];

  positions.forEach((pos, index) => {
    const geometry = new THREE.ConeGeometry(0.5, roomHeight - 0.5, 8, 1, true);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffdd,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lightShaft = new THREE.Mesh(geometry, material);
    lightShaft.position.set(pos.x, roomHeight - 0.25, pos.z);
    lightShaft.rotation.x = Math.PI;
    lightShaft.name = `GodRay_${index}`;

    // Add dust particles in the light shaft
    const dustParticles = createDustInLight(pos.x, pos.z, roomHeight);
    lightShaft.add(dustParticles);

    volumetricGroup.add(lightShaft);
  });

  return volumetricGroup;
}

/**
 * Create dust particles visible in volumetric light
 */
function createDustInLight(x, z, height) {
  const particleCount = 150;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1.0;
    positions[i * 3 + 1] = -Math.random() * height * 0.8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffee,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Create water fountain with shader
 */
export function createWaterFountain(scene) {
  const fountainGroup = new THREE.Group();
  fountainGroup.name = "WaterFountain";

  // Fountain base
  const baseGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.3,
    metalness: 0.7,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.15;
  base.castShadow = true;
  base.receiveShadow = true;
  fountainGroup.add(base);

  // Water pool
  const poolGeometry = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32);
  const waterMaterial = createWaterMaterial();
  const pool = new THREE.Mesh(poolGeometry, waterMaterial);
  pool.position.y = 0.35;
  fountainGroup.add(pool);

  // Water particles (fountain spray)
  const waterParticles = createFountainParticles();
  waterParticles.position.y = 0.5;
  fountainGroup.add(waterParticles);

  // Central pillar
  const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
  const pillar = new THREE.Mesh(pillarGeometry, baseMaterial);
  pillar.position.y = 0.75;
  pillar.castShadow = true;
  fountainGroup.add(pillar);

  fountainGroup.position.set(0, 0, -3);
  return fountainGroup;
}

/**
 * Create animated water material with shader
 */
function createWaterMaterial() {
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x1e90ff) },
      color2: { value: new THREE.Color(0x4682b4) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vec2 uv = vUv * 3.0;
        float wave = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time) * 0.5 + 0.5;
        vec3 color = mix(color1, color2, wave);
        gl_FragColor = vec4(color, 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  return waterMaterial;
}

/**
 * Create fountain water particles
 */
function createFountainParticles() {
  const particleCount = 300;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = Math.random() * 0.3;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 1.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    velocities.push({
      x: Math.cos(angle) * 0.02,
      y: 0.08 - Math.random() * 0.02,
      z: Math.sin(angle) * 0.02,
      gravity: -0.003,
      life: Math.random() * 100,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4fc3f7,
    size: 0.08,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  particles.userData = { velocities };
  return particles;
}

/**
 * Create fire/torch effects
 */
export function createTorch(x, y, z) {
  const torchGroup = new THREE.Group();
  torchGroup.name = "Torch";

  // Torch holder
  const holderGeometry = new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8);
  const holderMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.8,
    metalness: 0.5,
  });
  const holder = new THREE.Mesh(holderGeometry, holderMaterial);
  holder.castShadow = true;
  torchGroup.add(holder);

  // Fire particles
  const fireParticles = createFireParticles();
  fireParticles.position.y = 0.8;
  torchGroup.add(fireParticles);

  // Point light for fire glow
  const fireLight = new THREE.PointLight(0xff6600, 2, 5);
  fireLight.position.y = 0.8;
  fireLight.castShadow = true;
  torchGroup.add(fireLight);

  // Store light reference for animation
  torchGroup.userData.fireLight = fireLight;

  torchGroup.position.set(x, y, z);
  return torchGroup;
}

/**
 * Create fire particle system
 */
function createFireParticles() {
  const particleCount = 100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.15;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 0.3;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    velocities.push({
      x: (Math.random() - 0.5) * 0.01,
      y: 0.02 + Math.random() * 0.02,
      z: (Math.random() - 0.5) * 0.01,
      life: Math.random() * 50,
    });

    // Fire colors (red to yellow)
    const colorFactor = Math.random();
    colors[i * 3] = 1.0; // R
    colors[i * 3 + 1] = colorFactor * 0.5; // G
    colors[i * 3 + 2] = 0.0; // B
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    depthWrite: false,
  });

  const fire = new THREE.Points(geometry, material);
  fire.userData = { velocities };
  return fire;
}

/**
 * Update environmental effects
 */
export function updateEnvironmentalEffects(effects, deltaTime, elapsedTime) {
  // Update rain
  if (effects.rain && effects.rain.userData.enabled) {
    updateWeatherParticles(
      effects.rain.children[0],
      deltaTime,
      effects.rain.userData.roomHeight
    );
  }

  // Update water fountain
  if (effects.fountain) {
    const waterPool = effects.fountain.children.find(
      (child) => child.material && child.material.uniforms
    );
    if (waterPool && waterPool.material.uniforms) {
      waterPool.material.uniforms.time.value = elapsedTime;
    }

    // Update fountain particles
    const particles = effects.fountain.children.find(
      (child) => child.type === "Points" && child.userData.velocities
    );
    if (particles) {
      updateFountainParticles(particles, deltaTime);
    }
  }

  // Update torches
  if (effects.torches) {
    effects.torches.forEach((torch) => {
      updateTorch(torch, elapsedTime);
    });
  }

  // Animate volumetric lighting
  if (effects.volumetric) {
    effects.volumetric.children.forEach((shaft, index) => {
      shaft.material.opacity = 0.12 + Math.sin(elapsedTime + index) * 0.03;
    });
  }
}

/**
 * Update weather particles (rain/snow)
 */
function updateWeatherParticles(
  particles,
  deltaTime,
  roomHeight,
  isSnow = false
) {
  const positions = particles.geometry.attributes.position.array;
  const velocities = particles.userData.velocities;

  for (let i = 0; i < velocities.length; i++) {
    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;

    // Reset particle when it falls below ground
    if (positions[i * 3 + 1] < 0) {
      positions[i * 3 + 1] = roomHeight * 2;
      if (isSnow) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
}

/**
 * Update fountain particles
 */
function updateFountainParticles(particles, deltaTime) {
  const positions = particles.geometry.attributes.position.array;
  const velocities = particles.userData.velocities;

  for (let i = 0; i < velocities.length; i++) {
    velocities[i].y += velocities[i].gravity;

    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;

    velocities[i].life--;

    if (velocities[i].life <= 0 || positions[i * 3 + 1] < 0.5) {
      // Reset particle
      const angle = (i / velocities.length) * Math.PI * 2;
      const radius = Math.random() * 0.3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities[i].x = Math.cos(angle) * 0.02;
      velocities[i].y = 0.08 - Math.random() * 0.02;
      velocities[i].z = Math.sin(angle) * 0.02;
      velocities[i].life = 100 + Math.random() * 50;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
}

/**
 * Update torch fire
 */
function updateTorch(torch, elapsedTime) {
  const fireParticles = torch.children.find(
    (child) => child.type === "Points" && child.userData.velocities
  );

  if (fireParticles) {
    const positions = fireParticles.geometry.attributes.position.array;
    const velocities = fireParticles.userData.velocities;

    for (let i = 0; i < velocities.length; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      velocities[i].life--;

      if (velocities[i].life <= 0 || positions[i * 3 + 1] > 1.2) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.15;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        velocities[i].x = (Math.random() - 0.5) * 0.01;
        velocities[i].y = 0.02 + Math.random() * 0.02;
        velocities[i].z = (Math.random() - 0.5) * 0.01;
        velocities[i].life = 50 + Math.random() * 30;
      }
    }

    fireParticles.geometry.attributes.position.needsUpdate = true;
  }

  // Flicker torch light
  if (torch.userData.fireLight) {
    torch.userData.fireLight.intensity = 1.8 + Math.sin(elapsedTime * 10) * 0.4;
  }
}

/**
 * Create snowflake texture
 */
function createSnowflakeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
