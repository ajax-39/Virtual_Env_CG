/**
 * Volumetric Lighting - God Rays and Light Scattering Effects
 */

import * as THREE from "three";

/**
 * Volumetric Light Scattering Shader
 */
export const VolumetricLightShader = {
  uniforms: {
    tDiffuse: { value: null },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    exposure: { value: 0.18 },
    decay: { value: 0.95 },
    density: { value: 0.8 },
    weight: { value: 0.4 },
    samples: { value: 50 },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 lightPosition;
    uniform float exposure;
    uniform float decay;
    uniform float density;
    uniform float weight;
    uniform int samples;
    varying vec2 vUv;

    void main() {
      vec2 texCoord = vUv;
      vec2 deltaTextCoord = texCoord - lightPosition;
      deltaTextCoord *= 1.0 / float(samples) * density;
      
      vec4 color = texture2D(tDiffuse, texCoord);
      float illuminationDecay = 1.0;
      
      for(int i = 0; i < 100; i++) {
        if(i >= samples) break;
        
        texCoord -= deltaTextCoord;
        vec4 sample = texture2D(tDiffuse, texCoord);
        
        sample *= illuminationDecay * weight;
        color += sample;
        illuminationDecay *= decay;
      }
      
      gl_FragColor = color * exposure;
    }
  `,
};

/**
 * Create volumetric light beams (god rays)
 */
export function createVolumetricLightBeam(
  scene,
  position,
  targetPosition,
  color = 0xffffff,
  intensity = 1.0
) {
  const group = new THREE.Group();

  // Create spotlight for the beam
  const spotlight = new THREE.SpotLight(color, intensity);
  spotlight.position.copy(position);
  spotlight.target.position.copy(targetPosition);
  spotlight.angle = Math.PI / 8;
  spotlight.penumbra = 0.5;
  spotlight.decay = 2;
  spotlight.distance = 20;
  spotlight.castShadow = true;

  group.add(spotlight);
  group.add(spotlight.target);

  // Create volumetric cone geometry for visible light beam
  const coneHeight = position.distanceTo(targetPosition);
  const coneRadius = Math.tan(spotlight.angle) * coneHeight;

  const geometry = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const cone = new THREE.Mesh(geometry, material);
  cone.position.copy(position);
  cone.lookAt(targetPosition);
  cone.rotateX(Math.PI / 2);
  cone.position.y -= coneHeight / 2;

  group.add(cone);
  group.userData.cone = cone;
  group.userData.spotlight = spotlight;

  scene.add(group);
  return group;
}

/**
 * Create window with god rays coming through
 */
export function createWindowWithGodRays(scene, position, roomHeight) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Window frame
  const frameGeometry = new THREE.BoxGeometry(3, 2.5, 0.1);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.6,
    metalness: 0.2,
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.castShadow = true;
  frame.receiveShadow = true;
  group.add(frame);

  // Window glass panes (4 panes)
  const paneGeometry = new THREE.PlaneGeometry(1.3, 1.1);
  const paneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.5,
  });

  const panePositions = [
    { x: -0.7, y: 0.6 },
    { x: 0.7, y: 0.6 },
    { x: -0.7, y: -0.6 },
    { x: 0.7, y: -0.6 },
  ];

  panePositions.forEach((pos) => {
    const pane = new THREE.Mesh(paneGeometry, paneMaterial);
    pane.position.set(pos.x, pos.y, 0.05);
    group.add(pane);
  });

  // God rays coming through window
  const rayCount = 3;
  const rays = [];

  for (let i = 0; i < rayCount; i++) {
    const offsetX = (i - 1) * 0.8;
    const rayPosition = new THREE.Vector3(
      position.x + offsetX,
      position.y + 0.5,
      position.z - 0.1
    );
    const targetPosition = new THREE.Vector3(
      position.x + offsetX - 1,
      0.1,
      position.z + 5
    );

    const ray = createVolumetricLightBeam(
      scene,
      rayPosition,
      targetPosition,
      0xfff4e0,
      2.0
    );
    rays.push(ray);
  }

  scene.add(group);

  return {
    windowGroup: group,
    rays: rays,
  };
}

/**
 * Animate volumetric light beams
 */
export function animateVolumetricLights(rays, time) {
  rays.forEach((ray, index) => {
    const cone = ray.userData.cone;
    if (cone) {
      // Subtle pulsing effect
      const pulse = Math.sin(time * 0.5 + index) * 0.05 + 0.1;
      cone.material.opacity = pulse;
    }
  });
}

/**
 * Create dust particles in light beams
 */
export function createDustInLightBeam(scene, beamPosition, beamTarget, count = 200) {
  const particles = new THREE.Group();
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  // Create particles along the beam path
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const pos = new THREE.Vector3().lerpVectors(beamPosition, beamTarget, t);
    
    // Add random offset within beam cone
    const radius = t * 0.5;
    pos.x += (Math.random() - 0.5) * radius;
    pos.z += (Math.random() - 0.5) * radius;

    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;

    velocities.push({
      x: (Math.random() - 0.5) * 0.01,
      y: -Math.random() * 0.02 - 0.01,
      z: (Math.random() - 0.5) * 0.01,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: createParticleTexture(),
  });

  const particleSystem = new THREE.Points(geometry, material);
  particleSystem.userData = {
    velocities,
    beamPosition,
    beamTarget,
  };

  particles.add(particleSystem);
  scene.add(particles);

  return particleSystem;
}

/**
 * Create texture for particles
 */
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Update dust particles in light beam
 */
export function updateDustParticles(particleSystem, deltaTime) {
  if (!particleSystem || !particleSystem.userData.velocities) return;

  const positions = particleSystem.geometry.attributes.position.array;
  const velocities = particleSystem.userData.velocities;
  const beamPosition = particleSystem.userData.beamPosition;
  const beamTarget = particleSystem.userData.beamTarget;

  for (let i = 0; i < velocities.length; i++) {
    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;

    // Reset particles that fall below ground
    if (positions[i * 3 + 1] < 0) {
      const t = Math.random();
      const pos = new THREE.Vector3().lerpVectors(beamPosition, beamTarget, t);
      const radius = t * 0.5;
      
      positions[i * 3] = pos.x + (Math.random() - 0.5) * radius;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * radius;
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
}
