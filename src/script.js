import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loadingManager: loading started");
};
loadingManager.onLoad = () => {
  console.log("loadingManager: loading finished");
};
loadingManager.onProgress = () => {
  console.log("loadingManager: loading progressing");
};
loadingManager.onError = () => {
  console.log("loadingManager: loading error");
};

const textureLoader = new THREE.TextureLoader(loadingManager);

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png')
const normalTexture = textureLoader.load(
  "/textures/Normal.jpg",
  () => {
    console.log("textureLoader: loading finished");
  },
  () => {
    console.log("textureLoader: loading progressing");
  },
  () => {
    console.log("textureLoader: loading error");
  }
);

// Debug mode
const gui = new dat.GUI();

/**
 * Object
 */
const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
console.log(sphereGeometry.attributes);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x292929,
  metalness: 2,
  roughness: 0.1,
  normalMap: normalTexture,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Sphere Material GUI
const sphereMaterialGUI = gui.addFolder("Sphere Material");
sphereMaterialGUI.add(sphereMaterial, "metalness").min(0).max(1).step(0.01);
sphereMaterialGUI.add(sphereMaterial, "roughness").min(0).max(1).step(0.01);

// Main Point Light 1
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
pointLight.intensity = 10;
scene.add(pointLight);

// Main Point Light 1 GUI
const mainLight = gui.addFolder("Main Light");
mainLight.add(pointLight.position, "y").min(-10).max(10).step(0.01);
mainLight.add(pointLight.position, "x").min(-6).max(6).step(0.01);
mainLight.add(pointLight.position, "z").min(-20).max(20).step(0.01);
mainLight.add(pointLight, "intensity").min(0).max(10).step(0.01);

// Main Point Light 1 Color GUI
const mainLightColor = {
  color: 0xff00000,
};
mainLight
  .addColor(mainLightColor, "color")
  .onChange(() => pointLight.color.set(mainLightColor.color));

// Point Light 2
const pointLight2 = new THREE.PointLight(0xff0000, 10);
pointLight2.position.set(-6, 3, -7);
pointLight2.intensity = 10;
scene.add(pointLight2);

// Point Light 2 GUI
const pointLight2GUI = gui.addFolder("Point Light 1");
pointLight2GUI.add(pointLight2.position, "y").min(-10).max(10).step(0.01);
pointLight2GUI.add(pointLight2.position, "x").min(-20).max(20).step(0.01);
pointLight2GUI.add(pointLight2.position, "z").min(-20).max(20).step(0.01);
pointLight2GUI.add(pointLight2, "intensity").min(0).max(10).step(0.01);

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);
// scene.add(pointLightHelper);

// Main Point Light 1 Color GUI
const pointLight2Color = {
  color: 0xff00000,
};
pointLight2GUI
  .addColor(pointLight2Color, "color")
  .onChange(() => pointLight2.color.set(pointLight2Color.color));

// Point Light 3
const pointLight3 = new THREE.PointLight(0xc1f0, 2);
pointLight3.position.set(8.86, -5.36, -8);
pointLight3.intensity = 10;
scene.add(pointLight3);

// Point Light 3 GUI
const pointLight3GUI = gui.addFolder("Red Light 2");
pointLight3GUI.add(pointLight3.position, "y").min(-10).max(10).step(0.01);
pointLight3GUI.add(pointLight3.position, "x").min(-20).max(20).step(0.01);
pointLight3GUI.add(pointLight3.position, "z").min(-20).max(20).step(0.01);
pointLight3GUI.add(pointLight3, "intensity").min(0).max(10).step(0.01);

// const pointLight3Helper = new THREE.PointLightHelper(pointLight3, 1);
// scene.add(pointLight3Helper);

// Main Point Light 1 Color GUI
const pointLight3Color = {
  color: 0xff00000,
};
pointLight3GUI
  .addColor(pointLight3Color, "color")
  .onChange(() => pointLight3.color.set(pointLight3Color.color));

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
document.addEventListener("mousemove", onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerHeight / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.ClientX - windowX;
  mouseY = event.ClientY - windowY;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
