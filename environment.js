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
    roughness: 0.15,
    metalness: 0.1,
    envMapIntensity: 1.0,
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
    roughness: 0.95,
    metalness: 0.0,
    color: 0xf8f8f0,
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
    color: 0xe0e0e0,
    roughness: 0.9,
    metalness: 0.0,
  });

  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  ceiling.receiveShadow = true;
  ceiling.name = "Ceiling";

  return ceiling;
}
