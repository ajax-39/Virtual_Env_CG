/**
 * Wildlife - Birds, Butterflies, Jellyfish, Dynamic elements
 */

import * as THREE from "three";

/**
 * Create flying birds
 */
export function createBirds(scene, roomWidth, roomDepth, roomHeight) {
  const birdsGroup = new THREE.Group();
  birdsGroup.name = "Birds";

  const birdCount = 5;

  for (let i = 0; i < birdCount; i++) {
    const bird = createBird();
    bird.position.set(
      (Math.random() - 0.5) * roomWidth * 0.8,
      roomHeight * 0.7 + Math.random() * 0.5,
      (Math.random() - 0.5) * roomDepth * 0.8
    );

    // Bird flight data
    bird.userData.flightPath = generateFlightPath(
      roomWidth,
      roomDepth,
      roomHeight
    );
    bird.userData.pathIndex = Math.floor(
      Math.random() * bird.userData.flightPath.length
    );
    bird.userData.speed = 2 + Math.random();
    bird.userData.wingPhase = Math.random() * Math.PI * 2;

    birdsGroup.add(bird);
  }

  return birdsGroup;
}

/**
 * Create a single bird
 */
function createBird() {
  const birdGroup = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  bodyGeometry.scale(1, 0.8, 1.3);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.8,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  birdGroup.add(body);

  // Head
  const headGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  head.position.set(0, 0.05, 0.08);
  birdGroup.add(head);

  // Beak
  const beakGeometry = new THREE.ConeGeometry(0.015, 0.04, 4);
  const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const beak = new THREE.Mesh(beakGeometry, beakMaterial);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.05, 0.12);
  birdGroup.add(beak);

  // Wings
  const wingGeometry = new THREE.PlaneGeometry(0.12, 0.08);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    side: THREE.DoubleSide,
  });

  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.rotation.y = Math.PI / 4;
  leftWing.position.x = -0.08;
  birdGroup.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.rotation.y = -Math.PI / 4;
  rightWing.position.x = 0.08;
  birdGroup.add(rightWing);

  // Store wings for animation
  birdGroup.userData.leftWing = leftWing;
  birdGroup.userData.rightWing = rightWing;

  return birdGroup;
}

/**
 * Create butterflies near flowers
 */
export function createButterflies(scene, flowerPositions = null) {
  const butterfliesGroup = new THREE.Group();
  butterfliesGroup.name = "Butterflies";

  // If no flower positions provided, create default positions
  if (!flowerPositions) {
    flowerPositions = [
      new THREE.Vector3(-6, 1.5, 4),
      new THREE.Vector3(6, 1.5, 4),
      new THREE.Vector3(0, 1.5, -4),
    ];
  }

  flowerPositions.forEach((pos, index) => {
    // Create 2-3 butterflies per flower
    const butterflyCount = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < butterflyCount; i++) {
      const butterfly = createButterfly();
      butterfly.position.copy(pos);
      butterfly.position.x += (Math.random() - 0.5) * 2;
      butterfly.position.z += (Math.random() - 0.5) * 2;

      butterfly.userData.centerPoint = pos.clone();
      butterfly.userData.orbitRadius = 0.5 + Math.random() * 0.5;
      butterfly.userData.orbitSpeed = 0.5 + Math.random() * 0.5;
      butterfly.userData.heightOffset = Math.random() * Math.PI * 2;
      butterfly.userData.wingPhase = Math.random() * Math.PI * 2;

      butterfliesGroup.add(butterfly);
    }
  });

  return butterfliesGroup;
}

/**
 * Create a single butterfly
 */
function createButterfly() {
  const butterflyGroup = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 6);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  butterflyGroup.add(body);

  // Wing geometry
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.bezierCurveTo(0.1, 0.1, 0.15, 0.12, 0.15, 0.15);
  wingShape.bezierCurveTo(0.15, 0.12, 0.1, 0.08, 0, 0);

  const wingGeometry = new THREE.ShapeGeometry(wingShape);
  const wingColors = [0xff69b4, 0x9370db, 0x00ced1, 0xffa500, 0xff1493];
  const wingColor = wingColors[Math.floor(Math.random() * wingColors.length)];

  const wingMaterial = new THREE.MeshStandardMaterial({
    color: wingColor,
    side: THREE.DoubleSide,
    emissive: wingColor,
    emissiveIntensity: 0.2,
  });

  // Left wings
  const leftWingTop = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWingTop.position.set(-0.04, 0, 0.03);
  leftWingTop.rotation.y = Math.PI;
  butterflyGroup.add(leftWingTop);

  const leftWingBottom = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWingBottom.scale.set(0.8, 0.8, 0.8);
  leftWingBottom.position.set(-0.04, 0, -0.03);
  leftWingBottom.rotation.y = Math.PI;
  leftWingBottom.rotation.x = Math.PI;
  butterflyGroup.add(leftWingBottom);

  // Right wings
  const rightWingTop = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWingTop.position.set(0.04, 0, 0.03);
  butterflyGroup.add(rightWingTop);

  const rightWingBottom = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWingBottom.scale.set(0.8, 0.8, 0.8);
  rightWingBottom.position.set(0.04, 0, -0.03);
  rightWingBottom.rotation.x = Math.PI;
  butterflyGroup.add(rightWingBottom);

  // Store wings for animation
  butterflyGroup.userData.wings = [
    leftWingTop,
    leftWingBottom,
    rightWingTop,
    rightWingBottom,
  ];

  butterflyGroup.scale.setScalar(0.8);

  return butterflyGroup;
}

/**
 * Create aquarium with floating jellyfish
 */
export function createAquarium(x, y, z) {
  const aquariumGroup = new THREE.Group();
  aquariumGroup.name = "Aquarium";

  // Tank dimensions
  const width = 2;
  const height = 2;
  const depth = 0.6;

  // Glass box
  const glassGeometry = new THREE.BoxGeometry(width, height, depth);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3,
    roughness: 0,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.5,
  });
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.position.y = height / 2;
  aquariumGroup.add(glass);

  // Frame
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    metalness: 0.6,
    roughness: 0.4,
  });

  const frameThickness = 0.05;
  const framePositions = [
    {
      size: [width + frameThickness, frameThickness, depth],
      pos: [0, height + frameThickness / 2, 0],
    },
    {
      size: [width + frameThickness, frameThickness, depth],
      pos: [0, -frameThickness / 2, 0],
    },
    {
      size: [frameThickness, height, depth],
      pos: [-width / 2 - frameThickness / 2, height / 2, 0],
    },
    {
      size: [frameThickness, height, depth],
      pos: [width / 2 + frameThickness / 2, height / 2, 0],
    },
  ];

  framePositions.forEach((frame) => {
    const frameGeometry = new THREE.BoxGeometry(...frame.size);
    const framePiece = new THREE.Mesh(frameGeometry, frameMaterial);
    framePiece.position.set(...frame.pos);
    aquariumGroup.add(framePiece);
  });

  // Create jellyfish inside
  const jellyfishCount = 3;
  const jellyfish = [];

  for (let i = 0; i < jellyfishCount; i++) {
    const jelly = createJellyfish();
    jelly.position.set(
      (Math.random() - 0.5) * (width - 0.4),
      height / 2 + (Math.random() - 0.5) * (height - 0.5),
      (Math.random() - 0.5) * (depth - 0.3)
    );

    jelly.userData.swimPath = generateJellyfishPath(width, height, depth);
    jelly.userData.pathIndex = Math.floor(
      Math.random() * jelly.userData.swimPath.length
    );
    jelly.userData.speed = 0.3 + Math.random() * 0.2;
    jelly.userData.pulsePhase = Math.random() * Math.PI * 2;

    jellyfish.push(jelly);
    aquariumGroup.add(jelly);
  }

  // Light inside aquarium
  const aquariumLight = new THREE.PointLight(0x4fc3f7, 1, 3);
  aquariumLight.position.set(0, height, 0);
  aquariumGroup.add(aquariumLight);

  aquariumGroup.position.set(x, y, z);
  aquariumGroup.userData.jellyfish = jellyfish;

  return aquariumGroup;
}

/**
 * Create a single jellyfish
 */
function createJellyfish() {
  const jellyfishGroup = new THREE.Group();

  // Bell/head
  const bellGeometry = new THREE.SphereGeometry(
    0.15,
    16,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  const bellMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff1493,
    transparent: true,
    opacity: 0.6,
    emissive: 0xff69b4,
    emissiveIntensity: 0.3,
  });
  const bell = new THREE.Mesh(bellGeometry, bellMaterial);
  bell.rotation.x = Math.PI;
  jellyfishGroup.add(bell);

  // Tentacles
  const tentacleCount = 8;
  const tentacles = [];

  for (let i = 0; i < tentacleCount; i++) {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        -0.15,
        (Math.random() - 0.5) * 0.1
      ),
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.15,
        -0.3,
        (Math.random() - 0.5) * 0.15
      )
    );

    const tentacleGeometry = new THREE.TubeGeometry(curve, 10, 0.01, 4, false);
    const tentacleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffc0cb,
      transparent: true,
      opacity: 0.7,
    });

    const tentacle = new THREE.Mesh(tentacleGeometry, tentacleMaterial);

    const angle = (i / tentacleCount) * Math.PI * 2;
    tentacle.position.x = Math.cos(angle) * 0.12;
    tentacle.position.z = Math.sin(angle) * 0.12;

    jellyfishGroup.add(tentacle);
    tentacles.push(tentacle);
  }

  jellyfishGroup.userData.bell = bell;
  jellyfishGroup.userData.tentacles = tentacles;
  jellyfishGroup.scale.setScalar(0.8);

  return jellyfishGroup;
}

/**
 * Update all wildlife
 */
export function updateWildlife(wildlifeObjects, deltaTime, elapsedTime) {
  wildlifeObjects.forEach((obj) => {
    if (!obj) return;

    if (obj.name === "Birds") {
      updateBirds(obj, deltaTime, elapsedTime);
    } else if (obj.name === "Butterflies") {
      updateButterflies(obj, deltaTime, elapsedTime);
    } else if (obj.name === "Aquarium") {
      updateAquarium(obj, deltaTime, elapsedTime);
    }
  });
}

/**
 * Update birds flight
 */
function updateBirds(birdsGroup, deltaTime, elapsedTime) {
  birdsGroup.children.forEach((bird) => {
    const path = bird.userData.flightPath;
    const speed = bird.userData.speed;

    // Move along path
    bird.userData.pathIndex =
      (bird.userData.pathIndex + speed * deltaTime * 0.1) % path.length;
    const index = Math.floor(bird.userData.pathIndex);
    const nextIndex = (index + 1) % path.length;

    const current = path[index];
    const next = path[nextIndex];
    const t = bird.userData.pathIndex - index;

    bird.position.lerpVectors(current, next, t);

    // Orient bird toward movement direction
    const direction = new THREE.Vector3().subVectors(next, current).normalize();
    const angle = Math.atan2(direction.x, direction.z);
    bird.rotation.y = angle;

    // Wing flapping
    const wingAngle =
      Math.sin(elapsedTime * 10 + bird.userData.wingPhase) * 0.5;
    if (bird.userData.leftWing) {
      bird.userData.leftWing.rotation.y = Math.PI / 4 + wingAngle;
      bird.userData.rightWing.rotation.y = -Math.PI / 4 - wingAngle;
    }
  });
}

/**
 * Update butterflies
 */
function updateButterflies(butterfliesGroup, deltaTime, elapsedTime) {
  butterfliesGroup.children.forEach((butterfly) => {
    const center = butterfly.userData.centerPoint;
    const radius = butterfly.userData.orbitRadius;
    const speed = butterfly.userData.orbitSpeed;
    const heightOffset = butterfly.userData.heightOffset;

    // Orbit around center point
    const angle = elapsedTime * speed;
    butterfly.position.x = center.x + Math.cos(angle) * radius;
    butterfly.position.z = center.z + Math.sin(angle) * radius;
    butterfly.position.y =
      center.y + Math.sin(elapsedTime * 2 + heightOffset) * 0.3;

    // Rotate to face movement direction
    butterfly.rotation.y = angle + Math.PI / 2;

    // Wing flapping
    const wings = butterfly.userData.wings;
    const flapAngle =
      Math.sin(elapsedTime * 8 + butterfly.userData.wingPhase) * 0.8;

    wings.forEach((wing, index) => {
      if (index < 2) {
        // Left wings
        wing.rotation.y = Math.PI - flapAngle;
      } else {
        // Right wings
        wing.rotation.y = flapAngle;
      }
    });
  });
}

/**
 * Update aquarium jellyfish
 */
function updateAquarium(aquarium, deltaTime, elapsedTime) {
  const jellyfish = aquarium.userData.jellyfish;

  jellyfish.forEach((jelly) => {
    const path = jelly.userData.swimPath;
    const speed = jelly.userData.speed;

    // Move along path
    jelly.userData.pathIndex =
      (jelly.userData.pathIndex + speed * deltaTime * 0.5) % path.length;
    const index = Math.floor(jelly.userData.pathIndex);
    const nextIndex = (index + 1) % path.length;

    const current = path[index];
    const next = path[nextIndex];
    const t = jelly.userData.pathIndex - index;

    jelly.position.lerpVectors(current, next, t);

    // Pulsing animation
    const pulse =
      1 + Math.sin(elapsedTime * 3 + jelly.userData.pulsePhase) * 0.1;
    if (jelly.userData.bell) {
      jelly.userData.bell.scale.set(pulse, pulse * 0.8, pulse);
    }

    // Gentle rotation
    jelly.rotation.y = elapsedTime * 0.2 + jelly.userData.pulsePhase;
  });
}

/**
 * Generate flight path for birds
 */
function generateFlightPath(roomWidth, roomDepth, roomHeight) {
  const path = [];
  const pointCount = 20;

  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * Math.PI * 2;
    const radiusX = roomWidth * 0.4;
    const radiusZ = roomDepth * 0.4;

    path.push(
      new THREE.Vector3(
        Math.cos(angle) * radiusX,
        roomHeight * 0.7 + Math.sin(angle * 3) * 0.3,
        Math.sin(angle) * radiusZ
      )
    );
  }

  return path;
}

/**
 * Generate swim path for jellyfish
 */
function generateJellyfishPath(width, height, depth) {
  const path = [];
  const pointCount = 15;

  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * Math.PI * 2;
    path.push(
      new THREE.Vector3(
        Math.cos(angle) * (width * 0.3),
        height / 2 + Math.sin(angle * 2) * (height * 0.2),
        Math.sin(angle * 1.5) * (depth * 0.2)
      )
    );
  }

  return path;
}
