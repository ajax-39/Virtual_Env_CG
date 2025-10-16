/**
 * Enhanced Actors - Wildlife (birds, butterflies, fish), Smarter NPCs, Kinetic Sculptures
 */

import * as THREE from "three";

/**
 * Create flying birds with flocking behavior
 */
export function createBirds(scene, count = 15, roomWidth, roomDepth, roomHeight) {
  const birds = [];
  const birdGroup = new THREE.Group();
  birdGroup.name = "Birds";

  for (let i = 0; i < count; i++) {
    const bird = createBird();
    bird.position.set(
      (Math.random() - 0.5) * roomWidth * 0.8,
      roomHeight * 0.6 + Math.random() * roomHeight * 0.3,
      (Math.random() - 0.5) * roomDepth * 0.8
    );

    bird.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.05
      ),
      wingPhase: Math.random() * Math.PI * 2,
      bounds: { width: roomWidth, depth: roomDepth, height: roomHeight },
    };

    birdGroup.add(bird);
    birds.push(bird);
  }

  scene.add(birdGroup);
  return birds;
}

function createBird() {
  const bird = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1, 0.8, 1.2);
  bird.add(body);

  // Head
  const headGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  head.position.set(0, 0.05, 0.1);
  bird.add(head);

  // Wings
  const wingGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.08);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.6,
  });

  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(-0.08, 0, 0);
  bird.add(leftWing);
  bird.userData.leftWing = leftWing;

  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(0.08, 0, 0);
  bird.add(rightWing);
  bird.userData.rightWing = rightWing;

  return bird;
}

/**
 * Update bird flocking behavior
 */
export function updateBirds(birds, deltaTime) {
  const separationDistance = 0.5;
  const alignmentDistance = 1.5;
  const cohesionDistance = 2.0;

  birds.forEach((bird, index) => {
    const separation = new THREE.Vector3();
    const alignment = new THREE.Vector3();
    const cohesion = new THREE.Vector3();
    let separationCount = 0;
    let alignmentCount = 0;
    let cohesionCount = 0;

    // Flocking calculations
    birds.forEach((otherBird, otherIndex) => {
      if (index === otherIndex) return;

      const distance = bird.position.distanceTo(otherBird.position);

      // Separation
      if (distance < separationDistance) {
        const diff = new THREE.Vector3()
          .subVectors(bird.position, otherBird.position)
          .normalize()
          .divideScalar(distance);
        separation.add(diff);
        separationCount++;
      }

      // Alignment
      if (distance < alignmentDistance) {
        alignment.add(otherBird.userData.velocity);
        alignmentCount++;
      }

      // Cohesion
      if (distance < cohesionDistance) {
        cohesion.add(otherBird.position);
        cohesionCount++;
      }
    });

    // Average and apply forces
    if (separationCount > 0) {
      separation.divideScalar(separationCount);
      bird.userData.velocity.add(separation.multiplyScalar(0.05));
    }

    if (alignmentCount > 0) {
      alignment.divideScalar(alignmentCount);
      bird.userData.velocity.lerp(alignment, 0.05);
    }

    if (cohesionCount > 0) {
      cohesion.divideScalar(cohesionCount);
      const desired = cohesion.sub(bird.position).normalize().multiplyScalar(0.02);
      bird.userData.velocity.add(desired);
    }

    // Boundary avoidance
    const bounds = bird.userData.bounds;
    const margin = 2;

    if (bird.position.x > bounds.width / 2 - margin) {
      bird.userData.velocity.x -= 0.01;
    } else if (bird.position.x < -bounds.width / 2 + margin) {
      bird.userData.velocity.x += 0.01;
    }

    if (bird.position.z > bounds.depth / 2 - margin) {
      bird.userData.velocity.z -= 0.01;
    } else if (bird.position.z < -bounds.depth / 2 + margin) {
      bird.userData.velocity.z += 0.01;
    }

    if (bird.position.y > bounds.height - margin) {
      bird.userData.velocity.y -= 0.01;
    } else if (bird.position.y < bounds.height * 0.5) {
      bird.userData.velocity.y += 0.01;
    }

    // Limit speed
    const maxSpeed = 0.1;
    if (bird.userData.velocity.length() > maxSpeed) {
      bird.userData.velocity.normalize().multiplyScalar(maxSpeed);
    }

    // Update position
    bird.position.add(bird.userData.velocity);

    // Update rotation to face direction
    if (bird.userData.velocity.length() > 0.01) {
      const direction = bird.userData.velocity.clone().normalize();
      bird.lookAt(bird.position.clone().add(direction));
    }

    // Wing flapping animation
    bird.userData.wingPhase += deltaTime * 10;
    const wingAngle = Math.sin(bird.userData.wingPhase) * 0.5;
    if (bird.userData.leftWing) {
      bird.userData.leftWing.rotation.z = wingAngle;
    }
    if (bird.userData.rightWing) {
      bird.userData.rightWing.rotation.z = -wingAngle;
    }
  });
}

/**
 * Create butterflies
 */
export function createButterflies(scene, count = 10, roomWidth, roomDepth) {
  const butterflies = [];
  const butterflyGroup = new THREE.Group();
  butterflyGroup.name = "Butterflies";

  for (let i = 0; i < count; i++) {
    const butterfly = createButterfly();
    butterfly.position.set(
      (Math.random() - 0.5) * roomWidth * 0.6,
      0.5 + Math.random() * 2,
      (Math.random() - 0.5) * roomDepth * 0.6
    );

    butterfly.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.02
      ),
      wingPhase: Math.random() * Math.PI * 2,
      wanderAngle: Math.random() * Math.PI * 2,
      bounds: { width: roomWidth, depth: roomDepth },
    };

    butterflyGroup.add(butterfly);
    butterflies.push(butterfly);
  }

  scene.add(butterflyGroup);
  return butterflies;
}

function createButterfly() {
  const butterfly = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.8,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  butterfly.add(body);

  // Wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.quadraticCurveTo(0.1, 0.05, 0.15, 0.15);
  wingShape.quadraticCurveTo(0.1, 0.2, 0, 0.15);
  wingShape.lineTo(0, 0);

  const wingGeometry = new THREE.ShapeGeometry(wingShape);
  const wingMaterials = [
    new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      roughness: 0.5,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x4ecdc4,
      roughness: 0.5,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xffe66d,
      roughness: 0.5,
      side: THREE.DoubleSide,
    }),
  ];

  const wingMaterial = wingMaterials[Math.floor(Math.random() * wingMaterials.length)];

  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.rotation.y = Math.PI / 2;
  leftWing.position.x = -0.01;
  butterfly.add(leftWing);
  butterfly.userData.leftWing = leftWing;

  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.rotation.y = -Math.PI / 2;
  rightWing.position.x = 0.01;
  butterfly.add(rightWing);
  butterfly.userData.rightWing = rightWing;

  return butterfly;
}

/**
 * Update butterfly wandering behavior
 */
export function updateButterflies(butterflies, deltaTime) {
  butterflies.forEach((butterfly) => {
    // Random wandering
    butterfly.userData.wanderAngle += (Math.random() - 0.5) * 0.1;

    const wanderForce = new THREE.Vector3(
      Math.cos(butterfly.userData.wanderAngle) * 0.001,
      (Math.random() - 0.5) * 0.0005,
      Math.sin(butterfly.userData.wanderAngle) * 0.001
    );

    butterfly.userData.velocity.add(wanderForce);

    // Boundary check
    const bounds = butterfly.userData.bounds;
    if (Math.abs(butterfly.position.x) > bounds.width / 2 - 1) {
      butterfly.userData.velocity.x *= -0.5;
    }
    if (Math.abs(butterfly.position.z) > bounds.depth / 2 - 1) {
      butterfly.userData.velocity.z *= -0.5;
    }
    if (butterfly.position.y < 0.3 || butterfly.position.y > 3) {
      butterfly.userData.velocity.y *= -0.5;
    }

    // Limit speed
    const maxSpeed = 0.05;
    if (butterfly.userData.velocity.length() > maxSpeed) {
      butterfly.userData.velocity.normalize().multiplyScalar(maxSpeed);
    }

    // Update position
    butterfly.position.add(butterfly.userData.velocity);

    // Wing flapping
    butterfly.userData.wingPhase += deltaTime * 15;
    const wingAngle = Math.sin(butterfly.userData.wingPhase) * 0.8;

    if (butterfly.userData.leftWing) {
      butterfly.userData.leftWing.rotation.z = wingAngle;
    }
    if (butterfly.userData.rightWing) {
      butterfly.userData.rightWing.rotation.z = -wingAngle;
    }

    // Face movement direction
    if (butterfly.userData.velocity.length() > 0.01) {
      const direction = butterfly.userData.velocity.clone().normalize();
      butterfly.lookAt(butterfly.position.clone().add(direction));
      butterfly.rotateX(Math.PI / 2);
    }
  });
}

/**
 * Create aquarium with fish
 */
export function createAquarium(scene, position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Glass tank
  const tankGeometry = new THREE.BoxGeometry(2, 1.5, 0.8);
  const tankMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.2,
    roughness: 0.1,
    transmission: 0.95,
    thickness: 0.5,
  });
  const tank = new THREE.Mesh(tankGeometry, tankMaterial);
  tank.position.y = 1.5;
  group.add(tank);

  // Water inside
  const waterGeometry = new THREE.BoxGeometry(1.9, 1.4, 0.7);
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0077be,
    transparent: true,
    opacity: 0.5,
    roughness: 0,
  });
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.position.y = 1.5;
  group.add(water);

  // Stand
  const standGeometry = new THREE.BoxGeometry(2.2, 0.8, 1);
  const standMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.6,
  });
  const stand = new THREE.Mesh(standGeometry, standMaterial);
  stand.position.y = 0.4;
  stand.castShadow = true;
  group.add(stand);

  // Create fish
  const fish = [];
  for (let i = 0; i < 8; i++) {
    const fishMesh = createFish();
    fishMesh.position.set(
      (Math.random() - 0.5) * 1.5,
      1.2 + (Math.random() - 0.5) * 1.0,
      (Math.random() - 0.5) * 0.5
    );
    fishMesh.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.01
      ),
      tankBounds: { x: 0.9, y: 0.6, z: 0.3 },
      centerY: 1.5,
    };
    group.add(fishMesh);
    fish.push(fishMesh);
  }

  // Light inside aquarium
  const aquariumLight = new THREE.PointLight(0x00aaff, 0.5, 3);
  aquariumLight.position.y = 2.2;
  group.add(aquariumLight);

  scene.add(group);

  return { aquariumGroup: group, fish: fish };
}

function createFish() {
  const fish = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const colors = [0xff6b6b, 0xffa500, 0xffff00, 0x4ecdc4, 0xc44569];
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: colors[Math.floor(Math.random() * colors.length)],
    roughness: 0.4,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1.5, 1, 1);
  fish.add(body);

  // Tail
  const tailGeometry = new THREE.ConeGeometry(0.06, 0.12, 8);
  const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
  tail.rotation.z = -Math.PI / 2;
  tail.position.x = -0.14;
  fish.add(tail);
  fish.userData.tail = tail;

  return fish;
}

/**
 * Update fish swimming behavior
 */
export function updateFish(fish, deltaTime) {
  fish.forEach((fishMesh) => {
    const bounds = fishMesh.userData.tankBounds;
    const center = fishMesh.userData.centerY;

    // Random swimming movement
    fishMesh.userData.velocity.x += (Math.random() - 0.5) * 0.0005;
    fishMesh.userData.velocity.y += (Math.random() - 0.5) * 0.0002;
    fishMesh.userData.velocity.z += (Math.random() - 0.5) * 0.0005;

    // Boundary avoidance
    const localPos = fishMesh.position.clone();
    localPos.y -= center;

    if (Math.abs(localPos.x) > bounds.x) {
      fishMesh.userData.velocity.x *= -0.5;
    }
    if (Math.abs(localPos.y) > bounds.y) {
      fishMesh.userData.velocity.y *= -0.5;
    }
    if (Math.abs(localPos.z) > bounds.z) {
      fishMesh.userData.velocity.z *= -0.5;
    }

    // Limit speed
    const maxSpeed = 0.02;
    if (fishMesh.userData.velocity.length() > maxSpeed) {
      fishMesh.userData.velocity.normalize().multiplyScalar(maxSpeed);
    }

    // Update position
    fishMesh.position.add(fishMesh.userData.velocity);

    // Face swimming direction
    if (fishMesh.userData.velocity.length() > 0.001) {
      const direction = fishMesh.userData.velocity.clone().normalize();
      fishMesh.lookAt(fishMesh.position.clone().add(direction));
    }

    // Tail wagging
    if (fishMesh.userData.tail) {
      fishMesh.userData.tail.rotation.y =
        Math.sin(Date.now() * 0.01) * 0.3;
    }
  });
}

/**
 * Create kinetic sculpture with gears
 */
export function createKineticSculpture(scene, position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Create interconnected gears
  const gears = [];

  for (let i = 0; i < 3; i++) {
    const gear = createGear(0.3 + i * 0.1, 12 + i * 4);
    gear.position.set(i * 0.6 - 0.6, 1.5 + i * 0.3, 0);
    gear.userData = {
      rotationSpeed: (i % 2 === 0 ? 1 : -1) * (1 + i * 0.5),
    };
    group.add(gear);
    gears.push(gear);
  }

  scene.add(group);

  return { kineticGroup: group, gears: gears };
}

function createGear(radius, teeth) {
  const gear = new THREE.Group();

  // Central disc
  const discGeometry = new THREE.CylinderGeometry(radius * 0.8, radius * 0.8, 0.1, 32);
  const discMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.4,
    metalness: 0.8,
  });
  const disc = new THREE.Mesh(discGeometry, discMaterial);
  disc.castShadow = true;
  gear.add(disc);

  // Teeth
  const toothGeometry = new THREE.BoxGeometry(radius * 0.2, 0.12, radius * 0.15);
  const toothMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.5,
    metalness: 0.7,
  });

  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
    tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    tooth.rotation.y = angle;
    tooth.castShadow = true;
    gear.add(tooth);
  }

  return gear;
}

/**
 * Update kinetic sculpture
 */
export function updateKineticSculpture(kineticData, deltaTime) {
  if (!kineticData || !kineticData.gears) return;

  kineticData.gears.forEach((gear) => {
    gear.rotation.y += gear.userData.rotationSpeed * deltaTime;
  });
}
