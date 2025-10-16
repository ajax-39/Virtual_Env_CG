/**
 * Artworks - Paintings, pedestals, display cases
 */

import * as THREE from "three";
import {
  createPaintingTexture,
  createFrame,
  createMarbleTexture,
} from "./utils.js";

/**
 * Create all artworks in the gallery
 */
export function createArtworks(scene, roomWidth, roomDepth) {
  const artworkGroup = new THREE.Group();
  artworkGroup.name = "Artworks";

  const artworks = [];

  // Painting configurations
  const paintingConfigs = [
    // Back wall paintings
    {
      width: 1.5,
      height: 2,
      x: -7,
      z: -roomDepth / 2 + 0.15,
      wallNormal: new THREE.Vector3(0, 0, 1),
      title: "Abstract Dreams",
      artist: "Digital Artist",
      description: "A vibrant exploration of color and form.",
      seed: 1,
    },
    {
      width: 1,
      height: 1,
      x: 0,
      z: -roomDepth / 2 + 0.15,
      wallNormal: new THREE.Vector3(0, 0, 1),
      title: "Geometry in Motion",
      artist: "Virtual Gallery",
      description: "The intersection of mathematics and art.",
      seed: 2,
    },
    {
      width: 2,
      height: 3,
      x: 7,
      z: -roomDepth / 2 + 0.15,
      wallNormal: new THREE.Vector3(0, 0, 1),
      title: "Digital Symphony",
      artist: "Code Painter",
      description: "When algorithms create beauty.",
      seed: 3,
    },

    // Left wall paintings
    {
      width: 1.5,
      height: 2,
      x: -roomWidth / 2 + 0.15,
      z: -3,
      wallNormal: new THREE.Vector3(1, 0, 0),
      title: "Chromatic Whispers",
      artist: "Pixel Master",
      description: "A study in contrasts and harmony.",
      seed: 4,
    },
    {
      width: 1,
      height: 1.5,
      x: -roomWidth / 2 + 0.15,
      z: 3,
      wallNormal: new THREE.Vector3(1, 0, 0),
      title: "Recursive Beauty",
      artist: "Fractal Designer",
      description: "Patterns within patterns.",
      seed: 5,
    },

    // Right wall paintings
    {
      width: 2,
      height: 1.5,
      x: roomWidth / 2 - 0.15,
      z: -3,
      wallNormal: new THREE.Vector3(-1, 0, 0),
      title: "Electric Horizons",
      artist: "Light Sculptor",
      description: "Where technology meets nature.",
      seed: 6,
    },
    {
      width: 1.5,
      height: 2,
      x: roomWidth / 2 - 0.15,
      z: 3,
      wallNormal: new THREE.Vector3(-1, 0, 0),
      title: "Quantum Reflections",
      artist: "Virtual Gallery",
      description: "Reality through a digital lens.",
      seed: 7,
    },
  ];

  paintingConfigs.forEach((config, index) => {
    const painting = createPainting(config);
    painting.userData = {
      isArtwork: true,
      artworkId: index,
      title: config.title,
      artist: config.artist,
      description: config.description,
    };
    artworkGroup.add(painting);
    artworks.push(painting);
  });

  // Create pedestals
  const pedestals = createPedestals(roomWidth, roomDepth);
  pedestals.forEach((pedestal) => artworkGroup.add(pedestal));

  // Create display case (optional)
  const displayCase = createDisplayCase(0, 0, 4);
  artworkGroup.add(displayCase);

  scene.add(artworkGroup);

  return { artworkGroup, artworks, pedestals };
}

/**
 * Create a single painting with frame
 */
function createPainting(config) {
  const group = new THREE.Group();

  // Create canvas with procedural texture
  const canvasGeometry = new THREE.PlaneGeometry(config.width, config.height);
  const canvasTexture = createPaintingTexture(config.seed);
  const canvasMaterial = new THREE.MeshStandardMaterial({
    map: canvasTexture,
    roughness: 0.8,
    metalness: 0.0,
  });

  const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
  canvas.castShadow = true;
  canvas.receiveShadow = true;
  group.add(canvas);

  // Create frame
  const frame = createFrame(config.width, config.height, 0.1);
  frame.position.z = -0.05;
  group.add(frame);

  // Create information hotspot (small glowing sphere)
  const hotspotGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const hotspotMaterial = new THREE.MeshBasicMaterial({
    color: 0x4caf50,
    transparent: true,
    opacity: 0.7,
  });
  const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
  hotspot.position.set(config.width / 2 - 0.2, -config.height / 2 + 0.2, 0.1);
  hotspot.userData = { isHotspot: true };
  group.add(hotspot);

  // Add pulsing animation data to hotspot
  hotspot.userData.pulsePhase = Math.random() * Math.PI * 2;

  // Position painting on wall
  group.position.set(config.x, 1.5, config.z);

  // Rotate based on wall
  if (config.wallNormal.x !== 0) {
    group.rotation.y = config.wallNormal.x > 0 ? Math.PI / 2 : -Math.PI / 2;
  }

  return group;
}

/**
 * Create pedestals for sculptures
 */
function createPedestals(roomWidth, roomDepth) {
  const pedestals = [];

  const pedestalPositions = [
    { x: -4, z: 0 }, // Left center
    { x: 4, z: 0 }, // Right center
    { x: 0, z: -2 }, // Center back
  ];

  pedestalPositions.forEach((pos, index) => {
    const pedestal = createPedestal();
    pedestal.position.set(pos.x, 0, pos.z);
    pedestal.name = `Pedestal_${index}`;
    pedestals.push(pedestal);
  });

  return pedestals;
}

/**
 * Create a single pedestal
 */
function createPedestal() {
  const group = new THREE.Group();

  // Pedestal base
  const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.2, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b8b8b,
    roughness: 0.3,
    metalness: 0.5,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.1;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Pedestal column
  const columnGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
  const marbleTexture = createMarbleTexture();
  const columnMaterial = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    roughness: 0.2,
    metalness: 0.1,
  });
  const column = new THREE.Mesh(columnGeometry, columnMaterial);
  column.position.y = 0.5;
  column.castShadow = true;
  column.receiveShadow = true;
  group.add(column);

  // Pedestal top
  const topGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.2, 16);
  const top = new THREE.Mesh(topGeometry, baseMaterial);
  top.position.y = 0.9;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  return group;
}

/**
 * Create a glass display case
 */
function createDisplayCase(x, y, z) {
  const group = new THREE.Group();

  const width = 1.5;
  const height = 1.5;
  const depth = 1.5;

  // Glass walls
  const glassGeometry = new THREE.BoxGeometry(width, height, depth);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    transmission: 0.9,
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const glassBox = new THREE.Mesh(glassGeometry, glassMaterial);
  glassBox.position.y = height / 2 + 0.5;
  glassBox.castShadow = true;
  glassBox.receiveShadow = true;
  group.add(glassBox);

  // Base platform
  const baseGeometry = new THREE.BoxGeometry(width + 0.2, 0.1, depth + 0.2);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    roughness: 0.3,
    metalness: 0.7,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.05;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Internal lighting
  const internalLight = new THREE.PointLight(0xffffff, 0.5, 3);
  internalLight.position.y = height + 0.5;
  group.add(internalLight);

  group.position.set(x, y, z);
  group.name = "DisplayCase";

  return group;
}

/**
 * Animate artwork hotspots (pulsing glow effect)
 */
export function animateHotspots(artworks, time) {
  artworks.forEach((artwork) => {
    artwork.traverse((child) => {
      if (child.userData.isHotspot) {
        const pulse =
          Math.sin(time * 2 + child.userData.pulsePhase) * 0.3 + 0.7;
        child.material.opacity = pulse;
        child.scale.setScalar(0.8 + pulse * 0.4);
      }
    });
  });
}
