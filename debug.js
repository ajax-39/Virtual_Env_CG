/**
 * Debug Script - Check what's failing
 * Open browser console (F12) and check the errors
 */

console.log("=== GALLERY DEBUG START ===");

// Test each import individually
console.log("Testing imports...");

import * as THREE from "three";
console.log("✓ THREE.js loaded");

import { createEnvironment } from "./environment.js";
console.log("✓ environment.js loaded");

import { setupLighting, DayNightCycle } from "./lighting.js";
console.log("✓ lighting.js loaded");

import { createArtworks, animateHotspots } from "./artworks.js";
console.log("✓ artworks.js loaded");

import {
  createActors,
  createParticles,
  updateActors,
  updateParticles,
} from "./actors.js";
console.log("✓ actors.js loaded");

import { CameraController } from "./controls.js";
console.log("✓ controls.js loaded");

import {
  InteractionManager,
  createTeleportPoints,
  animateTeleportPoints,
} from "./interactions.js";
console.log("✓ interactions.js loaded");

import { FPSCounter } from "./utils.js";
console.log("✓ utils.js loaded");

// Test new modules
try {
  const { PostProcessingManager } = await import("./postProcessing.js");
  console.log("✓ postProcessing.js loaded");
} catch (error) {
  console.error("✗ postProcessing.js FAILED:", error);
}

try {
  const {
    createRain,
    createVolumetricLighting,
    createWaterFountain,
    createTorch,
    updateEnvironmentalEffects,
  } = await import("./environmentalEffects.js");
  console.log("✓ environmentalEffects.js loaded");
} catch (error) {
  console.error("✗ environmentalEffects.js FAILED:", error);
}

try {
  const { ExhibitInteractionManager } = await import(
    "./interactiveExhibits.js"
  );
  console.log("✓ interactiveExhibits.js loaded");
} catch (error) {
  console.error("✗ interactiveExhibits.js FAILED:", error);
}

try {
  const {
    createKineticSculpture,
    createHologram,
    createClock,
    createAnimatedPainting,
    updateAdvancedAnimations,
  } = await import("./advancedAnimations.js");
  console.log("✓ advancedAnimations.js loaded");
} catch (error) {
  console.error("✗ advancedAnimations.js FAILED:", error);
}

try {
  const {
    createSmartVisitor,
    createConversationGroup,
    createSecurityGuard,
    createCleaningRobot,
    updateAI,
  } = await import("./enhancedAI.js");
  console.log("✓ enhancedAI.js loaded");
} catch (error) {
  console.error("✗ enhancedAI.js FAILED:", error);
}

try {
  const { createBirds, createButterflies, createAquarium, updateWildlife } =
    await import("./wildlife.js");
  console.log("✓ wildlife.js loaded");
} catch (error) {
  console.error("✗ wildlife.js FAILED:", error);
}

try {
  const { Minimap, InventorySystem, TourGuide, AchievementTracker } =
    await import("./uiEnhancements.js");
  console.log("✓ uiEnhancements.js loaded");
} catch (error) {
  console.error("✗ uiEnhancements.js FAILED:", error);
}

console.log("=== GALLERY DEBUG END ===");
console.log("Check above for any ✗ FAILED messages");
