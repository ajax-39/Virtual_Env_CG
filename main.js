/**
 * Main.js - Virtual Art Gallery
 * Three.js Interactive 3D Gallery with Lighting, Textures, Shading, and Animated Actors
 * Enhanced with Advanced Visual Effects, Interactive Features, Wildlife, and Audio
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

// Import new enhanced modules
import {
  setupPostProcessing,
  onWindowResizePostProcessing,
  PostProcessingController,
} from "./postProcessing.js";
import {
  createWindowWithGodRays,
  animateVolumetricLights,
  createDustInLightBeam,
  updateDustParticles,
} from "./volumetricLight.js";
import {
  createMirror,
  createWaterFountain,
  updateWaterFountain,
  createHologram,
  updateHologram,
  createRainEffect,
  updateRain,
} from "./advancedEffects.js";
import {
  InteractiveSculpture,
  ArtworkZoom,
  LightSwitchSystem,
  Minimap,
} from "./enhancedInteractions.js";
import {
  createBirds,
  updateBirds,
  createButterflies,
  updateButterflies,
  createAquarium,
  updateFish,
  createKineticSculpture,
  updateKineticSculpture,
} from "./wildlife.js";
import {
  AudioManager,
  FootstepController,
  createSoundEmitters,
  createAudioUI,
} from "./audioSystem.js";
import {
  createSmartNPC,
  createConversationGroup,
  createSecurityGuard,
  updateSmartNPC,
  updateConversationGroup,
  updateSecurityGuard,
} from "./enhancedNPC.js";
import {
  createTVScreen,
  updateTVScreen,
  createInfoPanel,
  createDigitalArtwork,
  updateDigitalArtwork,
  createParticleScreen,
  updateParticleScreen,
} from "./videoScreens.js";

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

    // Enhanced features
    this.postProcessing = null;
    this.composer = null;
    this.volumetricLights = null;
    this.mirror = null;
    this.waterFountain = null;
    this.hologram = null;
    this.rainEffect = null;
    this.interactiveSculpture = null;
    this.artworkZoom = null;
    this.lightSwitches = null;
    this.minimap = null;
    this.birds = null;
    this.butterflies = null;
    this.aquarium = null;
    this.kineticSculpture = null;
    this.audioManager = null;
    this.footstepController = null;
    this.dustParticles = [];

    // Enhanced NPCs and screens
    this.smartNPC = null;
    this.conversationGroup = null;
    this.securityGuard = null;
    this.tvScreen = null;
    this.infoPanel = null;
    this.digitalArtwork = null;
    this.particleScreen = null;

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
    this.setupAdvancedEffects(); // NEW
    this.setupWildlife(); // NEW
    this.setupEnhancedInteractions(); // NEW
    this.setupControls();
    this.setupInteractions();
    this.setupPostProcessing(); // NEW
    this.setupAudio(); // NEW
    this.setupUI();
    this.handleResize();
    this.hideLoadingScreen();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 20, 40);
    this.updateProgress(10);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 10);
    this.updateProgress(20);
  }

  createRenderer() {
    const canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Better color rendering
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

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

    this.particles = createParticles(
      this.scene,
      this.environment.roomWidth,
      this.environment.roomDepth,
      this.environment.roomHeight
    );

    // Create teleport points (optional)
    this.teleportPoints = createTeleportPoints(this.scene, this.camera);

    console.log("Actors and particles created");
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

  setupUI() {
    // FPS counter update
    this.fpsElement = document.getElementById("fps-value");
    this.updateProgress(95);
  }

  setupAdvancedEffects() {
    console.log("Setting up advanced visual effects...");

    // Create window with god rays
    const windowPosition = new THREE.Vector3(
      0,
      2.5,
      -this.environment.roomDepth / 2 + 0.1
    );
    this.volumetricLights = createWindowWithGodRays(
      this.scene,
      windowPosition,
      this.environment.roomHeight
    );

    // Create dust particles in light beams
    if (this.volumetricLights.rays && this.volumetricLights.rays.length > 0) {
      this.volumetricLights.rays.forEach((ray) => {
        const beamPos = new THREE.Vector3();
        const beamTarget = new THREE.Vector3();
        ray.getWorldPosition(beamPos);
        if (ray.userData.spotlight) {
          ray.userData.spotlight.target.getWorldPosition(beamTarget);
          const dust = createDustInLightBeam(this.scene, beamPos, beamTarget, 150);
          this.dustParticles.push(dust);
        }
      });
    }

    // Create reflective mirror
    const mirrorPosition = new THREE.Vector3(
      -this.environment.roomWidth / 2 + 0.1,
      2,
      0
    );
    this.mirror = createMirror(this.scene, mirrorPosition, 2.5, 3.5);

    // Create water fountain
    const fountainPosition = new THREE.Vector3(0, 0, -6);
    this.waterFountain = createWaterFountain(this.scene, fountainPosition);

    // Create hologram display
    const hologramPosition = new THREE.Vector3(-5, 0, 2);
    this.hologram = createHologram(this.scene, hologramPosition);

    // Create rain effect (optional - can be toggled)
    this.rainEffect = createRainEffect(
      this.scene,
      this.environment.roomWidth,
      this.environment.roomDepth,
      this.environment.roomHeight
    );
    this.rainEffect.visible = false; // Start disabled

    console.log("Advanced effects created");
    this.updateProgress(82);
  }

  setupWildlife() {
    console.log("Creating wildlife and kinetic sculptures...");

    // Create flying birds
    this.birds = createBirds(
      this.scene,
      12,
      this.environment.roomWidth,
      this.environment.roomDepth,
      this.environment.roomHeight
    );

    // Create butterflies
    this.butterflies = createButterflies(
      this.scene,
      8,
      this.environment.roomWidth,
      this.environment.roomDepth
    );

    // Create aquarium with fish
    const aquariumPosition = new THREE.Vector3(
      this.environment.roomWidth / 2 - 1.5,
      0,
      -2
    );
    this.aquarium = createAquarium(this.scene, aquariumPosition);

    // Create kinetic sculpture
    const kineticPosition = new THREE.Vector3(5, 0, 2);
    this.kineticSculpture = createKineticSculpture(this.scene, kineticPosition);

    // Create enhanced NPCs
    const smartNPCPos = new THREE.Vector3(-3, 0, -2);
    this.smartNPC = createSmartNPC(this.scene, smartNPCPos, this.camera);

    const conversationPos = new THREE.Vector3(6, 0, -5);
    this.conversationGroup = createConversationGroup(this.scene, conversationPos);

    const guardPos = new THREE.Vector3(-7, 0, -6);
    this.securityGuard = createSecurityGuard(
      this.scene,
      guardPos,
      this.artworks ? this.artworks.artworks : []
    );

    // Create video screens and digital displays
    const tvPos = new THREE.Vector3(
      this.environment.roomWidth / 2 - 0.5,
      2,
      -5
    );
    this.tvScreen = createTVScreen(this.scene, tvPos, Math.PI / 2);

    const infoPanelPos = new THREE.Vector3(
      -this.environment.roomWidth / 2 + 0.5,
      1.5,
      -5
    );
    this.infoPanel = createInfoPanel(this.scene, infoPanelPos, -Math.PI / 2);

    const digitalArtPos = new THREE.Vector3(3, 2, this.environment.roomDepth / 2 - 0.5);
    this.digitalArtwork = createDigitalArtwork(this.scene, digitalArtPos);

    const particleScreenPos = new THREE.Vector3(-6, 2, this.environment.roomDepth / 2 - 0.5);
    this.particleScreen = createParticleScreen(this.scene, particleScreenPos);

    console.log("Wildlife, NPCs, and digital displays created");
    this.updateProgress(84);
  }

  setupEnhancedInteractions() {
    console.log("Setting up enhanced interactions...");

    // Create interactive sculpture
    const sculpturePosition = new THREE.Vector3(3, 0, -4);
    this.interactiveSculpture = new InteractiveSculpture(
      this.scene,
      sculpturePosition
    );

    // Setup artwork zoom feature
    this.artworkZoom = new ArtworkZoom(this.camera, this.cameraController);

    // Create light switches
    if (this.lighting.spotlights) {
      this.lightSwitches = new LightSwitchSystem(
        this.scene,
        this.lighting.spotlights
      );
    }

    // Setup event listeners for interactive sculpture
    this.setupInteractiveSculptureEvents();

    console.log("Enhanced interactions setup complete");
    this.updateProgress(86);
  }

  setupInteractiveSculptureEvents() {
    const self = this;

    this.renderer.domElement.addEventListener("mousedown", (e) => {
      if (self.interactiveSculpture) {
        self.interactiveSculpture.onMouseDown(e, self.camera, self.renderer);
      }
    });

    this.renderer.domElement.addEventListener("mousemove", (e) => {
      if (self.interactiveSculpture) {
        self.interactiveSculpture.onMouseMove(e, self.camera, self.renderer);
      }
    });

    this.renderer.domElement.addEventListener("mouseup", (e) => {
      if (self.interactiveSculpture) {
        self.interactiveSculpture.onMouseUp();
      }
    });

    // Double-click for artwork zoom
    this.renderer.domElement.addEventListener("dblclick", (e) => {
      if (self.artworkZoom && !self.artworkZoom.isZooming) {
        // Raycast to find clicked artwork
        const mouse = self.getMousePosition(e);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, self.camera);

        const artworkObjects = [];
        self.artworks.artworks.forEach((artwork) => {
          artwork.traverse((child) => {
            if (child.isMesh) artworkObjects.push(child);
          });
        });

        const intersects = raycaster.intersectObjects(artworkObjects);
        if (intersects.length > 0) {
          let artwork = intersects[0].object;
          while (artwork && !artwork.userData.isArtwork) {
            artwork = artwork.parent;
          }
          if (artwork) {
            self.artworkZoom.zoomToArtwork(artwork);
          }
        }
      } else if (self.artworkZoom) {
        self.artworkZoom.zoomOut();
      }
    });

    // Light switch interaction
    this.renderer.domElement.addEventListener("click", (e) => {
      if (self.lightSwitches) {
        const mouse = self.getMousePosition(e);
        self.lightSwitches.handleClick(mouse, self.camera, self.renderer);
      }
    });
  }

  setupPostProcessing() {
    console.log("Setting up post-processing effects...");

    // Setup post-processing pipeline
    this.postProcessing = setupPostProcessing(
      this.renderer,
      this.scene,
      this.camera
    );
    this.composer = this.postProcessing.composer;

    // Create UI controls for post-processing
    new PostProcessingController(
      this.composer,
      this.postProcessing.ssaoPass,
      this.postProcessing.bloomPass
    );

    console.log("Post-processing setup complete");
    this.updateProgress(88);
  }

  setupAudio() {
    console.log("Setting up audio system...");

    // Create audio manager
    this.audioManager = new AudioManager(this.camera);

    // Create footstep controller
    this.footstepController = new FootstepController(this.audioManager);

    // Create sound emitters in the scene
    createSoundEmitters(this.scene, this.audioManager);

    // Create audio UI controls
    createAudioUI(this.audioManager);

    console.log("Audio system initialized");
    this.updateProgress(90);
  }

  getMousePosition(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  }

  setupUI() {
    // FPS counter update
    this.fpsElement = document.getElementById("fps-value");

    // Create minimap
    this.minimap = new Minimap(
      this.camera,
      this.environment.roomWidth,
      this.environment.roomDepth
    );

    // Add weather toggle button
    this.createWeatherToggle();

    this.updateProgress(95);
  }

  createWeatherToggle() {
    const button = document.createElement("button");
    button.textContent = "☔ Toggle Rain";
    button.style.cssText = `
      position: absolute;
      bottom: 80px;
      left: 20px;
      padding: 10px 20px;
      background: rgba(33, 150, 243, 0.9);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      z-index: 100;
      font-family: Arial, sans-serif;
    `;

    button.addEventListener("click", () => {
      if (this.rainEffect) {
        this.rainEffect.visible = !this.rainEffect.visible;
        button.style.background = this.rainEffect.visible
          ? "rgba(76, 175, 80, 0.9)"
          : "rgba(33, 150, 243, 0.9)";
      }
    });

    document.body.appendChild(button);
  }

  handleResize() {
    window.addEventListener("resize", () => {
      // Update camera
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Update post-processing
      if (this.composer && this.postProcessing) {
        onWindowResizePostProcessing(
          this.composer,
          this.camera,
          this.postProcessing.fxaaPass
        );
      }
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

    // Update particles
    updateParticles(this.particles, deltaTime);

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

    // === NEW: Update advanced effects ===
    
    // Update volumetric lights
    if (this.volumetricLights && this.volumetricLights.rays) {
      animateVolumetricLights(this.volumetricLights.rays, elapsedTime);
    }

    // Update dust particles in light beams
    this.dustParticles.forEach((dust) => {
      updateDustParticles(dust, deltaTime);
    });

    // Update water fountain
    if (this.waterFountain) {
      updateWaterFountain(this.waterFountain, deltaTime);
    }

    // Update hologram
    if (this.hologram) {
      updateHologram(this.hologram, deltaTime);
    }

    // Update rain effect
    if (this.rainEffect && this.rainEffect.visible) {
      updateRain(this.rainEffect, deltaTime);
    }

    // Update interactive sculpture
    if (this.interactiveSculpture) {
      this.interactiveSculpture.update();
    }

    // Update artwork zoom
    if (this.artworkZoom) {
      this.artworkZoom.update(deltaTime);
    }

    // Update wildlife
    if (this.birds) {
      updateBirds(this.birds, deltaTime);
    }

    if (this.butterflies) {
      updateButterflies(this.butterflies, deltaTime);
    }

    if (this.aquarium && this.aquarium.fish) {
      updateFish(this.aquarium.fish, deltaTime);
    }

    // Update kinetic sculpture
    if (this.kineticSculpture) {
      updateKineticSculpture(this.kineticSculpture, deltaTime);
    }

    // Update enhanced NPCs
    if (this.smartNPC) {
      updateSmartNPC(this.smartNPC, this.camera.position, deltaTime);
    }

    if (this.conversationGroup) {
      updateConversationGroup(this.conversationGroup, deltaTime);
    }

    if (this.securityGuard) {
      updateSecurityGuard(this.securityGuard, this.camera.position, deltaTime);
    }

    // Update video screens and digital displays
    if (this.tvScreen) {
      updateTVScreen(this.tvScreen, deltaTime);
    }

    if (this.digitalArtwork) {
      updateDigitalArtwork(this.digitalArtwork, deltaTime);
    }

    if (this.particleScreen) {
      updateParticleScreen(this.particleScreen, deltaTime);
    }

    // Update minimap
    if (this.minimap) {
      const npcs = [];
      if (this.actors) {
        if (this.actors.standingVisitor) npcs.push(this.actors.standingVisitor);
        if (this.actors.walkingVisitor) npcs.push(this.actors.walkingVisitor);
      }
      if (this.smartNPC) npcs.push(this.smartNPC);
      if (this.securityGuard) npcs.push(this.securityGuard);
      this.minimap.update(this.camera.position, npcs);
    }

    // Update audio
    if (this.audioManager) {
      this.audioManager.update();
    }

    // Play footstep sounds based on movement
    if (
      this.footstepController &&
      this.cameraController.firstPersonMode &&
      this.cameraController.moveState
    ) {
      const velocity = new THREE.Vector3(
        this.cameraController.moveState.forward - this.cameraController.moveState.backward,
        0,
        this.cameraController.moveState.left - this.cameraController.moveState.right
      );
      this.footstepController.playFootstep(velocity);
    }

    // Update FPS counter
    const fps = this.fpsCounter.update();
    if (this.fpsElement) {
      this.fpsElement.textContent = fps;

      // Color code FPS
      if (fps >= 50) {
        this.fpsElement.style.color = "#4CAF50";
      } else if (fps >= 30) {
        this.fpsElement.style.color = "#FFC107";
      } else {
        this.fpsElement.style.color = "#F44336";
      }
    }

    // Render scene with post-processing
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Initialize application when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Enhanced Virtual Art Gallery...");
  const gallery = new VirtualGallery();

  // Make gallery accessible globally for debugging
  window.gallery = gallery;

  console.log("Controls:");
  console.log("- Mouse: Look around / Orbit / Drag sculpture");
  console.log("- WASD: Move (First-Person Mode)");
  console.log("- C: Toggle camera mode");
  console.log("- Scroll: Zoom in/out (Orbit Mode)");
  console.log("- Click: Interact with artworks and light switches");
  console.log("- Double-Click: Zoom to artwork");
  console.log("- Drag sculpture: Rotate interactive sculpture");
  console.log("\nNew Features:");
  console.log("✨ Post-processing effects (Bloom, SSAO)");
  console.log("☀️ Volumetric lighting (god rays)");
  console.log("🪞 Reflective mirror");
  console.log("⛲ Animated water fountain");
  console.log("🌐 Holographic display");
  console.log("🐦 Flying birds with flocking behavior");
  console.log("🦋 Butterflies");
  console.log("🐠 Aquarium with swimming fish");
  console.log("⚙️ Kinetic sculpture with gears");
  console.log("🎵 Spatial audio system");
  console.log("🗺️ Minimap");
  console.log("💡 Interactive light switches");
});

// Add helpful console styling
const styles = ["color: #4CAF50", "font-size: 16px", "font-weight: bold"].join(";");

console.log("%c🎨 Enhanced Virtual Art Gallery Initialized", styles);
console.log(
  "%cExplore the gallery with all new interactive features!",
  "color: #2196F3; font-size: 12px; font-weight: bold"
);
console.log(
  "%cFeatures: Post-processing • Volumetric Lighting • Wildlife • Audio • Interactive Elements",
  "color: #FF9800; font-size: 11px"
);
