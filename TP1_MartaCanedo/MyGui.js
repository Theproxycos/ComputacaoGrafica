// MyGui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box } from './Models.js';
import { Estante } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;
    this.activeControl = null;
    this.cameraTypeText = '';

    const gui = new GUI();
    this.setupGui(gui);
  }

  setupGui(gui) {
    const guiVars = {
      drawBox: () => this.drawBox(),
      drawEstante: () => this.drawEstante(),
      cleanScene: () => this.cleanScene(),
      switchCamera: () => this.switchCamera(),
      trackballControls: false,
      orbitControls: false,
      firstPersonControls: false,
      flyControls: false,
    };

    const activateControl = (controlName) => {
      if (this.activeControl !== controlName) {
        if (this.activeControl) {
          this.deactivateControl(this.activeControl);
        }
        this.activeControl = controlName;
        this.webgl.setupControl(controlName);
      }
    };

    gui.add(guiVars, 'trackballControls').name('Trackball Controls').onChange(value => {
      if (value) {
        activateControl('trackballControls');
      } else {
        this.deactivateControl('trackballControls');
      }
    });

    gui.add(guiVars, 'orbitControls').name('Orbit Auto Rotate').onChange(value => {
      if (value) {
        activateControl('orbitControls');
      } else {
        this.deactivateControl('orbitControls');
      }
    });

    gui.add(guiVars, 'firstPersonControls').name('First Person Controls').onChange(value => {
      if (value) {
        activateControl('firstPersonControls');
      } else {
        this.deactivateControl('firstPersonControls');
      }
    });

    gui.add(guiVars, 'flyControls').name('Fly Controls').onChange(value => {
      if (value) {
        activateControl('flyControls');
      } else {
        this.deactivateControl('flyControls');
      }
    });

    gui.add(guiVars, 'drawBox').name('Draw Box');
    gui.add(guiVars, 'drawEstante').name('Draw Estante');
    gui.add(guiVars, 'cleanScene').name('Clean Scene');
    gui.add(guiVars, 'switchCamera').name('Switch Camera');
    gui.add(this, 'cameraTypeText').name('Camera Type').listen();
  }

  deactivateControl(controlName) {
    if (this.activeControl === controlName) {
      this.webgl.disposeControl(controlName);
      this.activeControl = null;
    }
  }

  cleanScene() {
    while (this.webgl.scene.children.length > 0) {
      this.webgl.scene.remove(this.webgl.scene.children[0]);
    }
  }

  drawBox() {
    this.cleanScene();
    const box = new Box(600, 500, 600, 30);
    this.webgl.scene.add(box);
    this.webgl.scene.add(new THREE.AxesHelper(50));
  }

  drawEstante() {
    this.cleanScene();
    const estante = new Estante(25, 25, 700, 300, 400, 10);
    this.webgl.scene.add(estante);
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
    } else {
      this.webgl.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000);
      this.webgl.camera.position.set(0, 0, 2000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Perspective';
    }

    // Atualizar as referências dos controles da câmera
    if (this.webgl.trackballControls) {
      this.webgl.trackballControls.object = this.webgl.camera;
    }
    if (this.webgl.orbitControls) {
      this.webgl.orbitControls.object = this.webgl.camera;
    }
    if (this.webgl.firstPersonControls) {
      this.webgl.firstPersonControls.object = this.webgl.camera;
    }
    if (this.webgl.flyControls) {
      this.webgl.flyControls.object = this.webgl.camera;
    }
  }
}
