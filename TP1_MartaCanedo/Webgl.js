// Webgl.js
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'; // Importe os controles de primeira pessoa


export class Webgl {
  

  constructor() {
    this.clock = new THREE.Clock();

    const canvas = document.querySelector('#WebGL-canvas');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.useLegacyLights = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x555555);

    // Initialize with perspective camera
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000);
    this.camera.position.set(0, 0, 2000);
    this.camera.lookAt(this.scene.position);

    // Setup trackball controls
    this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
    this.trackballControls.rotateSpeed = 5.0;
    this.trackballControls.zoomSpeed = 1.0;
    this.trackballControls.panSpeed = 1.0;
    this.trackballControls.staticMoving = true;

    // Setup orbit controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.autoRotate = true;
    // Adicionando método para definir o estado da rotação automática dos OrbitControls
    this.setOrbitControlsAutoRotate = (value) => {
      this.orbitControls.autoRotate = value;
    
    // Setup first person controls
    this.firstPersonControls = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.firstPersonControls.movementSpeed = 100;
    this.firstPersonControls.lookSpeed = 0.1;
    this.firstPersonControls.noFly = true;
    this.firstPersonControls.lookVertical = true;
    this.firstPersonControls.constrainVertical = true;
    this.firstPersonControls.verticalMin = 1.0;
    this.firstPersonControls.verticalMax = 2.0;
    this.firstPersonControls.lon = -90;
    this.firstPersonControls.lat = 0;
  
    
    
    
    };
  }

  render() {
    const delta = this.clock.getDelta();
    if (this.firstPersonControls.enabled) {
      this.firstPersonControls.update(delta);
    } else if (this.trackballControls.enabled) {
      this.trackballControls.update(delta);
    } else if (this.orbitControls.autoRotate) {
      this.orbitControls.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }
}
