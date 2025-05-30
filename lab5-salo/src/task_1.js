import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer;
let octahedronMesh, capsuleMesh, icosahedronMesh;
let controls;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Сцена
    scene = new THREE.Scene();

    // Камера
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    // Об'єкт рендерингу
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.xr.enabled = true; // Життєво важливий рядок коду для вашого застосунку!
    container.appendChild(renderer.domElement);

    // Світло
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 10);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // 1. Створюємо об'єкт Octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(0.25, 0);
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.1,
    });
    octahedronMesh = new THREE.Mesh(octahedronGeometry, metalMaterial);
    octahedronMesh.position.x = -0.5; // Змінено з -1.5 на -0.5
    scene.add(octahedronMesh);

    // 2. Створюємо об'єкт Capsule
    const capsuleGeometry = new THREE.CapsuleGeometry(0.15, 0.3, 10, 20);
    const vibrantMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff7f,
        shininess: 30,
    });
    capsuleMesh = new THREE.Mesh(capsuleGeometry, vibrantMaterial);
    capsuleMesh.position.x = 0; // Залишено 0
    scene.add(capsuleMesh);

    // 3. Створюємо об'єкт Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(0.2, 0);
    const transparentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffa07a,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.3,
        transmission: 0.6,
    });
    icosahedronMesh = new THREE.Mesh(icosahedronGeometry, transparentMaterial);
    icosahedronMesh.position.x = 0.5; // Змінено з 1.5 на 0.5
    scene.add(icosahedronMesh);

    // Позиція для камери
    camera.position.z = 3;

    // Контролери для 360 огляду на вебсторінці, але не під час AR-сеансу
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    document.body.appendChild(ARButton.createButton(renderer));

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
    controls.update();
}

function render() {
    rotateObjects();
    renderer.render(scene, camera);
}

function rotateObjects() {
    octahedronMesh.rotation.y += 0.01;
    capsuleMesh.rotation.z -= 0.01;
    icosahedronMesh.rotation.x += 0.01;
}
