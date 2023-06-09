import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// CAMERA

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 9, 15);

// SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
// scene.fog = new THREE.Fog(0xa0a0a0, 1, 20);

// LIGHT

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

//  LOADER

const gltfloader = new GLTFLoader();
gltfloader.load("src/models/gltf/Test.glb", function (gltf) {
  const mesh = gltf.scene.children[0];

  scene.add(mesh);
});

// RENDERER

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// HELPERS

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// CONTROLS

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
