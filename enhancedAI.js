/**
 * Enhanced AI System - Smarter NPCs with behaviors
 */

import * as THREE from "three";
import { createSimpleHumanoid } from "./utils.js";

/**
 * Create smart NPC that reacts to player
 */
export function createSmartVisitor(x, z, scene, playerCamera) {
  const visitor = createSimpleHumanoid(0xe74c3c);
  visitor.position.set(x, 0, z);
  visitor.name = "SmartVisitor";

  // AI Data
  visitor.userData.ai = {
    type: "visitor",
    state: "idle", // idle, walking, observing, fleeing
    target: null,
    speed: 1.5,
    detectionRadius: 5,
    personalSpace: 1.5,
    idleTime: 0,
    maxIdleTime: 3 + Math.random() * 2,
    walkPath: [],
    currentPathIndex: 0,
    player: playerCamera,
  };

  return visitor;
}

/**
 * Create conversation group (2-3 visitors)
 */
export function createConversationGroup(x, z, scene) {
  const group = new THREE.Group();
  group.name = "ConversationGroup";

  const visitorCount = 2 + Math.floor(Math.random() * 2); // 2-3 visitors
  const radius = 0.8;

  for (let i = 0; i < visitorCount; i++) {
    const angle = (i / visitorCount) * Math.PI * 2;
    const visitor = createSimpleHumanoid(0x3498db);

    visitor.position.x = Math.cos(angle) * radius;
    visitor.position.z = Math.sin(angle) * radius;
    visitor.rotation.y = -angle + Math.PI;

    visitor.userData.conversing = true;
    visitor.userData.groupIndex = i;
    visitor.userData.headBobPhase = i * Math.PI;

    group.add(visitor);
  }

  group.position.set(x, 0, z);

  // Group AI data
  group.userData.ai = {
    type: "conversation",
    activeTime: 0,
    maxActiveTime: 10 + Math.random() * 10,
    shouldDisband: false,
  };

  return group;
}

/**
 * Create security guard that follows player if too close
 */
export function createSecurityGuard(x, z, scene, playerCamera) {
  const guard = createSimpleHumanoid(0x2c3e50);
  guard.position.set(x, 0, z);
  guard.name = "SecurityGuard";

  // Add cap
  const capGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 8);
  const capMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 0.95;
  guard.add(cap);

  // Guard AI
  guard.userData.ai = {
    type: "guard",
    state: "patrol", // patrol, alert, chasing
    patrolPath: generatePatrolPath(),
    currentPathIndex: 0,
    speed: 2.0,
    alertRadius: 4,
    chaseRadius: 2,
    player: playerCamera,
    originalPosition: new THREE.Vector3(x, 0, z),
    alertTime: 0,
  };

  return guard;
}

/**
 * Create cleaning robot on patrol
 */
export function createCleaningRobot(x, z, scene) {
  const robotGroup = new THREE.Group();
  robotGroup.name = "CleaningRobot";

  // Robot body
  const bodyGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.7,
    roughness: 0.3,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.2;
  body.castShadow = true;
  robotGroup.add(body);

  // Head
  const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 0.5;
  robotGroup.add(head);

  // Eye (light)
  const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eye.position.set(0, 0.5, 0.15);
  robotGroup.add(eye);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

  const wheelPositions = [
    { x: -0.25, z: 0.3 },
    { x: 0.25, z: 0.3 },
    { x: -0.25, z: -0.3 },
    { x: 0.25, z: -0.3 },
  ];

  const wheels = [];
  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, 0.1, pos.z);
    robotGroup.add(wheel);
    wheels.push(wheel);
  });

  robotGroup.position.set(x, 0, z);

  // Robot AI
  robotGroup.userData.ai = {
    type: "robot",
    state: "patrolling",
    patrolPath: generateRobotPatrolPath(),
    currentPathIndex: 0,
    speed: 1.0,
    wheels: wheels,
    head: head,
  };

  return robotGroup;
}

/**
 * Update all AI entities
 */
export function updateAI(aiEntities, deltaTime, playerPosition) {
  aiEntities.forEach((entity) => {
    if (!entity || !entity.userData.ai) return;

    const ai = entity.userData.ai;

    switch (ai.type) {
      case "visitor":
        updateSmartVisitor(entity, deltaTime, playerPosition);
        break;
      case "conversation":
        updateConversationGroup(entity, deltaTime);
        break;
      case "guard":
        updateSecurityGuard(entity, deltaTime, playerPosition);
        break;
      case "robot":
        updateCleaningRobot(entity, deltaTime);
        break;
    }
  });
}

/**
 * Update smart visitor behavior
 */
function updateSmartVisitor(visitor, deltaTime, playerPosition) {
  const ai = visitor.userData.ai;
  const distanceToPlayer = visitor.position.distanceTo(playerPosition);

  // Check player proximity
  if (distanceToPlayer < ai.personalSpace) {
    ai.state = "fleeing";
  } else if (distanceToPlayer < ai.detectionRadius) {
    ai.state = "observing";
  } else {
    if (ai.state === "fleeing" || ai.state === "observing") {
      ai.state = "idle";
      ai.idleTime = 0;
    }
  }

  // Execute state behavior
  switch (ai.state) {
    case "idle":
      ai.idleTime += deltaTime;
      if (ai.idleTime >= ai.maxIdleTime) {
        ai.state = "walking";
        ai.walkPath = generateRandomWalkPath(visitor.position);
        ai.currentPathIndex = 0;
      }
      break;

    case "walking":
      if (ai.walkPath.length > 0) {
        moveAlongPath(visitor, ai, deltaTime);
      } else {
        ai.state = "idle";
        ai.idleTime = 0;
      }
      break;

    case "observing":
      // Look at player
      lookAt(visitor, playerPosition);
      break;

    case "fleeing":
      // Move away from player
      const fleeDirection = new THREE.Vector3()
        .subVectors(visitor.position, playerPosition)
        .normalize();
      visitor.position.add(fleeDirection.multiplyScalar(ai.speed * deltaTime));
      lookAt(visitor, visitor.position.clone().add(fleeDirection));
      break;
  }
}

/**
 * Update conversation group
 */
function updateConversationGroup(group, deltaTime) {
  const ai = group.userData.ai;
  ai.activeTime += deltaTime;

  // Animate head bobbing
  group.children.forEach((visitor) => {
    if (visitor.userData.conversing) {
      const phase = visitor.userData.headBobPhase;
      const bobAmount = Math.sin(ai.activeTime * 2 + phase) * 0.05;
      visitor.position.y = bobAmount;

      // Occasionally turn to look at different group members
      if (Math.random() < 0.01) {
        const targetIndex = Math.floor(Math.random() * group.children.length);
        if (targetIndex !== visitor.userData.groupIndex) {
          const target = group.children[targetIndex];
          if (target) {
            lookAt(visitor, target.position);
          }
        }
      }
    }
  });

  // Disband after max time
  if (ai.activeTime >= ai.maxActiveTime) {
    ai.shouldDisband = true;
  }
}

/**
 * Update security guard
 */
function updateSecurityGuard(guard, deltaTime, playerPosition) {
  const ai = guard.userData.ai;
  const distanceToPlayer = guard.position.distanceTo(playerPosition);

  // State transitions
  if (distanceToPlayer < ai.chaseRadius) {
    ai.state = "chasing";
    ai.alertTime = 5; // Stay alert for 5 seconds
  } else if (distanceToPlayer < ai.alertRadius) {
    if (ai.state !== "chasing") {
      ai.state = "alert";
    }
  } else {
    if (ai.state === "alert" || ai.state === "chasing") {
      ai.alertTime -= deltaTime;
      if (ai.alertTime <= 0) {
        ai.state = "patrol";
      }
    }
  }

  // Execute state
  switch (ai.state) {
    case "patrol":
      if (ai.patrolPath.length > 0) {
        moveAlongPath(guard, ai, deltaTime);
      }
      break;

    case "alert":
      lookAt(guard, playerPosition);
      break;

    case "chasing":
      // Move toward player
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, guard.position)
        .normalize();
      guard.position.add(direction.multiplyScalar(ai.speed * deltaTime));
      lookAt(guard, playerPosition);
      break;
  }
}

/**
 * Update cleaning robot
 */
function updateCleaningRobot(robot, deltaTime) {
  const ai = robot.userData.ai;

  if (ai.patrolPath.length > 0) {
    moveAlongPath(robot, ai, deltaTime * 0.8); // Slower movement

    // Rotate wheels
    ai.wheels.forEach((wheel) => {
      wheel.rotation.x += ai.speed * deltaTime * 5;
    });

    // Bob head slightly
    ai.head.rotation.y = Math.sin(Date.now() * 0.003) * 0.2;
  }
}

/**
 * Helper: Move entity along path
 */
function moveAlongPath(entity, ai, deltaTime) {
  if (ai.currentPathIndex >= ai.patrolPath.length) {
    ai.currentPathIndex = 0;
  }

  const targetPoint = ai.patrolPath[ai.currentPathIndex];
  const direction = new THREE.Vector3()
    .subVectors(targetPoint, entity.position)
    .normalize();

  const distance = entity.position.distanceTo(targetPoint);

  if (distance < 0.2) {
    ai.currentPathIndex++;
  } else {
    entity.position.add(direction.multiplyScalar(ai.speed * deltaTime));
    lookAt(entity, targetPoint);
  }
}

/**
 * Helper: Make entity look at target
 */
function lookAt(entity, target) {
  const direction = new THREE.Vector3().subVectors(target, entity.position);
  const angle = Math.atan2(direction.x, direction.z);
  entity.rotation.y = angle;
}

/**
 * Generate patrol path
 */
function generatePatrolPath() {
  return [
    new THREE.Vector3(-8, 0, -6),
    new THREE.Vector3(8, 0, -6),
    new THREE.Vector3(8, 0, 6),
    new THREE.Vector3(-8, 0, 6),
  ];
}

/**
 * Generate robot patrol path
 */
function generateRobotPatrolPath() {
  return [
    new THREE.Vector3(-7, 0, -5),
    new THREE.Vector3(-7, 0, 5),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(7, 0, 5),
    new THREE.Vector3(7, 0, -5),
    new THREE.Vector3(0, 0, -5),
  ];
}

/**
 * Generate random walk path
 */
function generateRandomWalkPath(startPosition) {
  const path = [];
  const steps = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < steps; i++) {
    path.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        0,
        (Math.random() - 0.5) * 10
      )
    );
  }

  return path;
}
