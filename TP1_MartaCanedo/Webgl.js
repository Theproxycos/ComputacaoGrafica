// Webgl.js
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

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
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 5000);
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

    // Setup first person controls
    this.firstPersonControls = this.setupFirstPersonControls();

    // Atualizar os controles da primeira pessoa na troca de câmera
    this.setOrbitControlsAutoRotate = (value) => {
      this.orbitControls.autoRotate = value;
    };
  }

  setupFirstPersonControls() {
    const firstPersonControls = new FirstPersonControls(this.camera, this.renderer.domElement);

    
    firstPersonControls.movementSpeed = 100; // Ajuste conforme necessário
    firstPersonControls.lookSpeed = 0.1; // Ajuste conforme necessário
    
    firstPersonControls.noFly = true;
    firstPersonControls.lookVertical = true;
    firstPersonControls.constrainVertical = true;
    firstPersonControls.verticalMin = -Math.PI / 2; // Ângulo mínimo vertical
    firstPersonControls.verticalMax = Math.PI / 2; // Ângulo máximo vertical
    
    firstPersonControls.lon = 0; // Rotação horizontal inicial
    firstPersonControls.lat = 0; // Rotação vertical inicial

    

    return firstPersonControls;
  }

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.firstPersonControls.handleResize();
  }

  disposeFirstPersonControls() {
    this.firstPersonControls.dispose();

    // Configurar novos controles de primeira pessoa com a câmera atualizada
  this.firstPersonControls = this.setupFirstPersonControls();
  }

  updateFirstPersonControls() {
    // Descartar os controles de primeira pessoa existentes
    this.disposeFirstPersonControls();
  }

  render() {
    const delta = this.clock.getDelta();
    if (this.trackballControls.enabled) {
      this.trackballControls.update(delta);
    } else if (this.orbitControls.autoRotate) {
      this.orbitControls.update(delta);
    } else if (this.firstPersonControls.enabled) {
      this.firstPersonControls.update(delta);
      // Adicione a renderização da cena aqui quando os controles de primeira pessoa estiverem ativados
      this.renderer.render(this.scene, this.camera);
      return; // Retorne para evitar a renderização duplicada
    }
    this.renderer.render(this.scene, this.camera);
  }
}
