import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// CAMERA

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0.7, 2);

// SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 1, 20);

// LIGHT

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(1, 0.5, 0);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 1;
dirLight.shadow.camera.bottom = -1;
dirLight.shadow.camera.left = -1;
dirLight.shadow.camera.right = 1;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 3;
scene.add(dirLight);

//  LOADER

const gltfloader = new GLTFLoader();
gltfloader.load("src/models/gltf/Shiba.glb", function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  model.traverse(function (object) {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });

  const skeleton = new THREE.SkeletonHelper(model);
  skeleton.visible = true;
  scene.add(skeleton);
});

// PLANE

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// RENDERER

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
document.body.appendChild(renderer.domElement);

// HELPERS

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const helper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(helper);

// CONTROLS

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
