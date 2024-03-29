import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import RAPIER from '@dimforge/rapier3d-compat'
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  renderTarget: THREE.WebGLRenderTarget,
  composer: EffectComposer,
  stats: Stats,
  renderWidth: number,
  renderHeight: number,
  renderAspectRatio: number,
  gltfLoader: GLTFLoader,
  textureLoader: THREE.TextureLoader


export const useRenderer = () => renderer

export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })

export const useScene = () => scene

export const useCamera = () => camera

export const useStats = () => stats

export const useRenderTarget = () => renderTarget

export const useComposer = () => composer

export const addPass = (pass: Pass) => {
  composer.addPass(pass)
}


export const useGltfLoader = () => gltfLoader
export const useTextureLoader = () => textureLoader

export { RAPIER }