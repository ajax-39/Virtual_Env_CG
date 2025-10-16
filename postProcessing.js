/**
 * Post-Processing Effects - Bloom, SSAO, DOF, Color Correction
 */

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

/**
 * Post-processing manager
 */
export class PostProcessingManager {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = null;
    this.passes = {};
    this.enabled = true;

    this.init();
  }

  init() {
    // Create effect composer
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);

    // 1. Render Pass - Base scene render
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.passes.render = renderPass;

    // 2. SSAO Pass - Screen Space Ambient Occlusion
    this.setupSSAO();

    // 3. Bloom Pass - Glowing lights
    this.setupBloom();

    // 4. Depth of Field (Bokeh) Pass
    this.setupDepthOfField();

    // 5. Color Correction Pass
    this.setupColorCorrection();

    // 6. Output Pass - Final output
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
    this.passes.output = outputPass;

    console.log("Post-processing initialized");
  }

  setupSSAO() {
    const ssaoPass = new SSAOPass(
      this.scene,
      this.camera,
      window.innerWidth,
      window.innerHeight
    );

    // SSAO configuration
    ssaoPass.kernelRadius = 16;
    ssaoPass.minDistance = 0.005;
    ssaoPass.maxDistance = 0.1;
    ssaoPass.output = SSAOPass.OUTPUT.Default;

    this.composer.addPass(ssaoPass);
    this.passes.ssao = ssaoPass;
  }

  setupBloom() {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );

    bloomPass.threshold = 0.85;
    bloomPass.strength = 0.8;
    bloomPass.radius = 0.5;

    this.composer.addPass(bloomPass);
    this.passes.bloom = bloomPass;
  }

  setupDepthOfField() {
    const bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 10.0,
      aperture: 0.00005,
      maxblur: 0.005,
    });

    bokehPass.enabled = false; // Disabled by default, can be toggled
    this.composer.addPass(bokehPass);
    this.passes.dof = bokehPass;
  }

  setupColorCorrection() {
    // Custom color correction shader
    const ColorCorrectionShader = {
      uniforms: {
        tDiffuse: { value: null },
        brightness: { value: 0.0 },
        contrast: { value: 1.1 },
        saturation: { value: 1.15 },
        exposure: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float brightness;
        uniform float contrast;
        uniform float saturation;
        uniform float exposure;
        varying vec2 vUv;

        vec3 adjustContrast(vec3 color, float contrast) {
          return (color - 0.5) * contrast + 0.5;
        }

        vec3 adjustSaturation(vec3 color, float saturation) {
          float luminance = dot(color, vec3(0.299, 0.587, 0.114));
          return mix(vec3(luminance), color, saturation);
        }

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 color = texel.rgb;

          // Apply exposure
          color *= exposure;

          // Apply brightness
          color += brightness;

          // Apply contrast
          color = adjustContrast(color, contrast);

          // Apply saturation
          color = adjustSaturation(color, saturation);

          gl_FragColor = vec4(color, texel.a);
        }
      `,
    };

    const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
    this.composer.addPass(colorCorrectionPass);
    this.passes.colorCorrection = colorCorrectionPass;
  }

  /**
   * Update on window resize
   */
  resize(width, height) {
    this.composer.setSize(width, height);

    if (this.passes.ssao) {
      this.passes.ssao.setSize(width, height);
    }

    if (this.passes.bloom) {
      this.passes.bloom.resolution.set(width, height);
    }
  }

  /**
   * Render the composer
   */
  render() {
    if (this.enabled) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Toggle specific effect
   */
  toggleEffect(effectName) {
    if (this.passes[effectName]) {
      this.passes[effectName].enabled = !this.passes[effectName].enabled;
      console.log(
        `${effectName} ${
          this.passes[effectName].enabled ? "enabled" : "disabled"
        }`
      );
    }
  }

  /**
   * Update bloom strength dynamically
   */
  updateBloom(strength, radius, threshold) {
    if (this.passes.bloom) {
      if (strength !== undefined) this.passes.bloom.strength = strength;
      if (radius !== undefined) this.passes.bloom.radius = radius;
      if (threshold !== undefined) this.passes.bloom.threshold = threshold;
    }
  }

  /**
   * Update DOF focus
   */
  updateDOF(focus, aperture, maxblur) {
    if (this.passes.dof) {
      if (focus !== undefined) this.passes.dof.uniforms.focus.value = focus;
      if (aperture !== undefined)
        this.passes.dof.uniforms.aperture.value = aperture;
      if (maxblur !== undefined)
        this.passes.dof.uniforms.maxblur.value = maxblur;
    }
  }

  /**
   * Enable/disable all post-processing
   */
  toggle() {
    this.enabled = !this.enabled;
    console.log(`Post-processing ${this.enabled ? "enabled" : "disabled"}`);
  }
}
