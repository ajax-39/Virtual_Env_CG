/**
 * Actors - Animated characters, security camera, sculpture, particles
 */

import * as THREE from "three";
import { createSimpleHumanoid, getPathPoint, randomPosition } from "./utils.js";

/**
 * Create all visual actors in the gallery
 */
export function createActors(scene, roomWidth, roomDepth, roomHeight) {
  const actorsGroup = new THREE.Group();
  actorsGroup.name = "Actors";

  // Standing visitor
  const standingVisitor = createStandingVisitor(-5, 3);
  actorsGroup.add(standingVisitor);

  // Walking visitor
  const walkingVisitor = createWalkingVisitor(roomWidth, roomDepth);
  actorsGroup.add(walkingVisitor);

  // Security camera
  const securityCamera = createSecurityCamera(roomWidth, roomDepth, roomHeight);
  actorsGroup.add(securityCamera);

  // Animated sculpture
  const animatedSculpture = createAnimatedSculpture();
  actorsGroup.add(animatedSculpture);

  scene.add(actorsGroup);

  return {
    actorsGroup,
    standingVisitor,
    walkingVisitor,
    securityCamera,
    animatedSculpture,
  };
}

/**
 * Create floating dust particles
 */
export function createParticles(scene, roomWidth, roomDepth, roomHeight) {
  const particleCount = 800;
  const particles = new THREE.Group();
  particles.name = "Particles";

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * roomWidth;
    positions[i * 3 + 1] = Math.random() * roomHeight;
    positions[i * 3 + 2] = (Math.random() - 0.5) * roomDepth;

    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: Math.random() * 0.01 + 0.005,
      z: (Math.random() - 0.5) * 0.02,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleSystem = new THREE.Points(geometry, material);
  particleSystem.userData = {
    velocities,
    roomWidth,
    roomDepth,
    roomHeight,
  };

  particles.add(particleSystem);
  scene.add(particles);

  return particleSystem;
}

/**
 * Create standing visitor character
 */
function createStandingVisitor(x, z) {
  const visitor = createSimpleHumanoid(0x3498db);
  visitor.position.set(x, 0, z);
  visitor.rotation.y = Math.PI / 4;
  visitor.name = "StandingVisitor";

  // Animation data
  visitor.userData = {
    type: "standing",
    idleTime: 0,
    swayAmount: 0.05,
  };

  return visitor;
}

/**
 * Create walking visitor character with path
 */
function createWalkingVisitor(roomWidth, roomDepth) {
  const visitor = createSimpleHumanoid(0xe74c3c);
  visitor.name = "WalkingVisitor";

  // Define walking path (waypoints)
  const path = [
    { x: -roomWidth / 2 + 2, y: 0, z: -roomDepth / 2 + 2 }, // Start near entrance
    { x: -5, y: 0, z: -3 }, // To back left painting
    { x: -5, y: 0, z: 0 }, // Pause at pedestal
    { x: 0, y: 0, z: 0 }, // Center
    { x: 5, y: 0, z: 0 }, // Right pedestal
    { x: 5, y: 0, z: -3 }, // To back right painting
    { x: 0, y: 0, z: roomDepth / 2 - 3 }, // Front center
    { x: -roomWidth / 2 + 2, y: 0, z: -roomDepth / 2 + 2 }, // Back to start
  ];

  visitor.userData = {
    type: "walking",
    path: path,
    pathProgress: 0,
    speed: 0.02,
    pausePoints: [0.14, 0.43, 0.71], // Normalized path positions to pause at
    pauseTime: 0,
    pauseDuration: 3,
    isPaused: false,
    walkCycle: 0,
  };

  return visitor;
}

/**
 * Create security camera
 */
function createSecurityCamera(roomWidth, roomDepth, roomHeight) {
  const group = new THREE.Group();

  // Camera body
  const bodyGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.1);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    roughness: 0.3,
    metalness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  group.add(body);

  // Camera lens
  const lensGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16);
  const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1,
    metalness: 0.9,
  });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.rotation.z = Math.PI / 2;
  lens.position.x = 0.11;
  group.add(lens);

  // Indicator light
  const lightGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const indicatorLight = new THREE.Mesh(lightGeometry, lightMaterial);
  indicatorLight.position.set(-0.06, 0.06, 0);
  group.add(indicatorLight);

  // Point light for indicator
  const pointLight = new THREE.PointLight(0xff0000, 0.5, 2);
  pointLight.position.set(-0.06, 0.06, 0);
  group.add(pointLight);

  // Position in corner
  group.position.set(
    -roomWidth / 2 + 0.5,
    roomHeight - 0.3,
    -roomDepth / 2 + 0.5
  );
  group.rotation.y = -Math.PI / 4;
  group.name = "SecurityCamera";

  // Animation data
  group.userData = {
    sweepAngle: Math.PI / 3,
    sweepSpeed: 0.5,
    sweepTime: 0,
    centerRotation: -Math.PI / 4,
  };

  return group;
}

/**
 * Create animated sculpture (abstract geometric)
 */
function createAnimatedSculpture() {
  const group = new THREE.Group();

  // Outer ring
  const outerRingGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
  const outerRingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf39c12,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0xf39c12,
    emissiveIntensity: 0.2,
  });
  const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
  outerRing.castShadow = true;
  group.add(outerRing);

  // Middle ring
  const middleRingGeometry = new THREE.TorusGeometry(0.3, 0.04, 16, 32);
  const middleRingMaterial = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0xe74c3c,
    emissiveIntensity: 0.2,
  });
  const middleRing = new THREE.Mesh(middleRingGeometry, middleRingMaterial);
  middleRing.rotation.x = Math.PI / 2;
  middleRing.castShadow = true;
  group.add(middleRing);

  // Inner sphere
  const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x3498db,
    emissiveIntensity: 0.3,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  group.add(sphere);

  // Position on center pedestal
  group.position.set(0, 1.5, -2);
  group.name = "AnimatedSculpture";

  // Animation data
  group.userData = {
    outerRing,
    middleRing,
    sphere,
    rotationSpeed: 0.5,
  };

  return group;
}

/**
 * Update all actor animations
 */
export function updateActors(actors, deltaTime) {
  // Update standing visitor (subtle sway)
  if (actors.standingVisitor) {
    const visitor = actors.standingVisitor;
    visitor.userData.idleTime += deltaTime;
    const sway =
      Math.sin(visitor.userData.idleTime) * visitor.userData.swayAmount;
    visitor.rotation.z = sway;

    // Slight head rotation
    visitor.children[1].rotation.y =
      Math.sin(visitor.userData.idleTime * 0.5) * 0.2;
  }

  // Update walking visitor
  if (actors.walkingVisitor) {
    updateWalkingVisitor(actors.walkingVisitor, deltaTime);
  }

  // Update security camera
  if (actors.securityCamera) {
    updateSecurityCamera(actors.securityCamera, deltaTime);
  }

  // Update animated sculpture
  if (actors.animatedSculpture) {
    updateAnimatedSculpture(actors.animatedSculpture, deltaTime);
  }
}

/**
 * Update walking visitor animation
 */
function updateWalkingVisitor(visitor, deltaTime) {
  const data = visitor.userData;

  if (data.isPaused) {
    data.pauseTime += deltaTime;
    if (data.pauseTime >= data.pauseDuration) {
      data.isPaused = false;
      data.pauseTime = 0;
    }
    // Slight rotation while paused
    visitor.children[1].rotation.y = Math.sin(data.pauseTime * 2) * 0.3;
    return;
  }

  // Move along path
  data.pathProgress += data.speed * deltaTime;

  // Check for pause points
  for (const pausePoint of data.pausePoints) {
    if (
      Math.abs(data.pathProgress - pausePoint) < 0.01 &&
      data.pauseTime === 0
    ) {
      data.isPaused = true;
      return;
    }
  }

  // Loop path
  if (data.pathProgress >= 1) {
    data.pathProgress = 0;
  }

  // Get current and next position
  const currentPos = getPathPoint(data.path, data.pathProgress);
  const nextPos = getPathPoint(
    data.path,
    Math.min(data.pathProgress + 0.01, 1)
  );

  // Update position
  visitor.position.set(currentPos.x, currentPos.y, currentPos.z);

  // Update rotation to face movement direction
  const direction = new THREE.Vector3(
    nextPos.x - currentPos.x,
    0,
    nextPos.z - currentPos.z
  ).normalize();
  const angle = Math.atan2(direction.x, direction.z);
  visitor.rotation.y = angle;

  // Walking animation (leg swing)
  data.walkCycle += deltaTime * 5;
  const legSwing = Math.sin(data.walkCycle) * 0.3;
  if (visitor.children[4]) visitor.children[4].rotation.x = legSwing; // Left leg
  if (visitor.children[5]) visitor.children[5].rotation.x = -legSwing; // Right leg
  if (visitor.children[2]) visitor.children[2].rotation.x = -legSwing * 0.5; // Left arm
  if (visitor.children[3]) visitor.children[3].rotation.x = legSwing * 0.5; // Right arm
}

/**
 * Update security camera sweep animation
 */
function updateSecurityCamera(camera, deltaTime) {
  const data = camera.userData;
  data.sweepTime += deltaTime * data.sweepSpeed;

  const sweep = Math.sin(data.sweepTime) * data.sweepAngle * 0.5;
  camera.rotation.y = data.centerRotation + sweep;
}

/**
 * Update animated sculpture rotation
 */
function updateAnimatedSculpture(sculpture, deltaTime) {
  const data = sculpture.userData;

  data.outerRing.rotation.z += deltaTime * data.rotationSpeed;
  data.middleRing.rotation.y += deltaTime * data.rotationSpeed * 1.5;
  data.sphere.rotation.y += deltaTime * data.rotationSpeed * 2;

  // Pulsing glow effect
  const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.3;
  data.outerRing.material.emissiveIntensity = pulse;
  data.middleRing.material.emissiveIntensity = pulse;
  data.sphere.material.emissiveIntensity = pulse + 0.2;
}

/**
 * Update particle system
 */
export function updateParticles(particleSystem, deltaTime) {
  if (!particleSystem) return;

  const positions = particleSystem.geometry.attributes.position.array;
  const velocities = particleSystem.userData.velocities;
  const { roomWidth, roomDepth, roomHeight } = particleSystem.userData;

  for (let i = 0; i < positions.length / 3; i++) {
    const idx = i * 3;

    // Update position
    positions[idx] += velocities[i].x;
    positions[idx + 1] += velocities[i].y;
    positions[idx + 2] += velocities[i].z;

    // Wrap around room boundaries
    if (positions[idx] > roomWidth / 2) positions[idx] = -roomWidth / 2;
    if (positions[idx] < -roomWidth / 2) positions[idx] = roomWidth / 2;
    if (positions[idx + 2] > roomDepth / 2) positions[idx + 2] = -roomDepth / 2;
    if (positions[idx + 2] < -roomDepth / 2) positions[idx + 2] = roomDepth / 2;

    // Reset at ceiling
    if (positions[idx + 1] > roomHeight) {
      positions[idx + 1] = 0;
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
}
