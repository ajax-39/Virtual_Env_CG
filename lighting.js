/**
 * Lighting system - Ambient, Directional, Spotlights, Point lights
 */

import * as THREE from "three";

/**
 * Setup all lighting for the gallery
 */
export function setupLighting(scene, roomWidth, roomDepth, roomHeight) {
  const lightingGroup = new THREE.Group();
  lightingGroup.name = "Lighting";

  // 1. Ambient Light - Base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  ambientLight.name = "AmbientLight";
  lightingGroup.add(ambientLight);

  // 2. Directional Light - Simulates sunlight/skylight
  const directionalLight = new THREE.DirectionalLight(0xfffaf0, 0.6);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;

  // Shadow configuration
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -15;
  directionalLight.shadow.camera.right = 15;
  directionalLight.shadow.camera.top = 15;
  directionalLight.shadow.camera.bottom = -15;
  directionalLight.name = "DirectionalLight";

  lightingGroup.add(directionalLight);

  // 3. Spotlights - Artwork highlighting (5 spotlights)
  const spotlights = [];
  const spotlightPositions = [
    { x: -7, z: -5 }, // Left back
    { x: 7, z: -5 }, // Right back
    { x: -7, z: 5 }, // Left front
    { x: 7, z: 5 }, // Right front
    { x: 0, z: 0 }, // Center
  ];

  spotlightPositions.forEach((pos, index) => {
    const spotlight = new THREE.SpotLight(0xffffff, 1.0);
    spotlight.position.set(pos.x, roomHeight - 0.3, pos.z);
    spotlight.angle = Math.PI / 6; // 30 degrees
    spotlight.penumbra = 0.3;
    spotlight.decay = 2;
    spotlight.distance = 10;
    spotlight.castShadow = true;

    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 0.5;
    spotlight.shadow.camera.far = 10;

    spotlight.target.position.set(pos.x, 1.5, pos.z);
    spotlight.name = `Spotlight_${index}`;

    lightingGroup.add(spotlight);
    lightingGroup.add(spotlight.target);
    spotlights.push(spotlight);

    // Add visual helper (optional, for debugging)
    // const spotlightHelper = new THREE.SpotLightHelper(spotlight);
    // lightingGroup.add(spotlightHelper);
  });

  // 4. Point Lights - Corner/atmospheric lighting (3 point lights)
  const pointLightPositions = [
    { x: -roomWidth / 2 + 1, y: roomHeight - 0.5, z: -roomDepth / 2 + 1 }, // Back left corner
    { x: roomWidth / 2 - 1, y: roomHeight - 0.5, z: -roomDepth / 2 + 1 }, // Back right corner
    { x: 0, y: roomHeight - 0.5, z: roomDepth / 2 - 1 }, // Front center
  ];

  const pointLights = [];
  pointLightPositions.forEach((pos, index) => {
    const pointLight = new THREE.PointLight(0xfff4e6, 0.5, 10, 2);
    pointLight.position.set(pos.x, pos.y, pos.z);
    pointLight.castShadow = false; // Disable for performance
    pointLight.name = `PointLight_${index}`;

    lightingGroup.add(pointLight);
    pointLights.push(pointLight);

    // Add small sphere to visualize light source
    const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff4e6,
      transparent: true,
      opacity: 0.8,
    });
    const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    lightSphere.position.copy(pointLight.position);
    lightingGroup.add(lightSphere);
  });

  scene.add(lightingGroup);

  return {
    lightingGroup,
    ambientLight,
    directionalLight,
    spotlights,
    pointLights,
  };
}

/**
 * Animate spotlight to follow a target
 */
export function updateSpotlightTarget(
  spotlight,
  targetPosition,
  smoothing = 0.1
) {
  spotlight.target.position.lerp(targetPosition, smoothing);
}

/**
 * Day/Night cycle animation (optional advanced feature)
 */
export class DayNightCycle {
  constructor(directionalLight, ambientLight) {
    this.directionalLight = directionalLight;
    this.ambientLight = ambientLight;
    this.time = 0;
    this.cycleDuration = 60; // seconds
    this.enabled = false;
  }

  update(deltaTime) {
    if (!this.enabled) return;

    this.time += deltaTime;
    const cycleProgress = (this.time % this.cycleDuration) / this.cycleDuration;

    // Day: 0-0.4, Sunset: 0.4-0.6, Night: 0.6-1.0
    let intensity, color;

    if (cycleProgress < 0.4) {
      // Day
      intensity = 0.6;
      color = new THREE.Color(0xfffaf0);
    } else if (cycleProgress < 0.6) {
      // Sunset
      const sunsetProgress = (cycleProgress - 0.4) / 0.2;
      intensity = 0.6 - sunsetProgress * 0.4;
      color = new THREE.Color().lerpColors(
        new THREE.Color(0xfffaf0),
        new THREE.Color(0xff6b35),
        sunsetProgress
      );
    } else {
      // Night
      intensity = 0.2;
      color = new THREE.Color(0x4a4a8a);
    }

    this.directionalLight.intensity = intensity;
    this.directionalLight.color = color;
    this.ambientLight.intensity = intensity * 0.5;
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}
