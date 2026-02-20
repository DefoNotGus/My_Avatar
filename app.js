import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Clock
let mixer;
const clock = new THREE.Clock(); 
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;
camera.position.y = 1.5;
camera.position.x = .2;
camera.rotation.y = 0.35; 

// Renderer with transparent background
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let mascot;
let headBone;
let leftArm;
let rightArm;
const gltfLoader = new GLTFLoader();

gltfLoader.load('tag2.glb', (gltf) => {
  mascot = gltf.scene;
  headBone = mascot.getObjectByName('mixamorigHead');
  
  leftArm = mascot.getObjectByName('mixamorigLeftArm');
  rightArm = mascot.getObjectByName('mixamorigRightArm');

  mascot.scale.set(1, 1, 1); 
  scene.add(mascot);

  mixer = new THREE.AnimationMixer(mascot);
  if (gltf.animations.length > 0) {
    mixer.clipAction(gltf.animations[0]).play();
  }
});

// Mouse tracking
const mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  
  if (headBone) {
    headBone.rotation.y = mouse.x * Math.PI * 0.25;
    headBone.rotation.x = -mouse.y * Math.PI * 0.25; 
  }

  // Force the arms down after the mixer has updated
  if (leftArm) {
    leftArm.rotation.x = Math.PI * 0.45; // Adjust this number to get the perfect angle
  }
  if (rightArm) {
    rightArm.rotation.x = -Math.PI * -0.45; 
  }

  renderer.render(scene, camera);
}

animate();

// Find your container
const container = document.getElementById('avatar-container');

// Append the renderer to the div instead of document.body
container.appendChild(renderer.domElement);
