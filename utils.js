/**
 * Utility functions for the Virtual Art Gallery
 */

import * as THREE from "three";

/**
 * Create a procedural texture
 */
export function createProceduralTexture(width, height, generator) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  generator(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Create a wood texture procedurally
 */
export function createWoodTexture() {
  return createProceduralTexture(512, 512, (ctx, w, h) => {
    // Base wood color
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, "#8B4513");
    gradient.addColorStop(0.5, "#A0522D");
    gradient.addColorStop(1, "#8B4513");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Wood grain
    for (let i = 0; i < 50; i++) {
      ctx.strokeStyle = `rgba(101, 67, 33, ${Math.random() * 0.3})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, 0);
      ctx.lineTo(Math.random() * w, h);
      ctx.stroke();
    }
  });
}

/**
 * Create a marble texture procedurally
 */
export function createMarbleTexture() {
  return createProceduralTexture(512, 512, (ctx, w, h) => {
    // Base marble color
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, w, h);

    // Marble veins
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = `rgba(150, 150, 150, ${Math.random() * 0.4})`;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      const startX = Math.random() * w;
      const startY = Math.random() * h;
      ctx.moveTo(startX, startY);
      for (let j = 0; j < 10; j++) {
        ctx.lineTo(
          startX + Math.random() * 100 - 50,
          startY + (j * h) / 10 + Math.random() * 50 - 25
        );
      }
      ctx.stroke();
    }
  });
}

/**
 * Create a wall texture with subtle noise
 */
export function createWallTexture() {
  return createProceduralTexture(512, 512, (ctx, w, h) => {
    // Base color
    ctx.fillStyle = "#f8f8f0";
    ctx.fillRect(0, 0, w, h);

    // Subtle noise
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 10 - 5;
      data[i] += noise; // R
      data[i + 1] += noise; // G
      data[i + 2] += noise; // B
    }
    ctx.putImageData(imageData, 0, 0);
  });
}

/**
 * Create a painting texture (abstract art)
 */
export function createPaintingTexture(seed = 0) {
  return createProceduralTexture(512, 512, (ctx, w, h) => {
    // Seed-based randomization
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Background
    const colors = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1"],
      ["#FFA07A", "#98D8C8", "#F7DC6F"],
      ["#B19CD9", "#FF8B94", "#AED9E0"],
      ["#FF9F1C", "#2EC4B6", "#E71D36"],
    ];
    const palette = colors[Math.floor(random() * colors.length)];

    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);

    // Abstract shapes
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle =
        palette[Math.floor(random() * palette.length)] +
        Math.floor(random() * 155 + 100).toString(16);
      ctx.beginPath();
      const type = Math.floor(random() * 3);
      if (type === 0) {
        // Circle
        ctx.arc(
          random() * w,
          random() * h,
          random() * 100 + 20,
          0,
          Math.PI * 2
        );
      } else if (type === 1) {
        // Rectangle
        ctx.rect(
          random() * w,
          random() * h,
          random() * 150 + 50,
          random() * 150 + 50
        );
      } else {
        // Triangle
        ctx.moveTo(random() * w, random() * h);
        ctx.lineTo(random() * w, random() * h);
        ctx.lineTo(random() * w, random() * h);
        ctx.closePath();
      }
      ctx.fill();
    }
  });
}

/**
 * Create a simple humanoid character
 */
export function createSimpleHumanoid(color = 0x4caf50) {
  const group = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.8;
  body.castShadow = true;
  group.add(body);

  // Head
  const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.25;
  head.castShadow = true;
  group.add(head);

  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
  const armMaterial = new THREE.MeshStandardMaterial({ color: color });

  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-0.3, 0.8, 0);
  leftArm.rotation.z = Math.PI / 8;
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(0.3, 0.8, 0);
  rightArm.rotation.z = -Math.PI / 8;
  rightArm.castShadow = true;
  group.add(rightArm);

  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });

  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.1, 0.25, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.1, 0.25, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  return group;
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Get a point on a path
 */
export function getPathPoint(path, t) {
  const index = Math.floor(t * (path.length - 1));
  const nextIndex = Math.min(index + 1, path.length - 1);
  const localT = (t * (path.length - 1)) % 1;

  return {
    x: lerp(path[index].x, path[nextIndex].x, localT),
    y: lerp(path[index].y, path[nextIndex].y, localT),
    z: lerp(path[index].z, path[nextIndex].z, localT),
  };
}

/**
 * Create a frame for artwork
 */
export function createFrame(width, height, depth = 0.1, color = 0x8b7355) {
  const group = new THREE.Group();

  const frameThickness = 0.05;
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.6,
  });

  // Top
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, depth),
    frameMaterial
  );
  top.position.y = height / 2 + frameThickness / 2;
  top.castShadow = true;
  group.add(top);

  // Bottom
  const bottom = new THREE.Mesh(
    new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, depth),
    frameMaterial
  );
  bottom.position.y = -(height / 2 + frameThickness / 2);
  bottom.castShadow = true;
  group.add(bottom);

  // Left
  const left = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, height, depth),
    frameMaterial
  );
  left.position.x = -(width / 2 + frameThickness / 2);
  left.castShadow = true;
  group.add(left);

  // Right
  const right = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, height, depth),
    frameMaterial
  );
  right.position.x = width / 2 + frameThickness / 2;
  right.castShadow = true;
  group.add(right);

  return group;
}

/**
 * Calculate FPS
 */
export class FPSCounter {
  constructor() {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 60;
  }

  update() {
    this.frames++;
    const currentTime = performance.now();
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round(
        (this.frames * 1000) / (currentTime - this.lastTime)
      );
      this.frames = 0;
      this.lastTime = currentTime;
    }
    return this.fps;
  }
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Generate random position within bounds
 */
export function randomPosition(minX, maxX, minY, maxY, minZ, maxZ) {
  return new THREE.Vector3(
    Math.random() * (maxX - minX) + minX,
    Math.random() * (maxY - minY) + minY,
    Math.random() * (maxZ - minZ) + minZ
  );
}
