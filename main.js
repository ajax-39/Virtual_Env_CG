/**
 * Main.js - Virtual Art Gallery
 * Three.js Interactive 3D Gallery with Advanced Features
 */

import * as THREE from "three";
import { createEnvironment } from "./environment.js";
import { setupLighting, DayNightCycle } from "./lighting.js";
import { createArtworks, animateHotspots } from "./artworks.js";
import {
  createActors,
  createParticles,
  updateActors,
  updateParticles,
} from "./actors.js";
import { CameraController } from "./controls.js";
import {
  InteractionManager,
  createTeleportPoints,
  animateTeleportPoints,
} from "./interactions.js";
import { FPSCounter } from "./utils.js";

/**
 * Application class
 */
class VirtualGallery {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cameraController = null;
    this.interactionManager = null;
    this.clock = new THREE.Clock();
    this.fpsCounter = new FPSCounter();

    // Scene objects
    this.environment = null;
    this.lighting = null;
    this.artworks = null;
    this.actors = null;
    this.particles = null;
    this.teleportPoints = null;

    // Loading
    this.loadingScreen = document.getElementById("loading-screen");
    this.progressFill = document.getElementById("progress-fill");
    this.progressText = document.getElementById("progress-text");

    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setupEnvironment();
    this.setupLighting();
    this.setupArtworks();
    this.setupActors();
    this.setupControls();
    this.setupInteractions();
    this.handleResize();
    this.hideLoadingScreen();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 25, 50);
    this.updateProgress(10);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Set camera to first-person eye level at entrance
    this.camera.position.set(0, 1.6, 8);
    this.camera.lookAt(0, 1.6, 0);
    this.updateProgress(20);
  }

  createRenderer() {
    const canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Better color rendering
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.updateProgress(30);
  }

  setupEnvironment() {
    this.environment = createEnvironment(this.scene);
    console.log("Environment created");
    this.updateProgress(45);
  }

  setupLighting() {
    this.lighting = setupLighting(
      this.scene,
      this.environment.roomWidth,
      this.environment.roomDepth,
      this.environment.roomHeight
    );

    // Optional: Setup day/night cycle
    this.dayNightCycle = new DayNightCycle(
      this.lighting.directionalLight,
      this.lighting.ambientLight
    );

    console.log("Lighting setup complete");
    this.updateProgress(60);
  }

  setupArtworks() {
    this.artworks = createArtworks(
      this.scene,
      this.environment.roomWidth,
      this.environment.roomDepth
    );
    console.log("Artworks created");
    this.updateProgress(70);
  }

  setupActors() {
    this.actors = createActors(
      this.scene,
      this.environment.roomWidth,
      this.environment.roomDepth,
      this.environment.roomHeight
    );

    // Particles disabled
    // this.particles = createParticles(
    //   this.scene,
    //   this.environment.roomWidth,
    //   this.environment.roomDepth,
    //   this.environment.roomHeight
    // );

    // Create teleport points (optional)
    this.teleportPoints = createTeleportPoints(this.scene, this.camera);

    console.log("Actors created");
    this.updateProgress(80);
  }

  setupControls() {
    this.cameraController = new CameraController(
      this.camera,
      this.renderer,
      this.environment.roomHeight
    );
    console.log("Camera controls initialized");
    this.updateProgress(85);
  }

  setupInteractions() {
    this.interactionManager = new InteractionManager(
      this.camera,
      this.renderer,
      this.artworks.artworks
    );
    console.log("Interaction system initialized");
    this.updateProgress(90);
  }

  handleResize() {
    window.addEventListener("resize", () => {
      // Update camera
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  updateProgress(percent) {
    this.progressFill.style.width = `${percent}%`;
    this.progressText.textContent = `${percent}%`;
  }

  hideLoadingScreen() {
    setTimeout(() => {
      this.loadingScreen.classList.add("hidden");
      console.log("Gallery loaded successfully!");
    }, 500);
    this.updateProgress(100);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Update controls
    this.cameraController.update(deltaTime);

    // Update actors
    updateActors(this.actors, deltaTime);

    // Update particles - disabled
    // updateParticles(this.particles, deltaTime);

    // Animate hotspots
    animateHotspots(this.artworks.artworks, elapsedTime);

    // Animate teleport points
    if (this.teleportPoints) {
      animateTeleportPoints(this.teleportPoints, elapsedTime);
    }

    // Update day/night cycle (if enabled)
    if (this.dayNightCycle) {
      this.dayNightCycle.update(deltaTime);
    }

    // Update interactions
    this.interactionManager.update();

    // Update FPS counter
    const fps = this.fpsCounter.update();
    const fpsElement = document.getElementById("fps-value");
    if (fpsElement) {
      fpsElement.textContent = fps;

      // Color code FPS
      if (fps >= 50) {
        fpsElement.style.color = "#4CAF50";
      } else if (fps >= 30) {
        fpsElement.style.color = "#FFC107";
      } else {
        fpsElement.style.color = "#F44336";
      }
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize application when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Virtual Art Gallery...");
  const gallery = new VirtualGallery();

  // Make gallery accessible globally for debugging
  window.gallery = gallery;

  console.log("Controls:");
  console.log("- Mouse: Look around / Orbit");
  console.log("- WASD: Move (First-Person Mode)");
  console.log("- C: Toggle camera mode");
  console.log("- Scroll: Zoom in/out (Orbit Mode)");
  console.log("- Click: Interact with artworks");
});

// Add helpful console styling
const styles = ["color: #4CAF50", "font-size: 14px", "font-weight: bold"].join(
  ";"
);

console.log("%c🎨 Virtual Art Gallery Initialized", styles);
console.log(
  "%cExplore the gallery and interact with the artworks!",
  "color: #2196F3; font-size: 12px"
);
