/**
 * Interactions - Raycasting, hotspots, user input
 */

import * as THREE from "three";

export class InteractionManager {
  constructor(camera, renderer, artworks) {
    this.camera = camera;
    this.renderer = renderer;
    this.artworks = artworks;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredObject = null;

    this.modal = document.getElementById("artwork-modal");
    this.modalTitle = document.getElementById("artwork-title");
    this.modalArtist = document.getElementById("artwork-artist");
    this.modalDescription = document.getElementById("artwork-description");
    this.closeButton = document.querySelector(".close-button");

    this.setupEventListeners();
  }

  setupEventListeners() {
    const self = this;

    // Mouse move for hover effects
    this.renderer.domElement.addEventListener("mousemove", (event) => {
      self.onMouseMove(event);
    });

    // Click for interactions
    this.renderer.domElement.addEventListener("click", (event) => {
      self.onClick(event);
    });

    // Close modal
    this.closeButton.addEventListener("click", () => {
      self.closeModal();
    });

    // Close modal on outside click
    this.modal.addEventListener("click", (event) => {
      if (event.target === self.modal) {
        self.closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        self.closeModal();
      }
    });
  }

  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with hotspots
    const interactables = [];
    this.artworks.forEach((artwork) => {
      artwork.traverse((child) => {
        if (child.userData.isHotspot) {
          interactables.push(child);
        }
      });
    });

    const intersects = this.raycaster.intersectObjects(interactables);

    // Reset previous hover
    if (
      this.hoveredObject &&
      (intersects.length === 0 || intersects[0].object !== this.hoveredObject)
    ) {
      this.hoveredObject.material.color.setHex(0x4caf50);
      this.hoveredObject.scale.setScalar(1);
      this.renderer.domElement.style.cursor = "default";
      this.hoveredObject = null;
    }

    // Apply new hover
    if (intersects.length > 0) {
      const hotspot = intersects[0].object;
      if (hotspot !== this.hoveredObject) {
        this.hoveredObject = hotspot;
        hotspot.material.color.setHex(0xffeb3b);
        hotspot.scale.setScalar(1.3);
        this.renderer.domElement.style.cursor = "pointer";
      }
    }
  }

  onClick(event) {
    // Ignore clicks when in pointer lock (first-person mode)
    if (document.pointerLockElement === this.renderer.domElement) {
      return;
    }

    // Calculate mouse position
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with artworks
    const clickableObjects = [];
    this.artworks.forEach((artwork) => {
      artwork.traverse((child) => {
        if (
          child.isMesh &&
          (child.userData.isHotspot || child.parent.userData.isArtwork)
        ) {
          clickableObjects.push(child);
        }
      });
    });

    const intersects = this.raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;

      // Find the artwork parent
      let artwork = clickedObject;
      while (artwork && !artwork.userData.isArtwork) {
        artwork = artwork.parent;
      }

      if (artwork && artwork.userData.isArtwork) {
        this.showArtworkInfo(artwork.userData);
      }
    }
  }

  showArtworkInfo(artworkData) {
    this.modalTitle.textContent = artworkData.title || "Untitled";
    this.modalArtist.textContent = `by ${
      artworkData.artist || "Unknown Artist"
    }`;
    this.modalDescription.textContent =
      artworkData.description || "No description available.";

    this.modal.classList.remove("hidden");
  }

  closeModal() {
    this.modal.classList.add("hidden");
  }

  update() {
    // Update hover effects continuously
    // (Could add additional interactive animations here)
  }
}

/**
 * Create teleport points (bonus feature)
 */
export function createTeleportPoints(scene, camera) {
  const teleportPoints = [];

  const positions = [
    { x: 0, z: 8, name: "Front View" },
    { x: -8, z: 0, name: "Left View" },
    { x: 8, z: 0, name: "Right View" },
    { x: 0, z: -6, name: "Back View" },
  ];

  positions.forEach((pos, index) => {
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x2196f3,
      transparent: true,
      opacity: 0.5,
    });
    const teleportMarker = new THREE.Mesh(geometry, material);
    teleportMarker.position.set(pos.x, 0.025, pos.z);
    teleportMarker.userData = {
      isTeleportPoint: true,
      targetPosition: new THREE.Vector3(pos.x, 1.6, pos.z),
      name: pos.name,
    };

    scene.add(teleportMarker);
    teleportPoints.push(teleportMarker);

    // Add pulsing animation
    teleportMarker.userData.pulsePhase = (index * Math.PI) / 2;
  });

  return teleportPoints;
}

/**
 * Animate teleport points
 */
export function animateTeleportPoints(teleportPoints, time) {
  teleportPoints.forEach((point) => {
    const pulse = Math.sin(time * 2 + point.userData.pulsePhase) * 0.2 + 0.5;
    point.material.opacity = pulse;
    point.scale.y = 1 + pulse * 0.5;
  });
}
