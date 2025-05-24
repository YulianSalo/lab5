// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// function main() {

// 	const canvas = document.querySelector( '#c' );
// 	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

// 	const fov = 45;
// 	const aspect = 2; // the canvas default
// 	const near = 0.1;
// 	const far = 100;
// 	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
// 	camera.position.set( 0, 10, 20 );

// 	const controls = new OrbitControls( camera, canvas );
// 	controls.target.set( 0, 5, 0 );
// 	controls.update();

// 	const scene = new THREE.Scene();
// 	scene.background = new THREE.Color( 'black' );

// 	{

// 		const planeSize = 40;

// 		const loader = new THREE.TextureLoader();
// 		const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
// 		texture.wrapS = THREE.RepeatWrapping;
// 		texture.wrapT = THREE.RepeatWrapping;
// 		texture.magFilter = THREE.NearestFilter;
// 		texture.colorSpace = THREE.SRGBColorSpace;
// 		const repeats = planeSize / 2;
// 		texture.repeat.set( repeats, repeats );

// 		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
// 		const planeMat = new THREE.MeshPhongMaterial( {
// 			map: texture,
// 			side: THREE.DoubleSide,
// 		} );
// 		const mesh = new THREE.Mesh( planeGeo, planeMat );
// 		mesh.rotation.x = Math.PI * - .5;
// 		scene.add( mesh );

// 	}

// 	{

// 		const skyColor = 0xB1E1FF; // light blue
// 		const groundColor = 0xB97A20; // brownish orange
// 		const intensity = 2;
// 		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
// 		scene.add( light );

// 	}

// 	{

// 		const color = 0xFFFFFF;
// 		const intensity = 2.5;
// 		const light = new THREE.DirectionalLight( color, intensity );
// 		light.position.set( 5, 10, 2 );
// 		scene.add( light );
// 		scene.add( light.target );

// 	}

// 	function frameArea( sizeToFitOnScreen, boxSize, boxCenter, camera ) {

// 		const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
// 		const halfFovY = THREE.MathUtils.degToRad( camera.fov * .5 );
// 		const distance = halfSizeToFitOnScreen / Math.tan( halfFovY );
// 		// compute a unit vector that points in the direction the camera is now
// 		// in the xz plane from the center of the box
// 		const direction = ( new THREE.Vector3() )
// 			.subVectors( camera.position, boxCenter )
// 			.multiply( new THREE.Vector3( 1, 0, 1 ) )
// 			.normalize();

// 		// move the camera to a position distance units way from the center
// 		// in whatever direction the camera was from the center already
// 		camera.position.copy( direction.multiplyScalar( distance ).add( boxCenter ) );

// 		// pick some near and far values for the frustum that
// 		// will contain the box.
// 		camera.near = boxSize / 100;
// 		camera.far = boxSize * 100;

// 		camera.updateProjectionMatrix();

// 		// point the camera to look at the center of the box
// 		camera.lookAt( boxCenter.x, boxCenter.y, boxCenter.z );

// 	}

// 	let cars;
// 	{

// 		const gltfLoader = new GLTFLoader();
// 		gltfLoader.load( 'https://threejs.org/manual/examples/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', ( gltf ) => {

// 			const root = gltf.scene;
// 			scene.add( root );
// 			cars = root.getObjectByName( 'Cars' );

// 			// compute the box that contains all the stuff
// 			// from root and below
// 			const box = new THREE.Box3().setFromObject( root );

// 			const boxSize = box.getSize( new THREE.Vector3() ).length();
// 			const boxCenter = box.getCenter( new THREE.Vector3() );

// 			// set the camera to frame the box
// 			frameArea( boxSize * 0.5, boxSize, boxCenter, camera );

// 			// update the Trackball controls to handle the new size
// 			controls.maxDistance = boxSize * 10;
// 			controls.target.copy( boxCenter );
// 			controls.update();

// 		} );

// 	}

// 	function resizeRendererToDisplaySize( renderer ) {

// 		const canvas = renderer.domElement;
// 		const width = canvas.clientWidth;
// 		const height = canvas.clientHeight;
// 		const needResize = canvas.width !== width || canvas.height !== height;
// 		if ( needResize ) {

// 			renderer.setSize( width, height, false );

// 		}

// 		return needResize;

// 	}

// 	function render( time ) {

// 		time *= 0.001; // convert to seconds

// 		if ( resizeRendererToDisplaySize( renderer ) ) {

// 			const canvas = renderer.domElement;
// 			camera.aspect = canvas.clientWidth / canvas.clientHeight;
// 			camera.updateProjectionMatrix();

// 		}

// 		if ( cars ) {

// 			for ( const car of cars.children ) {

// 				car.rotation.y = time;

// 			}

// 		}

// 		renderer.render( scene, camera );

// 		requestAnimationFrame( render );

// 	}

// 	requestAnimationFrame( render );

// }

// main();

import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;
let loader;
let model;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Не забуваємо про цей рядок коду.
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); 
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2); 
    scene.add(ambientLight);
    
    // Додаємо GLTF модель на сцену
    const modelUrl = 'https://salo-lab5-ar-vr.s3.us-east-2.amazonaws.com/scene.gltf';

    // Створюємо завантажувач
    loader = new GLTFLoader();
	loader.load(
        modelUrl,
        function (gltf) {
            model = gltf.scene;
            model.position.z = -10;
            scene.add(model);

            // // Створюємо матеріал для моделі (якщо потрібно)
            // const goldMaterial = new THREE.MeshStandardMaterial({
            //     color: 0xffd700, // Золотий колір
            //     metalness: 1,
            //     roughness: 0.1,
            // });
            
            // Змінюємо модель (якщо потрібно)
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = goldMaterial;
                    child.material.needsUpdate = true;
                }
            });

            console.log("Model added to scene");
        },

        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        function (error) {
            console.error(error);
        }
    );

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
}

function render() {
    rotateModel();
    renderer.render(scene, camera);
}
    
let degrees = 0; // кут для оберту нашої моделі
    
function rotateModel() {
    if (model !== undefined) {
        // допустима межа градусів - від 0 до 360
        // Після 360 three.js сприйматиме 360 як 0, 361 як 1, 362 як 2 і так далі
        degrees = degrees + 0.2; 
        model.rotation.x = THREE.MathUtils.degToRad(degrees); // тут перетворюємо градуси у радіани
    } 
}