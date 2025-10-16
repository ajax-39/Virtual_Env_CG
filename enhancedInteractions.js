/**
 * Enhanced Interactivity - Sculpture rotation, zoom, light switches, minimap
 */

import * as THREE from "three";

/**
 * Interactive Sculpture Controller
 */
export class InteractiveSculpture {
  constructor(scene, position) {
    this.scene = scene;
    this.sculpture = this.createSculpture();
    this.sculpture.position.copy(position);
    this.sculpture.position.y = 1.2;

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0 };
    this.damping = 0.95;

    scene.add(this.sculpture);
  }

  createSculpture() {
    const group = new THREE.Group();
    group.userData.isInteractive = true;
    group.userData.type = "sculpture";

    // Create abstract geometric sculpture
    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        roughness: 0.3,
        metalness: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x4ecdc4,
        roughness: 0.3,
        metalness: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xffe66d,
        roughness: 0.3,
        metalness: 0.7,
      }),
    ];

    // Main sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      materials[0]
    );
    sphere.castShadow = true;
    group.add(sphere);

    // Rotating rings
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.5 + i * 0.1, 0.05, 16, 32),
        materials[i % 3]
      );
      ring.rotation.x = (Math.PI / 3) * i;
      ring.rotation.y = (Math.PI / 4) * i;
      ring.castShadow = true;
      group.add(ring);
    }

    // Hover glow
    const glowGeometry = new THREE.SphereGeometry(0.9, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    group.userData.glow = glow;

    return group;
  }

  onMouseDown(event, camera, renderer) {
    const mouse = this.getMousePosition(event, renderer);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(this.sculpture, true);
    if (intersects.length > 0) {
      this.isDragging = true;
      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      renderer.domElement.style.cursor = "grabbing";
    }
  }

  onMouseMove(event, camera, renderer) {
    const mouse = this.getMousePosition(event, renderer);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(this.sculpture, true);

    // Hover effect
    if (intersects.length > 0 && !this.isDragging) {
      renderer.domElement.style.cursor = "grab";
      if (this.sculpture.userData.glow) {
        this.sculpture.userData.glow.material.opacity = 0.2;
      }
    } else if (!this.isDragging) {
      renderer.domElement.style.cursor = "default";
      if (this.sculpture.userData.glow) {
        this.sculpture.userData.glow.material.opacity = 0;
      }
    }

    // Dragging rotation
    if (this.isDragging) {
      const deltaX = event.clientX - this.previousMousePosition.x;
      const deltaY = event.clientY - this.previousMousePosition.y;

      this.rotationVelocity.y = deltaX * 0.01;
      this.rotationVelocity.x = deltaY * 0.01;

      this.sculpture.rotation.y += this.rotationVelocity.y;
      this.sculpture.rotation.x += this.rotationVelocity.x;

      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  update() {
    if (!this.isDragging) {
      // Apply momentum and damping
      this.sculpture.rotation.y += this.rotationVelocity.y;
      this.sculpture.rotation.x += this.rotationVelocity.x;

      this.rotationVelocity.x *= this.damping;
      this.rotationVelocity.y *= this.damping;
    }
  }

  getMousePosition(event, renderer) {
    const rect = renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  }
}

/**
 * Artwork Zoom Feature
 */
export class ArtworkZoom {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.isZooming = false;
    this.originalPosition = new THREE.Vector3();
    this.originalTarget = new THREE.Vector3();
    this.zoomDuration = 1.0;
    this.zoomProgress = 0;
    this.targetArtwork = null;
  }

  zoomToArtwork(artwork) {
    if (this.isZooming) return;

    this.isZooming = true;
    this.zoomProgress = 0;
    this.targetArtwork = artwork;

    // Store original camera position
    this.originalPosition.copy(this.camera.position);
    if (this.controls.target) {
      this.originalTarget.copy(this.controls.target);
    }
  }

  zoomOut() {
    if (!this.isZooming) return;

    this.isZooming = false;
    this.zoomProgress = 0;
  }

  update(deltaTime) {
    if (!this.isZooming || !this.targetArtwork) return;

    this.zoomProgress += deltaTime / this.zoomDuration;

    if (this.zoomProgress >= 1.0) {
      this.zoomProgress = 1.0;
    }

    // Smooth easing function
    const t = this.easeInOutCubic(this.zoomProgress);

    // Calculate target position (in front of artwork)
    const artworkPos = new THREE.Vector3();
    this.targetArtwork.getWorldPosition(artworkPos);

    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(this.targetArtwork.quaternion);

    const targetPos = artworkPos.clone().add(direction.multiplyScalar(2));
    const targetLookAt = artworkPos;

    // Interpolate camera position
    this.camera.position.lerpVectors(this.originalPosition, targetPos, t);

    if (this.controls.target) {
      this.controls.target.lerpVectors(
        this.originalTarget,
        targetLookAt,
        t
      );
    }
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

/**
 * Light Switch System
 */
export class LightSwitchSystem {
  constructor(scene, lights) {
    this.scene = scene;
    this.lights = lights;
    this.switches = [];

    this.createSwitches();
  }

  createSwitches() {
    // Create switches for each spotlight
    this.lights.forEach((light, index) => {
      const switchObj = this.createSwitch(light, index);
      this.switches.push(switchObj);
    });
  }

  createSwitch(light, index) {
    const group = new THREE.Group();

    // Switch plate
    const plateGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.05);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.5,
      metalness: 0.1,
    });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    group.add(plate);

    // Toggle button
    const buttonGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.03);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: light.visible ? 0x4caf50 : 0xf44336,
      roughness: 0.4,
      metalness: 0.3,
    });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.z = 0.04;
    button.position.y = light.visible ? 0.03 : -0.03;
    group.add(button);

    // Indicator light
    const indicatorGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const indicatorMaterial = new THREE.MeshBasicMaterial({
      color: light.visible ? 0x00ff00 : 0xff0000,
    });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.set(0, 0.1, 0.04);
    group.add(indicator);

    // Position near the light's target
    const lightWorldPos = new THREE.Vector3();
    light.target.getWorldPosition(lightWorldPos);
    group.position.set(lightWorldPos.x, 1.5, lightWorldPos.z - 0.5);

    group.userData = {
      isSwitch: true,
      light: light,
      button: button,
      indicator: indicator,
      buttonMaterial: buttonMaterial,
      indicatorMaterial: indicatorMaterial,
    };

    this.scene.add(group);
    return group;
  }

  toggle(switchObj) {
    const light = switchObj.userData.light;
    light.visible = !light.visible;

    // Update switch appearance
    const button = switchObj.userData.button;
    const indicator = switchObj.userData.indicator;

    button.position.y = light.visible ? 0.03 : -0.03;
    switchObj.userData.buttonMaterial.color.setHex(
      light.visible ? 0x4caf50 : 0xf44336
    );
    switchObj.userData.indicatorMaterial.color.setHex(
      light.visible ? 0x00ff00 : 0xff0000
    );
  }

  handleClick(mouse, camera, renderer) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      this.switches.map((s) => s.children).flat()
    );

    if (intersects.length > 0) {
      let switchObj = intersects[0].object;
      while (switchObj && !switchObj.userData.isSwitch) {
        switchObj = switchObj.parent;
      }

      if (switchObj && switchObj.userData.isSwitch) {
        this.toggle(switchObj);
        return true;
      }
    }
    return false;
  }
}

/**
 * Minimap System
 */
export class Minimap {
  constructor(camera, roomWidth, roomDepth) {
    this.camera = camera;
    this.roomWidth = roomWidth;
    this.roomDepth = roomDepth;

    this.canvas = document.createElement("canvas");
    this.canvas.width = 200;
    this.canvas.height = 150;
    this.canvas.style.cssText = `
      position: absolute;
      bottom: 20px;
      right: 20px;
      border: 3px solid rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.7);
      z-index: 100;
    `;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
  }

  update(playerPosition, npcs = []) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.fillStyle = "rgba(20, 20, 30, 0.9)";
    ctx.fillRect(0, 0, width, height);

    // Draw room outline
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Draw player
    const playerX =
      ((playerPosition.x + this.roomWidth / 2) / this.roomWidth) *
        (width - 20) +
      10;
    const playerZ =
      ((playerPosition.z + this.roomDepth / 2) / this.roomDepth) *
        (height - 20) +
      10;

    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.arc(playerX, playerZ, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw player direction
    ctx.strokeStyle = "#4caf50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playerX, playerZ);
    const angle = Math.atan2(
      this.camera.getWorldDirection(new THREE.Vector3()).x,
      this.camera.getWorldDirection(new THREE.Vector3()).z
    );
    ctx.lineTo(playerX + Math.sin(angle) * 10, playerZ + Math.cos(angle) * 10);
    ctx.stroke();

    // Draw NPCs
    npcs.forEach((npc) => {
      const npcX =
        ((npc.position.x + this.roomWidth / 2) / this.roomWidth) *
          (width - 20) +
        10;
      const npcZ =
        ((npc.position.z + this.roomDepth / 2) / this.roomDepth) *
          (height - 20) +
        10;

      ctx.fillStyle = "#ff6b6b";
      ctx.beginPath();
      ctx.arc(npcX, npcZ, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw label
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText("MINIMAP", 15, height - 10);
  }

  destroy() {
    document.body.removeChild(this.canvas);
  }
}
