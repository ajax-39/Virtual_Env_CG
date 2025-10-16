/**
 * UI/UX Enhancements - Minimap, Inventory, Tour Guide, Achievements
 */

import * as THREE from "three";

/**
 * Minimap System
 */
export class Minimap {
  constructor(camera, roomWidth, roomDepth) {
    this.camera = camera;
    this.roomWidth = roomWidth;
    this.roomDepth = roomDepth;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.markers = [];

    this.init();
  }

  init() {
    // Create minimap container
    this.container = document.createElement("div");
    this.container.id = "minimap";
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 200px;
      height: 150px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 10px;
      z-index: 100;
    `;

    // Create canvas for minimap
    this.canvas = document.createElement("canvas");
    this.canvas.width = 180;
    this.canvas.height = 130;
    this.ctx = this.canvas.getContext("2d");

    this.container.appendChild(this.canvas);
    document.body.appendChild(this.container);
  }

  addMarker(position, color = "#FF0000", label = "") {
    this.markers.push({ position, color, label });
  }

  update(playerPosition) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Draw room outline
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Scale factors
    const scaleX = (width - 20) / this.roomWidth;
    const scaleZ = (height - 20) / this.roomDepth;

    // Draw markers (artworks, NPCs, etc.)
    this.markers.forEach((marker) => {
      const x = 10 + (marker.position.x + this.roomWidth / 2) * scaleX;
      const z = 10 + (marker.position.z + this.roomDepth / 2) * scaleZ;

      ctx.fillStyle = marker.color;
      ctx.beginPath();
      ctx.arc(x, z, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw player
    const playerX = 10 + (playerPosition.x + this.roomWidth / 2) * scaleX;
    const playerZ = 10 + (playerPosition.z + this.roomDepth / 2) * scaleZ;

    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(playerX, playerZ, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw player direction
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playerX, playerZ);
    const directionLength = 15;
    const angle = Math.atan2(
      this.camera.getWorldDirection(new THREE.Vector3()).x,
      this.camera.getWorldDirection(new THREE.Vector3()).z
    );
    ctx.lineTo(
      playerX + Math.sin(angle) * directionLength,
      playerZ + Math.cos(angle) * directionLength
    );
    ctx.stroke();
  }

  toggle() {
    this.container.style.display =
      this.container.style.display === "none" ? "block" : "none";
  }
}

/**
 * Collection/Inventory System
 */
export class InventorySystem {
  constructor() {
    this.items = [];
    this.container = null;
    this.isOpen = false;

    this.init();
  }

  init() {
    // Create inventory UI
    this.container = document.createElement("div");
    this.container.id = "inventory";
    this.container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-height: 80vh;
      background: rgba(0, 0, 0, 0.95);
      border: 3px solid #4CAF50;
      border-radius: 12px;
      padding: 20px;
      display: none;
      z-index: 1000;
      overflow-y: auto;
    `;

    const title = document.createElement("h2");
    title.textContent = "Collection";
    title.style.cssText = "color: #4CAF50; margin-top: 0; text-align: center;";
    this.container.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => this.toggle();
    this.container.appendChild(closeBtn);

    this.itemsContainer = document.createElement("div");
    this.itemsContainer.id = "inventory-items";
    this.container.appendChild(this.itemsContainer);

    document.body.appendChild(this.container);

    // Add keyboard shortcut (I key)
    document.addEventListener("keydown", (e) => {
      if (e.key === "i" || e.key === "I") {
        this.toggle();
      }
    });
  }

  addItem(item) {
    if (!this.items.find((i) => i.id === item.id)) {
      this.items.push(item);
      this.updateUI();
      this.showNotification(`Collected: ${item.name}`);
      return true;
    }
    return false;
  }

  updateUI() {
    this.itemsContainer.innerHTML = "";

    if (this.items.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No items collected yet. Explore the gallery!";
      emptyMsg.style.cssText =
        "color: #888; text-align: center; margin: 40px 0;";
      this.itemsContainer.appendChild(emptyMsg);
      return;
    }

    this.items.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
        border-left: 4px solid #4CAF50;
      `;

      itemDiv.innerHTML = `
        <h3 style="color: white; margin: 0 0 10px 0;">${item.name}</h3>
        <p style="color: #ccc; margin: 0;">${item.description}</p>
        <small style="color: #888;">Collected: ${item.timestamp}</small>
      `;

      this.itemsContainer.appendChild(itemDiv);
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.container.style.display = this.isOpen ? "block" : "none";
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #4CAF50;
      color: white;
      padding: 15px 30px;
      border-radius: 8px;
      z-index: 2000;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.3s";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

/**
 * Tour Guide Path System
 */
export class TourGuide {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.waypoints = [];
    this.currentWaypoint = 0;
    this.isActive = false;
    this.pathLine = null;
    this.waypointMarkers = [];
    this.ui = null;

    this.init();
  }

  init() {
    // Create UI
    this.ui = document.createElement("div");
    this.ui.id = "tour-guide";
    this.ui.style.cssText = `
      position: fixed;
      top: 120px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #2196F3;
      border-radius: 8px;
      padding: 15px;
      color: white;
      display: none;
      z-index: 100;
      max-width: 300px;
    `;

    document.body.appendChild(this.ui);

    // Add keyboard shortcut (T key)
    document.addEventListener("keydown", (e) => {
      if (e.key === "t" || e.key === "T") {
        this.toggle();
      }
    });
  }

  addWaypoint(position, title, description) {
    this.waypoints.push({ position, title, description });
  }

  start() {
    if (this.waypoints.length === 0) return;

    this.isActive = true;
    this.currentWaypoint = 0;
    this.createPathVisualization();
    this.updateUI();
    this.ui.style.display = "block";
  }

  stop() {
    this.isActive = false;
    this.clearPathVisualization();
    this.ui.style.display = "none";
  }

  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
  }

  next() {
    if (this.currentWaypoint < this.waypoints.length - 1) {
      this.currentWaypoint++;
      this.updateUI();
    }
  }

  previous() {
    if (this.currentWaypoint > 0) {
      this.currentWaypoint--;
      this.updateUI();
    }
  }

  updateUI() {
    if (!this.isActive || this.waypoints.length === 0) return;

    const waypoint = this.waypoints[this.currentWaypoint];
    const progress = this.currentWaypoint + 1;
    const total = this.waypoints.length;

    this.ui.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #2196F3;">Tour Guide</h3>
      <p style="margin: 0 0 5px 0; color: #FFD700; font-weight: bold;">${
        waypoint.title
      }</p>
      <p style="margin: 0 0 15px 0; font-size: 14px;">${
        waypoint.description
      }</p>
      <div style="margin-bottom: 10px;">
        <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px;">
          <div style="background: #2196F3; height: 100%; width: ${
            (progress / total) * 100
          }%; border-radius: 4px;"></div>
        </div>
        <small>Stop ${progress} of ${total}</small>
      </div>
      <button onclick="window.tourGuide.previous()" style="margin-right: 5px; padding: 5px 15px; cursor: pointer;" ${
        this.currentWaypoint === 0 ? "disabled" : ""
      }>← Previous</button>
      <button onclick="window.tourGuide.next()" style="padding: 5px 15px; cursor: pointer;" ${
        this.currentWaypoint === total - 1 ? "disabled" : ""
      }>Next →</button>
    `;

    // Expose to window for button access
    window.tourGuide = this;
  }

  createPathVisualization() {
    // Create line connecting waypoints
    const points = this.waypoints.map((wp) => wp.position);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x2196f3,
      linewidth: 2,
    });

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.position.y = 0.1; // Slightly above ground
    this.scene.add(this.pathLine);

    // Create waypoint markers
    this.waypoints.forEach((wp, index) => {
      const markerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x2196f3,
        transparent: true,
        opacity: 0.7,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(wp.position);
      marker.position.y = 0.05;

      // Number label
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((index + 1).toString(), 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const labelGeometry = new THREE.PlaneGeometry(0.3, 0.3);
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.rotation.x = -Math.PI / 2;
      label.position.copy(wp.position);
      label.position.y = 0.11;

      this.scene.add(marker);
      this.scene.add(label);
      this.waypointMarkers.push(marker, label);
    });
  }

  clearPathVisualization() {
    if (this.pathLine) {
      this.scene.remove(this.pathLine);
      this.pathLine = null;
    }

    this.waypointMarkers.forEach((marker) => {
      this.scene.remove(marker);
    });
    this.waypointMarkers = [];
  }
}

/**
 * Achievement System
 */
export class AchievementTracker {
  constructor() {
    this.achievements = [];
    this.unlockedAchievements = [];
    this.container = null;
    this.isOpen = false;

    this.init();
    this.defineAchievements();
  }

  init() {
    // Create achievements UI
    this.container = document.createElement("div");
    this.container.id = "achievements";
    this.container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 700px;
      max-height: 80vh;
      background: rgba(0, 0, 0, 0.95);
      border: 3px solid #FFD700;
      border-radius: 12px;
      padding: 20px;
      display: none;
      z-index: 1000;
      overflow-y: auto;
    `;

    const title = document.createElement("h2");
    title.textContent = "🏆 Achievements";
    title.style.cssText = "color: #FFD700; margin-top: 0; text-align: center;";
    this.container.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => this.toggle();
    this.container.appendChild(closeBtn);

    this.achievementsContainer = document.createElement("div");
    this.achievementsContainer.id = "achievements-list";
    this.container.appendChild(this.achievementsContainer);

    document.body.appendChild(this.container);

    // Add keyboard shortcut (A key)
    document.addEventListener("keydown", (e) => {
      if (e.key === "a" || e.key === "A") {
        this.toggle();
      }
    });

    this.updateUI();
  }

  defineAchievements() {
    this.achievements = [
      {
        id: "first_visit",
        name: "First Steps",
        description: "Enter the gallery",
        icon: "👣",
      },
      {
        id: "art_lover",
        name: "Art Lover",
        description: "View 5 artworks",
        icon: "🎨",
      },
      {
        id: "collector",
        name: "Collector",
        description: "Collect 3 items",
        icon: "📦",
      },
      {
        id: "explorer",
        name: "Explorer",
        description: "Visit all corners of the gallery",
        icon: "🗺️",
      },
      {
        id: "tourist",
        name: "Tourist",
        description: "Complete the guided tour",
        icon: "🎫",
      },
      {
        id: "speed_run",
        name: "Speed Runner",
        description: "Complete tour in under 5 minutes",
        icon: "⚡",
      },
      {
        id: "night_owl",
        name: "Night Owl",
        description: "Visit during night cycle",
        icon: "🌙",
      },
      {
        id: "wildlife_watcher",
        name: "Wildlife Watcher",
        description: "Observe all animals",
        icon: "🦋",
      },
      {
        id: "tech_savvy",
        name: "Tech Savvy",
        description: "Interact with hologram",
        icon: "💻",
      },
      {
        id: "master",
        name: "Gallery Master",
        description: "Unlock all achievements",
        icon: "👑",
      },
    ];
  }

  unlock(achievementId) {
    if (this.unlockedAchievements.includes(achievementId)) return false;

    const achievement = this.achievements.find((a) => a.id === achievementId);
    if (!achievement) return false;

    this.unlockedAchievements.push(achievementId);
    this.showUnlockNotification(achievement);
    this.updateUI();

    // Check if all achievements unlocked
    if (
      this.unlockedAchievements.length === this.achievements.length - 1 &&
      !this.unlockedAchievements.includes("master")
    ) {
      setTimeout(() => this.unlock("master"), 500);
    }

    return true;
  }

  isUnlocked(achievementId) {
    return this.unlockedAchievements.includes(achievementId);
  }

  updateUI() {
    this.achievementsContainer.innerHTML = "";

    const progressDiv = document.createElement("div");
    const progress =
      (this.unlockedAchievements.length / this.achievements.length) * 100;
    progressDiv.innerHTML = `
      <div style="margin: 20px 0;">
        <div style="background: rgba(255,255,255,0.2); height: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #FFD700, #FFA500); height: 100%; width: ${progress}%; border-radius: 10px; transition: width 0.3s;"></div>
        </div>
        <p style="text-align: center; color: white; margin-top: 10px;">
          ${this.unlockedAchievements.length} / ${this.achievements.length} Unlocked
        </p>
      </div>
    `;
    this.achievementsContainer.appendChild(progressDiv);

    this.achievements.forEach((achievement) => {
      const isUnlocked = this.unlockedAchievements.includes(achievement.id);

      const achDiv = document.createElement("div");
      achDiv.style.cssText = `
        background: ${
          isUnlocked ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 255, 255, 0.05)"
        };
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
        border-left: 4px solid ${isUnlocked ? "#FFD700" : "#555"};
        opacity: ${isUnlocked ? "1" : "0.5"};
        display: flex;
        align-items: center;
        gap: 15px;
      `;

      achDiv.innerHTML = `
        <div style="font-size: 32px;">${
          isUnlocked ? achievement.icon : "🔒"
        }</div>
        <div style="flex: 1;">
          <h3 style="color: ${
            isUnlocked ? "#FFD700" : "#888"
          }; margin: 0 0 5px 0;">${achievement.name}</h3>
          <p style="color: #ccc; margin: 0; font-size: 14px;">${
            achievement.description
          }</p>
        </div>
      `;

      this.achievementsContainer.appendChild(achDiv);
    });
  }

  showUnlockNotification(achievement) {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: black;
      padding: 20px;
      border-radius: 12px;
      z-index: 2000;
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
      animation: slideInRight 0.5s ease-out;
      min-width: 300px;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 48px;">${achievement.icon}</div>
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 18px;">Achievement Unlocked!</h3>
          <p style="margin: 0; font-weight: bold;">${achievement.name}</p>
          <small>${achievement.description}</small>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s";
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.container.style.display = this.isOpen ? "block" : "none";
  }
}
