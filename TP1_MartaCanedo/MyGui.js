// MyGui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;
    this.cameraTypeText = 'Perspective';
    this.orbitControlsAutoRotateEnabled = true;

    const gui = new GUI();
    this.setupGui(gui);
  }

  setupGui(gui) {
    const guiVars = {
      drawBox: () => this.drawBox(),
      cleanScene: () => this.cleanScene(),
      switchCamera: () => this.switchCamera(),
      toggleTrackballControls: this.webgl.trackballControls.enabled,
      toggleOrbitControlsAutoRotate: this.orbitControlsAutoRotateEnabled,
      toggleFirstPersonControls: this.webgl.firstPersonControls.enabled,
    };

    gui.add(guiVars, 'toggleTrackballControls').name('Trackball Controls').onChange(value => {
      this.webgl.trackballControls.enabled = value;
    });

    gui.add(guiVars, 'toggleOrbitControlsAutoRotate').name('Orbit Auto Rotate').onChange(value => {
      this.orbitControlsAutoRotateEnabled = value;
      this.webgl.setOrbitControlsAutoRotate(value);
    });

    gui.add(guiVars, 'toggleFirstPersonControls').name('First Person Controls').onChange(value => {
      this.webgl.firstPersonControls.enabled = value;
    });

    gui.add(guiVars, 'drawBox').name('Draw Box');
    gui.add(guiVars, 'cleanScene').name('Clean Scene');
    gui.add(guiVars, 'switchCamera').name('Switch Camera');
    gui.add(this, 'cameraTypeText').name('Camera Type').listen();
  }

  cleanScene() {
    while (this.webgl.scene.children.length > 0) {
      this.webgl.scene.remove(this.webgl.scene.children[0]);
    }
  }

  drawBox() {
    this.cleanScene();
    const box = new Box(200, 150, 200, 5);
    this.webgl.scene.add(box);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  switchCamera() {
    if (this.webgl.camera instanceof THREE.PerspectiveCamera) {
      this.webgl.camera = new THREE.OrthographicCamera(-300, 500, 400, -400, 0.1, 10000);
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 1000;
      this.webgl.camera.position.set(0, 0, 5000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Orthographic';
      this.webgl.updateFirstPersonControls();
    } else {
      this.webgl.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000);
      this.webgl.camera.position.set(0, 0, 2000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Perspective';
      this.webgl.updateFirstPersonControls();
    }

    // Atualizar as referências dos controles da câmera
    this.webgl.trackballControls.object = this.webgl.camera;
    this.webgl.orbitControls.object = this.webgl.camera;
    this.webgl.firstPersonControls.object = this.webgl.camera;
  }

  
}
