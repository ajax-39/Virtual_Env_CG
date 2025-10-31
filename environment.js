/**
 * Environment - Room structure (floor, walls, ceiling)
 */

import * as THREE from "three";
import {
  createWoodTexture,
  createMarbleTexture,
  createWallTexture,
} from "./utils.js";

/**
 * Create the gallery environment
 */
export function createEnvironment(scene) {
  const environmentGroup = new THREE.Group();
  environmentGroup.name = "Environment";

  // Room dimensions
  const roomWidth = 20;
  const roomDepth = 15;
  const roomHeight = 4;

  // Floor
  const floor = createFloor(roomWidth, roomDepth);
  environmentGroup.add(floor);

  // Walls
  const walls = createWalls(roomWidth, roomDepth, roomHeight);
  walls.forEach((wall) => environmentGroup.add(wall));

  // Ceiling
  const ceiling = createCeiling(roomWidth, roomDepth, roomHeight);
  environmentGroup.add(ceiling);

  // Add decorative elements
  const decorations = createDecorations(roomWidth, roomDepth, roomHeight);
  decorations.forEach((decoration) => environmentGroup.add(decoration));

  scene.add(environmentGroup);

  return {
    environmentGroup,
    roomWidth,
    roomDepth,
    roomHeight,
  };
}

/**
 * Create floor with reflective marble texture
 */
function createFloor(width, depth) {
  const floorGeometry = new THREE.PlaneGeometry(width, depth, 50, 50);

  // Create marble texture
  const marbleTexture = createMarbleTexture();
  marbleTexture.wrapS = THREE.RepeatWrapping;
  marbleTexture.wrapT = THREE.RepeatWrapping;
  marbleTexture.repeat.set(4, 3);

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    roughness: 0.08,
    metalness: 0.3,
    envMapIntensity: 1.5,
    color: 0xffffff,
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  floor.name = "Floor";

  return floor;
}

/**
 * Create walls with entrance
 */
function createWalls(width, depth, height) {
  const walls = [];
  const wallTexture = createWallTexture();
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.9,
    metalness: 0.05,
    color: 0xfafaf5,
  });

  // Back wall (with entrance)
  const backWallGroup = new THREE.Group();

  const doorWidth = 2;
  const doorHeight = 2.5;
  const wallSegmentWidth = (width - doorWidth) / 2;

  // Left segment of back wall
  const backLeftGeometry = new THREE.BoxGeometry(wallSegmentWidth, height, 0.2);
  const backLeft = new THREE.Mesh(backLeftGeometry, wallMaterial);
  backLeft.position.set(
    -width / 2 + wallSegmentWidth / 2,
    height / 2,
    -depth / 2
  );
  backLeft.receiveShadow = true;
  backLeft.castShadow = true;
  backWallGroup.add(backLeft);

  // Right segment of back wall
  const backRightGeometry = new THREE.BoxGeometry(
    wallSegmentWidth,
    height,
    0.2
  );
  const backRight = new THREE.Mesh(backRightGeometry, wallMaterial);
  backRight.position.set(
    width / 2 - wallSegmentWidth / 2,
    height / 2,
    -depth / 2
  );
  backRight.receiveShadow = true;
  backRight.castShadow = true;
  backWallGroup.add(backRight);

  // Top segment above door
  const backTopGeometry = new THREE.BoxGeometry(
    doorWidth,
    height - doorHeight,
    0.2
  );
  const backTop = new THREE.Mesh(backTopGeometry, wallMaterial);
  backTop.position.set(0, doorHeight + (height - doorHeight) / 2, -depth / 2);
  backTop.receiveShadow = true;
  backTop.castShadow = true;
  backWallGroup.add(backTop);

  backWallGroup.name = "BackWall";
  walls.push(backWallGroup);

  // Front wall
  const frontGeometry = new THREE.BoxGeometry(width, height, 0.2);
  frontGeometry.groups[0].materialIndex = 0;
  wallTexture.repeat.set(width / 2, height / 2);
  const frontWall = new THREE.Mesh(frontGeometry, wallMaterial);
  frontWall.position.set(0, height / 2, depth / 2);
  frontWall.receiveShadow = true;
  frontWall.castShadow = true;
  frontWall.name = "FrontWall";
  walls.push(frontWall);

  // Left wall
  const leftGeometry = new THREE.BoxGeometry(0.2, height, depth);
  const leftWall = new THREE.Mesh(leftGeometry, wallMaterial);
  leftWall.position.set(-width / 2, height / 2, 0);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  leftWall.name = "LeftWall";
  walls.push(leftWall);

  // Right wall
  const rightGeometry = new THREE.BoxGeometry(0.2, height, depth);
  const rightWall = new THREE.Mesh(rightGeometry, wallMaterial);
  rightWall.position.set(width / 2, height / 2, 0);
  rightWall.receiveShadow = true;
  rightWall.castShadow = true;
  rightWall.name = "RightWall";
  walls.push(rightWall);

  return walls;
}

/**
 * Create ceiling
 */
function createCeiling(width, depth, height) {
  const ceilingGeometry = new THREE.PlaneGeometry(width, depth);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.8,
    metalness: 0.1,
  });

  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  ceiling.receiveShadow = true;
  ceiling.name = "Ceiling";

  return ceiling;
}

/**
 * Create decorative elements for the gallery
 */
function createDecorations(width, depth, height) {
  const decorations = [];

  // Add decorative plants in corners
  const plantPositions = [
    { x: -width / 2 + 1.5, z: depth / 2 - 1.5 },
    { x: width / 2 - 1.5, z: depth / 2 - 1.5 },
  ];

  plantPositions.forEach((pos) => {
    const plant = createDecorativePlant();
    plant.position.set(pos.x, 0, pos.z);
    decorations.push(plant);
  });

  // Add decorative ceiling lights (chandeliers)
  const chandPositions = [
    { x: -5, z: 0 },
    { x: 5, z: 0 },
    { x: 0, z: -4 },
  ];

  chandPositions.forEach((pos) => {
    const chandelier = createChandelier();
    chandelier.position.set(pos.x, height - 0.8, pos.z);
    decorations.push(chandelier);
  });

  // Add decorative baseboards along walls
  const baseboard1 = createBaseboard(width, 0.1, 0.05);
  baseboard1.position.set(0, 0.025, -depth / 2);
  decorations.push(baseboard1);

  const baseboard2 = createBaseboard(width, 0.1, 0.05);
  baseboard2.position.set(0, 0.025, depth / 2);
  decorations.push(baseboard2);

  const baseboard3 = createBaseboard(0.05, 0.1, depth);
  baseboard3.position.set(-width / 2, 0.025, 0);
  decorations.push(baseboard3);

  const baseboard4 = createBaseboard(0.05, 0.1, depth);
  baseboard4.position.set(width / 2, 0.025, 0);
  decorations.push(baseboard4);

  return decorations;
}

/**
 * Create a decorative plant
 */
function createDecorativePlant() {
  const plantGroup = new THREE.Group();

  // Pot
  const potGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.4, 16);
  const potMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.8,
    metalness: 0.1,
  });
  const pot = new THREE.Mesh(potGeometry, potMaterial);
  pot.position.y = 0.2;
  pot.castShadow = true;
  plantGroup.add(pot);

  // Soil
  const soilGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16);
  const soilMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e2723,
    roughness: 1.0,
  });
  const soil = new THREE.Mesh(soilGeometry, soilMaterial);
  soil.position.y = 0.42;
  plantGroup.add(soil);

  // Plant leaves (simplified)
  for (let i = 0; i < 5; i++) {
    const leafGeometry = new THREE.ConeGeometry(0.15, 0.6, 8);
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5016,
      roughness: 0.9,
    });
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    const angle = (i / 5) * Math.PI * 2;
    leaf.position.set(
      Math.cos(angle) * 0.15,
      0.7 + Math.random() * 0.2,
      Math.sin(angle) * 0.15
    );
    leaf.rotation.z = Math.PI / 6;
    leaf.rotation.y = angle;
    leaf.castShadow = true;
    plantGroup.add(leaf);
  }

  return plantGroup;
}

/**
 * Create a decorative chandelier
 */
function createChandelier() {
  const chandGroup = new THREE.Group();

  // Main ring
  const ringGeometry = new THREE.TorusGeometry(0.3, 0.03, 16, 32);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.2,
    metalness: 0.9,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  chandGroup.add(ring);

  // Hanging crystals
  for (let i = 0; i < 6; i++) {
    const crystalGeometry = new THREE.ConeGeometry(0.04, 0.2, 6);
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      roughness: 0,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    const angle = (i / 6) * Math.PI * 2;
    crystal.position.set(Math.cos(angle) * 0.25, -0.15, Math.sin(angle) * 0.25);
    crystal.castShadow = true;
    chandGroup.add(crystal);
  }

  // Central light
  const lightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const lightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffcc,
    transparent: true,
    opacity: 0.9,
  });
  const light = new THREE.Mesh(lightGeometry, lightMaterial);
  light.position.y = -0.1;
  chandGroup.add(light);

  // Add point light
  const pointLight = new THREE.PointLight(0xffffcc, 0.3, 5);
  pointLight.position.y = -0.1;
  chandGroup.add(pointLight);

  return chandGroup;
}

/**
 * Create decorative baseboard
 */
function createBaseboard(width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.7,
    metalness: 0.2,
  });
  const baseboard = new THREE.Mesh(geometry, material);
  baseboard.castShadow = true;
  baseboard.receiveShadow = true;
  return baseboard;
}
