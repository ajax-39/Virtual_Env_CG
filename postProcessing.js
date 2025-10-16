/**
 * Post-Processing Effects - Bloom, SSAO, DOF, Color Grading
 * Requires three/examples/jsm imports
 */

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

/**
 * Setup post-processing effects pipeline
 */
export function setupPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);

  // 1. Render Pass - Base scene render
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. SSAO Pass - Screen Space Ambient Occlusion for realistic shadows
  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.kernelRadius = 16;
  ssaoPass.minDistance = 0.005;
  ssaoPass.maxDistance = 0.1;
  ssaoPass.output = SSAOPass.OUTPUT.Default;
  composer.addPass(ssaoPass);

  // 3. Bloom Pass - Glowing lights and highlights
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
  );
  composer.addPass(bloomPass);

  // 4. FXAA Pass - Anti-aliasing for smooth edges
  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms["resolution"].value.x =
    1 / (window.innerWidth * pixelRatio);
  fxaaPass.material.uniforms["resolution"].value.y =
    1 / (window.innerHeight * pixelRatio);
  composer.addPass(fxaaPass);

  // 5. Output Pass - Final gamma correction
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return {
    composer,
    renderPass,
    ssaoPass,
    bloomPass,
    fxaaPass,
    outputPass,
  };
}

/**
 * Custom Vignette Shader for focus effect
 */
export const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.0 },
    darkness: { value: 1.0 },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float offset;
    uniform float darkness;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
      gl_FragColor = vec4(mix(texel.rgb, vec3(1.0 - darkness), dot(uv, uv)), texel.a);
    }
  `,
};

/**
 * Handle window resize for post-processing
 */
export function onWindowResizePostProcessing(composer, camera, fxaaPass) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  composer.setSize(width, height);

  // Update FXAA resolution
  const pixelRatio = composer.renderer.getPixelRatio();
  fxaaPass.material.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
  fxaaPass.material.uniforms["resolution"].value.y = 1 / (height * pixelRatio);
}

/**
 * Toggle post-processing effects
 */
export class PostProcessingController {
  constructor(composer, ssaoPass, bloomPass) {
    this.composer = composer;
    this.ssaoPass = ssaoPass;
    this.bloomPass = bloomPass;
    this.enabled = true;

    this.setupUI();
  }

  setupUI() {
    // Create UI controls for post-processing
    const container = document.createElement("div");
    container.id = "post-processing-controls";
    container.style.cssText = `
      position: absolute;
      top: 120px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      z-index: 100;
    `;

    container.innerHTML = `
      <h3 style="margin: 0 0 10px 0;">Effects</h3>
      <label>
        <input type="checkbox" id="toggle-bloom" checked> Bloom
      </label><br>
      <label>
        <input type="checkbox" id="toggle-ssao" checked> SSAO
      </label><br>
      <label>
        Bloom Strength: <input type="range" id="bloom-strength" min="0" max="3" step="0.1" value="1.5">
      </label>
    `;

    document.body.appendChild(container);

    // Event listeners
    document.getElementById("toggle-bloom").addEventListener("change", (e) => {
      this.bloomPass.enabled = e.target.checked;
    });

    document.getElementById("toggle-ssao").addEventListener("change", (e) => {
      this.ssaoPass.enabled = e.target.checked;
    });

    document
      .getElementById("bloom-strength")
      .addEventListener("input", (e) => {
        this.bloomPass.strength = parseFloat(e.target.value);
      });
  }

  toggle() {
    this.enabled = !this.enabled;
    this.bloomPass.enabled = this.enabled;
    this.ssaoPass.enabled = this.enabled;
  }
}
