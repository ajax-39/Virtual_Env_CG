/**
 * Enhanced NPC AI - Smart visitors that react to player
 */

import * as THREE from "three";
import { createSimpleHumanoid } from "./utils.js";

/**
 * Create smart NPC that reacts to player
 */
export function createSmartNPC(scene, position, playerCamera) {
  const npc = createSimpleHumanoid(0x9b59b6);
  npc.position.copy(position);
  npc.name = "SmartNPC";

  npc.userData = {
    type: "smart",
    state: "idle", // idle, walking, looking, waving
    playerCamera: playerCamera,
    detectionRadius: 5,
    personalSpace: 2,
    lookAtPlayer: false,
    emotionTime: 0,
    wanderTarget: null,
    stateTime: 0,
  };

  // Add emotion indicator (simple sphere above head)
  const emotionGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const emotionMaterial = new THREE.MeshBasicMaterial({
    color: 0xffeb3b,
    transparent: true,
    opacity: 0.7,
  });
  const emotionIndicator = new THREE.Mesh(emotionGeometry, emotionMaterial);
  emotionIndicator.position.y = 2.5;
  emotionIndicator.visible = false;
  npc.add(emotionIndicator);
  npc.userData.emotionIndicator = emotionIndicator;

  scene.add(npc);
  return npc;
}

/**
 * Create group of NPCs having a conversation
 */
export function createConversationGroup(scene, centerPosition) {
  const group = new THREE.Group();
  group.name = "ConversationGroup";

  const positions = [
    new THREE.Vector3(-0.8, 0, 0.8),
    new THREE.Vector3(0.8, 0, 0.8),
    new THREE.Vector3(0, 0, -0.8),
  ];

  const colors = [0xe74c3c, 0x3498db, 0x2ecc71];

  positions.forEach((pos, index) => {
    const npc = createSimpleHumanoid(colors[index]);
    npc.position.copy(pos);

    // Look at center
    npc.lookAt(new THREE.Vector3(0, 0, 0));

    npc.userData = {
      type: "conversing",
      conversationTime: Math.random() * Math.PI * 2,
      animationPhase: index * (Math.PI * 2) / 3,
    };

    group.add(npc);
  });

  group.position.copy(centerPosition);
  scene.add(group);

  return group;
}

/**
 * Create security guard that follows player if too close
 */
export function createSecurityGuard(scene, position, artworks) {
  const guard = createSimpleHumanoid(0x34495e);
  guard.position.copy(position);
  guard.name = "SecurityGuard";

  // Add cap/hat
  const capGeometry = new THREE.CylinderGeometry(0.25, 0.28, 0.15, 16);
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    roughness: 0.7,
  });
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 2.15;
  guard.add(cap);

  guard.userData = {
    type: "guard",
    state: "patrolling", // patrolling, following, warning
    patrolPoints: [
      position.clone(),
      new THREE.Vector3(position.x + 5, 0, position.z),
      new THREE.Vector3(position.x + 5, 0, position.z + 5),
      new THREE.Vector3(position.x, 0, position.z + 5),
    ],
    currentPatrolIndex: 0,
    followTarget: null,
    warningDistance: 1.5,
    detectionRadius: 6,
    speed: 0.02,
    artworks: artworks,
  };

  // Warning indicator
  const warningGeometry = new THREE.ConeGeometry(0.2, 0.4, 8);
  const warningMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.8,
  });
  const warningIndicator = new THREE.Mesh(warningGeometry, warningMaterial);
  warningIndicator.position.y = 2.8;
  warningIndicator.rotation.x = Math.PI;
  warningIndicator.visible = false;
  guard.add(warningIndicator);
  guard.userData.warningIndicator = warningIndicator;

  scene.add(guard);
  return guard;
}

/**
 * Update smart NPC behavior
 */
export function updateSmartNPC(npc, playerPosition, deltaTime) {
  if (!npc || !npc.userData || npc.userData.type !== "smart") return;

  const data = npc.userData;
  const distanceToPlayer = npc.position.distanceTo(playerPosition);

  data.stateTime += deltaTime;

  // State machine
  switch (data.state) {
    case "idle":
      // Check if player is nearby
      if (distanceToPlayer < data.detectionRadius) {
        data.state = "looking";
        data.stateTime = 0;
        if (data.emotionIndicator) {
          data.emotionIndicator.visible = true;
          data.emotionIndicator.material.color.setHex(0x4caf50); // Green (friendly)
        }
      }

      // Occasional wander
      if (data.stateTime > 5 && Math.random() < 0.01) {
        data.state = "walking";
        data.wanderTarget = new THREE.Vector3(
          npc.position.x + (Math.random() - 0.5) * 4,
          0,
          npc.position.z + (Math.random() - 0.5) * 4
        );
        data.stateTime = 0;
      }
      break;

    case "looking":
      // Look at player
      const lookTarget = playerPosition.clone();
      lookTarget.y = npc.position.y;
      npc.lookAt(lookTarget);

      // Wave if player is close
      if (distanceToPlayer < data.personalSpace && data.stateTime > 0.5) {
        data.state = "waving";
        data.stateTime = 0;
        if (data.emotionIndicator) {
          data.emotionIndicator.material.color.setHex(0xffeb3b); // Yellow (excited)
        }
      }

      // Return to idle if player moves away
      if (distanceToPlayer > data.detectionRadius * 1.5) {
        data.state = "idle";
        data.stateTime = 0;
        if (data.emotionIndicator) {
          data.emotionIndicator.visible = false;
        }
      }
      break;

    case "waving":
      // Animate waving (simple)
      data.emotionTime += deltaTime * 10;
      if (data.emotionIndicator) {
        data.emotionIndicator.position.y = 2.5 + Math.sin(data.emotionTime) * 0.2;
      }

      // Stop waving after 2 seconds
      if (data.stateTime > 2) {
        data.state = "looking";
        data.stateTime = 0;
      }
      break;

    case "walking":
      if (data.wanderTarget) {
        const direction = new THREE.Vector3()
          .subVectors(data.wanderTarget, npc.position)
          .normalize();

        npc.position.add(direction.multiplyScalar(0.01));
        npc.lookAt(data.wanderTarget);

        // Reached target
        if (npc.position.distanceTo(data.wanderTarget) < 0.5) {
          data.state = "idle";
          data.wanderTarget = null;
          data.stateTime = 0;
        }
      }
      break;
  }
}

/**
 * Update conversation group
 */
export function updateConversationGroup(group, deltaTime) {
  if (!group || group.name !== "ConversationGroup") return;

  group.children.forEach((npc) => {
    if (npc.userData.type === "conversing") {
      npc.userData.conversationTime += deltaTime;

      // Subtle nodding animation
      const nodAngle = Math.sin(npc.userData.conversationTime * 2 + npc.userData.animationPhase) * 0.1;
      npc.rotation.x = nodAngle;

      // Occasional gestures (move slightly)
      const gestureX = Math.sin(npc.userData.conversationTime * 0.5) * 0.05;
      npc.position.x += gestureX * 0.01;
    }
  });
}

/**
 * Update security guard
 */
export function updateSecurityGuard(guard, playerPosition, deltaTime) {
  if (!guard || !guard.userData || guard.userData.type !== "guard") return;

  const data = guard.userData;
  const distanceToPlayer = guard.position.distanceTo(playerPosition);

  // Check if player is too close to artworks
  let tooCloseToArt = false;
  if (data.artworks) {
    data.artworks.forEach((artwork) => {
      const distToArt = playerPosition.distanceTo(artwork.position);
      if (distToArt < data.warningDistance) {
        tooCloseToArt = true;
      }
    });
  }

  // State machine
  switch (data.state) {
    case "patrolling":
      // Patrol between points
      const targetPoint = data.patrolPoints[data.currentPatrolIndex];
      const direction = new THREE.Vector3()
        .subVectors(targetPoint, guard.position)
        .normalize();

      guard.position.add(direction.multiplyScalar(data.speed));
      guard.lookAt(targetPoint);

      // Reached patrol point
      if (guard.position.distanceTo(targetPoint) < 0.5) {
        data.currentPatrolIndex =
          (data.currentPatrolIndex + 1) % data.patrolPoints.length;
      }

      // Detect player too close to art
      if (tooCloseToArt && distanceToPlayer < data.detectionRadius) {
        data.state = "following";
        data.followTarget = playerPosition.clone();
      }
      break;

    case "following":
      // Follow player
      const followDir = new THREE.Vector3()
        .subVectors(playerPosition, guard.position)
        .normalize();

      guard.position.add(followDir.multiplyScalar(data.speed * 1.5));
      guard.lookAt(playerPosition);

      // Switch to warning if very close
      if (distanceToPlayer < data.warningDistance * 2) {
        data.state = "warning";
        if (data.warningIndicator) {
          data.warningIndicator.visible = true;
        }
      }

      // Return to patrol if player moves away
      if (!tooCloseToArt && distanceToPlayer > data.detectionRadius * 1.5) {
        data.state = "patrolling";
      }
      break;

    case "warning":
      // Stand and warn
      guard.lookAt(playerPosition);

      // Flash warning indicator
      if (data.warningIndicator) {
        data.warningIndicator.visible = Math.sin(Date.now() * 0.01) > 0;
      }

      // Return to following if player backs off
      if (distanceToPlayer > data.warningDistance * 3) {
        data.state = "patrolling";
        if (data.warningIndicator) {
          data.warningIndicator.visible = false;
        }
      }
      break;
  }
}
