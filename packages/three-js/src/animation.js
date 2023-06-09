import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// CLOCK

const clock = new THREE.Clock();

// CAMERA

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(30, 90, 150);

// SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 1, 500);

// LIGHT

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 1, 50);
pointLight.position.set(0, 0, -1);
scene.add(pointLight);

// MIXER

const mixer = new THREE.AnimationMixer(scene);

//  LOADER

const glb1 = "src/models/gltf/free_cyberpunk_hovercar.glb";
const glb2 = "src/models/gltf/medieval_fantasy_book.glb";
const glb3 = "src/models/gltf/spartan_armour_mkv_-_halo_reach.glb";

const gltfloader = new GLTFLoader();
gltfloader.load(glb2, function (gltf) {
  console.log(gltf);
  const mesh = gltf.scene.children[0];
  const clip = gltf.animations[0];

  mixer.clipAction(clip, mesh).play();

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

  const delta = clock.getDelta();
  mixer.update(delta);

  controls.update();

  renderer.render(scene, camera);
}

animate();

// controls.addEventListener("change", function () {
//   renderer.render(scene, camera);
// });
