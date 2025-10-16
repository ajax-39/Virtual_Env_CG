/**
 * Camera controls - Orbit and First-Person modes
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export class CameraController {
  constructor(camera, renderer, roomHeight) {
    this.camera = camera;
    this.renderer = renderer;
    this.roomHeight = roomHeight;
    this.mode = "orbit"; // 'orbit' or 'firstPerson'

    // Orbit controls
    this.orbitControls = new OrbitControls(camera, renderer.domElement);
    this.setupOrbitControls();

    // First-person controls
    this.pointerLockControls = new PointerLockControls(
      camera,
      renderer.domElement
    );
    this.setupPointerLockControls();

    // Movement state for first-person
    this.moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    this.moveSpeed = 5.0;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Setup keyboard controls
    this.setupKeyboardControls();

    // UI elements
    this.crosshair = document.getElementById("crosshair");
    this.cameraModeText = document.getElementById("camera-mode");
  }

  setupOrbitControls() {
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.minDistance = 3;
    this.orbitControls.maxDistance = 25;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going under floor
    this.orbitControls.enablePan = true;
    this.orbitControls.autoRotate = false;
    this.orbitControls.autoRotateSpeed = 0.5;

    // Set initial position
    this.camera.position.set(0, 1.6, 10);
    this.orbitControls.target.set(0, 1.6, 0);
    this.orbitControls.update();
  }

  setupPointerLockControls() {
    const self = this;

    // Click to lock pointer
    this.renderer.domElement.addEventListener("click", () => {
      if (self.mode === "firstPerson" && !self.pointerLockControls.isLocked) {
        self.pointerLockControls.lock();
      }
    });

    // Lock/unlock events
    this.pointerLockControls.addEventListener("lock", () => {
      console.log("Pointer locked");
    });

    this.pointerLockControls.addEventListener("unlock", () => {
      console.log("Pointer unlocked");
    });
  }

  setupKeyboardControls() {
    const self = this;

    // Keydown
    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyW":
          self.moveState.forward = true;
          break;
        case "KeyS":
          self.moveState.backward = true;
          break;
        case "KeyA":
          self.moveState.left = true;
          break;
        case "KeyD":
          self.moveState.right = true;
          break;
        case "KeyC":
          self.toggleCameraMode();
          break;
      }
    });

    // Keyup
    document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          self.moveState.forward = false;
          break;
        case "KeyS":
          self.moveState.backward = false;
          break;
        case "KeyA":
          self.moveState.left = false;
          break;
        case "KeyD":
          self.moveState.right = false;
          break;
      }
    });
  }

  toggleCameraMode() {
    if (this.mode === "orbit") {
      // Switch to first-person
      this.mode = "firstPerson";
      this.orbitControls.enabled = false;

      // Set camera to eye level
      this.camera.position.y = 1.6;

      // Lock pointer
      this.pointerLockControls.lock();

      // Show crosshair
      this.crosshair.classList.remove("hidden");
      this.cameraModeText.textContent = "Mode: First-Person (WASD to move)";

      console.log("Switched to First-Person mode");
    } else {
      // Switch to orbit
      this.mode = "orbit";
      this.orbitControls.enabled = true;

      // Unlock pointer
      if (this.pointerLockControls.isLocked) {
        this.pointerLockControls.unlock();
      }

      // Hide crosshair
      this.crosshair.classList.add("hidden");
      this.cameraModeText.textContent = "Mode: Orbit";

      console.log("Switched to Orbit mode");
    }
  }

  update(deltaTime) {
    if (this.mode === "orbit") {
      this.orbitControls.update();
    } else if (
      this.mode === "firstPerson" &&
      this.pointerLockControls.isLocked
    ) {
      this.updateFirstPersonMovement(deltaTime);
    }
  }

  updateFirstPersonMovement(deltaTime) {
    // Decay velocity
    this.velocity.x -= this.velocity.x * 10.0 * deltaTime;
    this.velocity.z -= this.velocity.z * 10.0 * deltaTime;

    // Calculate movement direction
    this.direction.z =
      Number(this.moveState.forward) - Number(this.moveState.backward);
    this.direction.x =
      Number(this.moveState.right) - Number(this.moveState.left);
    this.direction.normalize();

    // Apply movement
    if (this.moveState.forward || this.moveState.backward) {
      this.velocity.z -= this.direction.z * this.moveSpeed * deltaTime;
    }
    if (this.moveState.left || this.moveState.right) {
      this.velocity.x -= this.direction.x * this.moveSpeed * deltaTime;
    }

    // Move camera
    this.pointerLockControls.moveRight(-this.velocity.x * deltaTime);
    this.pointerLockControls.moveForward(-this.velocity.z * deltaTime);

    // Keep camera at eye level
    this.camera.position.y = 1.6;

    // Simple collision detection (keep within room bounds)
    const maxX = 9.5;
    const maxZ = 7;
    this.camera.position.x = Math.max(
      -maxX,
      Math.min(maxX, this.camera.position.x)
    );
    this.camera.position.z = Math.max(
      -maxZ,
      Math.min(maxZ, this.camera.position.z)
    );
  }

  getCamera() {
    return this.camera;
  }

  getMode() {
    return this.mode;
  }
}
