/**
 * Interactive Exhibits - Rotatable sculptures, Picture zoom, Audio guides, Light switches
 */

import * as THREE from "three";

/**
 * Enhanced Interaction Manager for Exhibits
 */
export class ExhibitInteractionManager {
  constructor(camera, renderer, scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Interaction states
    this.isDragging = false;
    this.draggedObject = null;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationSpeed = 0.005;

    // Collections
    this.rotatableObjects = [];
    this.zoomableObjects = [];
    this.audioGuides = [];
    this.lightSwitches = [];

    // Audio
    this.currentAudio = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.renderer.domElement.addEventListener("mousedown", (e) =>
      this.onMouseDown(e)
    );
    this.renderer.domElement.addEventListener("mousemove", (e) =>
      this.onMouseMove(e)
    );
    this.renderer.domElement.addEventListener("mouseup", (e) =>
      this.onMouseUp(e)
    );
    this.renderer.domElement.addEventListener("dblclick", (e) =>
      this.onDoubleClick(e)
    );
    this.renderer.domElement.addEventListener("click", (e) => this.onClick(e));
  }

  /**
   * Register rotatable sculpture
   */
  addRotatableObject(object, label = "Sculpture") {
    object.userData.rotatable = true;
    object.userData.label = label;
    this.rotatableObjects.push(object);
  }

  /**
   * Register zoomable picture
   */
  addZoomableObject(object, imageUrl, title, description) {
    object.userData.zoomable = true;
    object.userData.imageUrl = imageUrl;
    object.userData.title = title;
    object.userData.description = description;
    this.zoomableObjects.push(object);
  }

  /**
   * Register audio guide point
   */
  addAudioGuide(position, audioUrl, title, transcript) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      emissive: 0x2980b9,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7,
    });

    const audioSphere = new THREE.Mesh(geometry, material);
    audioSphere.position.copy(position);
    audioSphere.userData.audioGuide = true;
    audioSphere.userData.audioUrl = audioUrl;
    audioSphere.userData.title = title;
    audioSphere.userData.transcript = transcript;

    // Add pulsing ring
    const ringGeometry = new THREE.RingGeometry(0.25, 0.3, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.1;
    audioSphere.add(ring);
    audioSphere.userData.ring = ring;

    this.audioGuides.push(audioSphere);
    this.scene.add(audioSphere);

    return audioSphere;
  }

  /**
   * Create light switch
   */
  createLightSwitch(position, targetLights, label = "Light Switch") {
    const switchGroup = new THREE.Group();

    // Switch base
    const baseGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.05);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.5,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    switchGroup.add(base);

    // Switch toggle
    const toggleGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.03);
    const toggleMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
    });
    const toggle = new THREE.Mesh(toggleGeometry, toggleMaterial);
    toggle.position.z = 0.04;
    toggle.rotation.x = -0.3; // Initially on position
    switchGroup.add(toggle);

    switchGroup.position.copy(position);
    switchGroup.userData.lightSwitch = true;
    switchGroup.userData.targetLights = targetLights;
    switchGroup.userData.isOn = true;
    switchGroup.userData.toggle = toggle;
    switchGroup.userData.label = label;

    this.lightSwitches.push(switchGroup);
    this.scene.add(switchGroup);

    return switchGroup;
  }

  /**
   * Mouse down handler
   */
  onMouseDown(event) {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.rotatableObjects,
      true
    );

    if (intersects.length > 0) {
      const object = this.findRotatableParent(intersects[0].object);
      if (object && object.userData.rotatable) {
        this.isDragging = true;
        this.draggedObject = object;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
        this.renderer.domElement.style.cursor = "grabbing";

        // Highlight object
        this.highlightObject(object, true);
      }
    }
  }

  /**
   * Mouse move handler
   */
  onMouseMove(event) {
    this.updateMousePosition(event);

    if (this.isDragging && this.draggedObject) {
      const deltaX = event.clientX - this.previousMousePosition.x;
      const deltaY = event.clientY - this.previousMousePosition.y;

      this.draggedObject.rotation.y += deltaX * this.rotationSpeed;
      this.draggedObject.rotation.x += deltaY * this.rotationSpeed;

      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    } else {
      // Hover effect
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const allInteractables = [
        ...this.rotatableObjects,
        ...this.zoomableObjects,
        ...this.audioGuides,
        ...this.lightSwitches,
      ];

      const intersects = this.raycaster.intersectObjects(
        allInteractables,
        true
      );

      if (intersects.length > 0) {
        this.renderer.domElement.style.cursor = "pointer";
      } else {
        this.renderer.domElement.style.cursor = "default";
      }
    }
  }

  /**
   * Mouse up handler
   */
  onMouseUp(event) {
    if (this.isDragging && this.draggedObject) {
      this.highlightObject(this.draggedObject, false);
      this.isDragging = false;
      this.draggedObject = null;
      this.renderer.domElement.style.cursor = "default";
    }
  }

  /**
   * Double-click handler for zoom
   */
  onDoubleClick(event) {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.zoomableObjects,
      true
    );

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const parent = this.findZoomableParent(object);

      if (parent && parent.userData.zoomable) {
        this.showZoomModal(parent);
      }
    }
  }

  /**
   * Click handler for switches and audio
   */
  onClick(event) {
    if (this.isDragging) return; // Don't trigger on drag release

    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check light switches
    const switchIntersects = this.raycaster.intersectObjects(
      this.lightSwitches,
      true
    );
    if (switchIntersects.length > 0) {
      const switchObj = this.findSwitchParent(switchIntersects[0].object);
      if (switchObj) {
        this.toggleLightSwitch(switchObj);
        return;
      }
    }

    // Check audio guides
    const audioIntersects = this.raycaster.intersectObjects(
      this.audioGuides,
      true
    );
    if (audioIntersects.length > 0) {
      const audioObj = this.findAudioGuideParent(audioIntersects[0].object);
      if (audioObj) {
        this.playAudioGuide(audioObj);
      }
    }
  }

  /**
   * Toggle light switch
   */
  toggleLightSwitch(switchObj) {
    const isOn = switchObj.userData.isOn;
    const toggle = switchObj.userData.toggle;
    const lights = switchObj.userData.targetLights;

    // Toggle state
    switchObj.userData.isOn = !isOn;

    // Animate toggle
    toggle.rotation.x = !isOn ? -0.3 : 0.3;

    // Toggle lights
    lights.forEach((light) => {
      if (light.intensity !== undefined) {
        light.intensity = !isOn ? light.userData.originalIntensity || 1.0 : 0;
        if (isOn) {
          light.userData.originalIntensity = light.intensity;
        }
      }
    });

    console.log(`Light switch ${!isOn ? "ON" : "OFF"}`);
  }

  /**
   * Play audio guide
   */
  playAudioGuide(audioObj) {
    // Stop current audio if playing
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    // Create modal for audio guide
    this.showAudioGuideModal(audioObj);

    // Play audio (simulated - replace with actual audio file)
    console.log(`Playing audio guide: ${audioObj.userData.title}`);

    // Pulse effect
    const originalColor = audioObj.material.emissive.getHex();
    audioObj.material.emissive.setHex(0x00ff00);
    setTimeout(() => {
      audioObj.material.emissive.setHex(originalColor);
    }, 300);
  }

  /**
   * Show zoom modal for pictures
   */
  showZoomModal(object) {
    const modal =
      document.getElementById("zoom-modal") || this.createZoomModal();
    const img = modal.querySelector("#zoom-image");
    const title = modal.querySelector("#zoom-title");
    const desc = modal.querySelector("#zoom-description");

    img.src = object.userData.imageUrl || "placeholder.jpg";
    title.textContent = object.userData.title || "Artwork";
    desc.textContent =
      object.userData.description || "No description available.";

    modal.classList.remove("hidden");
  }

  /**
   * Show audio guide modal
   */
  showAudioGuideModal(audioObj) {
    const modal =
      document.getElementById("audio-modal") || this.createAudioModal();
    const title = modal.querySelector("#audio-title");
    const transcript = modal.querySelector("#audio-transcript");
    const playButton = modal.querySelector("#audio-play");

    title.textContent = audioObj.userData.title;
    transcript.textContent = audioObj.userData.transcript;

    modal.classList.remove("hidden");

    // Setup play button
    playButton.onclick = () => {
      // Simulated audio playback - replace with actual HTML5 Audio
      console.log("Playing:", audioObj.userData.audioUrl);
      alert("Audio playback simulated. Integrate actual audio files.");
    };
  }

  /**
   * Create zoom modal if it doesn't exist
   */
  createZoomModal() {
    const modal = document.createElement("div");
    modal.id = "zoom-modal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-content zoom-modal-content">
        <span class="close-button" onclick="document.getElementById('zoom-modal').classList.add('hidden')">&times;</span>
        <h2 id="zoom-title">Artwork Title</h2>
        <img id="zoom-image" src="" alt="Zoomed Artwork" style="max-width: 90%; max-height: 70vh; border-radius: 8px;">
        <p id="zoom-description" style="margin-top: 20px; max-width: 600px; text-align: center;">Description</p>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    return modal;
  }

  /**
   * Create audio modal if it doesn't exist
   */
  createAudioModal() {
    const modal = document.createElement("div");
    modal.id = "audio-modal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-content audio-modal-content">
        <span class="close-button" onclick="document.getElementById('audio-modal').classList.add('hidden')">&times;</span>
        <div style="text-align: center;">
          <h2 id="audio-title">Audio Guide</h2>
          <button id="audio-play" style="padding: 10px 30px; font-size: 16px; margin: 20px; cursor: pointer; background: #3498db; color: white; border: none; border-radius: 5px;">
            ▶ Play
          </button>
          <p id="audio-transcript" style="max-width: 600px; margin: 20px auto; text-align: left; padding: 20px; background: #f5f5f5; border-radius: 8px;"></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    return modal;
  }

  /**
   * Helper methods
   */
  updateMousePosition(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  findRotatableParent(object) {
    let current = object;
    while (current) {
      if (current.userData.rotatable) return current;
      current = current.parent;
    }
    return null;
  }

  findZoomableParent(object) {
    let current = object;
    while (current) {
      if (current.userData.zoomable) return current;
      current = current.parent;
    }
    return null;
  }

  findSwitchParent(object) {
    let current = object;
    while (current) {
      if (current.userData.lightSwitch) return current;
      current = current.parent;
    }
    return null;
  }

  findAudioGuideParent(object) {
    let current = object;
    while (current) {
      if (current.userData.audioGuide) return current;
      current = current.parent;
    }
    return null;
  }

  highlightObject(object, highlight) {
    object.traverse((child) => {
      if (child.isMesh && child.material) {
        if (highlight) {
          child.userData.originalEmissive = child.material.emissive
            ? child.material.emissive.getHex()
            : 0x000000;
          if (child.material.emissive) {
            child.material.emissive.setHex(0x444444);
          }
        } else {
          if (
            child.material.emissive &&
            child.userData.originalEmissive !== undefined
          ) {
            child.material.emissive.setHex(child.userData.originalEmissive);
          }
        }
      }
    });
  }

  /**
   * Update animation for audio guides
   */
  update(elapsedTime) {
    // Animate audio guide rings
    this.audioGuides.forEach((guide) => {
      if (guide.userData.ring) {
        guide.userData.ring.scale.set(
          1 + Math.sin(elapsedTime * 2) * 0.2,
          1 + Math.sin(elapsedTime * 2) * 0.2,
          1
        );
        guide.userData.ring.material.opacity =
          0.3 + Math.sin(elapsedTime * 2) * 0.2;
      }
    });
  }
}
