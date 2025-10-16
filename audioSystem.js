/**
 * Audio System - Spatial Audio, Ambient Sounds, Interactive Sound Effects
 */

import * as THREE from "three";

/**
 * Audio Manager for the gallery
 */
export class AudioManager {
  constructor(camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);

    this.sounds = new Map();
    this.ambientSounds = [];
    this.enabled = true;

    this.setupAudioContext();
  }

  setupAudioContext() {
    // Create audio context button for user interaction (required by browsers)
    const audioButton = document.createElement("button");
    audioButton.id = "enable-audio";
    audioButton.textContent = "🔊 Enable Audio";
    audioButton.style.cssText = `
      position: absolute;
      top: 80px;
      left: 20px;
      padding: 10px 20px;
      background: rgba(76, 175, 80, 0.9);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      z-index: 100;
      font-family: Arial, sans-serif;
    `;

    audioButton.addEventListener("click", () => {
      this.enabled = true;
      this.playAmbientSounds();
      audioButton.style.display = "none";
    });

    document.body.appendChild(audioButton);
  }

  /**
   * Create ambient background music/sounds
   */
  createAmbientSound(audioPath, volume = 0.3, loop = true) {
    const sound = new THREE.Audio(this.listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(
      audioPath,
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(loop);
        sound.setVolume(volume);
        if (this.enabled) {
          sound.play();
        }
      },
      undefined,
      (error) => {
        console.warn("Could not load audio:", error);
      }
    );

    this.ambientSounds.push(sound);
    return sound;
  }

  /**
   * Create positional audio for 3D spatial sound
   */
  createPositionalSound(mesh, audioPath, volume = 0.5, loop = true, refDistance = 5) {
    const sound = new THREE.PositionalAudio(this.listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(
      audioPath,
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setRefDistance(refDistance);
        sound.setLoop(loop);
        sound.setVolume(volume);
        if (this.enabled) {
          sound.play();
        }
      },
      undefined,
      (error) => {
        console.warn("Could not load positional audio:", error);
      }
    );

    mesh.add(sound);
    this.sounds.set(mesh.uuid, sound);
    return sound;
  }

  /**
   * Play one-shot sound effect
   */
  playSoundEffect(audioData, volume = 0.5) {
    if (!this.enabled) return;

    const sound = new THREE.Audio(this.listener);
    
    // Use procedurally generated sound if no file provided
    if (typeof audioData === "string") {
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(audioData, (buffer) => {
        sound.setBuffer(buffer);
        sound.setVolume(volume);
        sound.play();
      });
    } else {
      // Use generated audio buffer
      sound.setBuffer(audioData);
      sound.setVolume(volume);
      sound.play();
    }

    return sound;
  }

  /**
   * Create procedural footstep sound
   */
  createFootstepSound() {
    const audioContext = this.listener.context;
    const sampleRate = audioContext.sampleRate;
    const duration = 0.15;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise with envelope for footstep
    for (let i = 0; i < buffer.length; i++) {
      const t = i / buffer.length;
      const envelope = Math.exp(-t * 15); // Decay
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * Create procedural click sound
   */
  createClickSound() {
    const audioContext = this.listener.context;
    const sampleRate = audioContext.sampleRate;
    const duration = 0.1;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate click with sharp attack
    for (let i = 0; i < buffer.length; i++) {
      const t = i / buffer.length;
      const freq = 1000 * (1 - t * 0.8);
      const envelope = Math.exp(-t * 30);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.5;
    }

    return buffer;
  }

  /**
   * Create procedural chime sound
   */
  createChimeSound() {
    const audioContext = this.listener.context;
    const sampleRate = audioContext.sampleRate;
    const duration = 1.0;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3);
      let sample = 0;

      frequencies.forEach((freq) => {
        sample += Math.sin(2 * Math.PI * freq * t);
      });

      data[i] = (sample / frequencies.length) * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * Create ambient gallery atmosphere
   */
  createGalleryAmbience() {
    const audioContext = this.listener.context;
    const sampleRate = audioContext.sampleRate;
    const duration = 5.0; // Loop this
    const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);

      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        
        // Low rumble
        const rumble = Math.sin(2 * Math.PI * 60 * t) * 0.03;
        
        // Occasional subtle air conditioning hum
        const hum = Math.sin(2 * Math.PI * 120 * t + Math.sin(t * 0.5) * 2) * 0.02;
        
        // Very quiet pink noise
        const noise = (Math.random() * 2 - 1) * 0.005;

        data[i] = rumble + hum + noise;
      }
    }

    const sound = new THREE.Audio(this.listener);
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.15);

    return sound;
  }

  /**
   * Play ambient sounds
   */
  playAmbientSounds() {
    if (!this.enabled) return;

    // Play gallery ambience
    const ambience = this.createGalleryAmbience();
    ambience.play();
    this.ambientSounds.push(ambience);
  }

  /**
   * Toggle all audio
   */
  toggle() {
    this.enabled = !this.enabled;

    if (this.enabled) {
      this.ambientSounds.forEach((sound) => {
        if (!sound.isPlaying) sound.play();
      });
      this.sounds.forEach((sound) => {
        if (!sound.isPlaying) sound.play();
      });
    } else {
      this.ambientSounds.forEach((sound) => sound.pause());
      this.sounds.forEach((sound) => sound.pause());
    }

    return this.enabled;
  }

  /**
   * Update audio (call in animation loop)
   */
  update() {
    // Audio listener automatically updates with camera
  }

  /**
   * Clean up
   */
  dispose() {
    this.ambientSounds.forEach((sound) => {
      if (sound.isPlaying) sound.stop();
    });
    this.sounds.forEach((sound) => {
      if (sound.isPlaying) sound.stop();
    });
  }
}

/**
 * Footstep Sound Controller
 */
export class FootstepController {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.footstepSound = audioManager.createFootstepSound();
    this.lastFootstepTime = 0;
    this.footstepInterval = 0.4; // seconds between steps
  }

  playFootstep(velocity) {
    const now = Date.now() / 1000;
    const speed = velocity.length();

    // Adjust interval based on speed
    const interval = speed > 0.1 ? this.footstepInterval / (speed * 10) : this.footstepInterval;

    if (now - this.lastFootstepTime > interval && speed > 0.01) {
      this.audioManager.playSoundEffect(this.footstepSound, 0.3);
      this.lastFootstepTime = now;
    }
  }
}

/**
 * Create sound emitter objects in the scene
 */
export function createSoundEmitters(scene, audioManager) {
  const emitters = [];

  // Fountain water sound
  const fountainEmitter = new THREE.Object3D();
  fountainEmitter.position.set(0, 0.5, -6);
  scene.add(fountainEmitter);

  // Generate water sound
  const waterSound = generateWaterSound(audioManager.listener.context);
  audioManager.createPositionalSound(fountainEmitter, waterSound, 0.3, true, 3);
  emitters.push(fountainEmitter);

  return emitters;
}

/**
 * Generate procedural water sound
 */
function generateWaterSound(audioContext) {
  const sampleRate = audioContext.sampleRate;
  const duration = 3.0;
  const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      
      // Filtered noise for water
      const noise = (Math.random() * 2 - 1) * 0.1;
      
      // Add some low frequency movement
      const movement = Math.sin(2 * Math.PI * 2 * t) * 0.05;
      
      // High frequency splashing
      const splash = Math.sin(2 * Math.PI * 1000 * t * Math.random()) * 0.03 * (Math.random() > 0.95 ? 1 : 0);

      data[i] = noise + movement + splash;
    }
  }

  return buffer;
}

/**
 * Create UI controls for audio
 */
export function createAudioUI(audioManager) {
  const container = document.createElement("div");
  container.id = "audio-controls";
  container.style.cssText = `
    position: absolute;
    top: 80px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    z-index: 100;
  `;

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "🔊 Audio: ON";
  toggleButton.style.cssText = `
    padding: 8px 15px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  `;

  toggleButton.addEventListener("click", () => {
    const enabled = audioManager.toggle();
    toggleButton.textContent = enabled ? "🔊 Audio: ON" : "🔇 Audio: OFF";
    toggleButton.style.background = enabled ? "#4caf50" : "#f44336";
  });

  container.appendChild(toggleButton);
  document.body.appendChild(container);
}
