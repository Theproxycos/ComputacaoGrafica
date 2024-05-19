// MyGui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box } from './Models.js';
import { Estante } from './Models.js';
import { Armazem } from './Models.js';
import { Robot } from './Models.js';
import * as THREE from 'three';

export class MyGui {
  constructor(webgl) {
    this.webgl = webgl;
    this.activeControl = null;
    this.cameraTypeText = '';
    this.robotInstance = null;

    // Cria uma nova instância da interface gráfica
    const gui = new GUI();
    this.setupGui(gui);
  }

  setupGui(gui) {
    // Variáveis para controlar o estado da interface gráfica
    const guiVars = {
      drawBox: () => this.drawBox(),
      drawEstante: () => this.drawEstante(),
      drawArmazem: () => this.drawArmazem(),
      cleanScene: () => this.cleanScene(),
      switchCamera: () => this.switchCamera(),
      verRobot: () => this.verRobot(),
      animateRobot: () => this.animateRobot(),
      trackballControls: false,
      orbitControls: false,
      firstPersonControls: false,
      flyControls: false,
      
    };

    // Função para ativar um determinado controlo
    const activateControl = (controlName) => {
      if (this.activeControl !== controlName) {
        if (this.activeControl) {
          this.deactivateControl(this.activeControl);
        }
        this.activeControl = controlName;
        this.webgl.setupControl(controlName);
      }
    };

    // Adiciona opções à interface gráfica
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
    gui.add(guiVars, 'drawArmazem').name('Draw Armazem');
    gui.add(guiVars, 'cleanScene').name('Clean Scene');
    gui.add(guiVars, 'verRobot').name('Ver Robot');
    gui.add(guiVars, 'animateRobot').name('Ativar Robot');
    gui.add(guiVars, 'switchCamera').name('Switch Camera');
    gui.add(this, 'cameraTypeText').name('Camera Type').listen();
  }

  // Desativa um controlo específico
  deactivateControl(controlName) {
    if (this.activeControl === controlName) {
      this.webgl.disposeControl(controlName);
      this.activeControl = null;
    }
  }

  // Limpa a cena atual
  cleanScene() {
    while (this.webgl.scene.children.length > 0) {
      this.webgl.scene.remove(this.webgl.scene.children[0]);
    }
  }

  // Desenha uma caixa na cena
  drawBox() {
    this.cleanScene();
    const box = new Box(600, 300, 400, 30);
    this.webgl.scene.add(box);
    this.webgl.scene.add(new THREE.AxesHelper(50));

    // Adiciona luz natural para as sombras
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // color, intensity
    directionalLight.position.set(0, 1000, 0); 
    directionalLight.castShadow = true; 
    this.webgl.scene.add(directionalLight);

    // Configura propriedades de sombra para a luz
    directionalLight.shadow.mapSize.width = 2048; 
    directionalLight.shadow.mapSize.height = 2048; 
    directionalLight.shadow.camera.near = 0.5; 
    directionalLight.shadow.camera.far = 5000; 

    // Ativa a projeção de sombras para a caixa
    box.castShadow = true;
    box.receiveShadow = true;

    // Adiciona luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    this.webgl.scene.add(ambientLight); 
  }

  // Desenha uma estante na cena
  drawEstante() {
    this.cleanScene();
    const largura = 800;
    const espessura = 200;
    const altura = 1600;
    const profundidade = 300;
    const estante = new Estante(largura, altura, profundidade);

    // Ativa a projeção e receção de sombras para o estante
    estante.castShadow = true;
    estante.receiveShadow = true;

    this.webgl.scene.add(estante);
    this.webgl.scene.add(new THREE.AxesHelper(50));

    // Adiciona luz direcional para sombras
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // color, intensity
    directionalLight.position.set(0, 1000, 0); 
    directionalLight.castShadow = true; // ativar a projeção de sombras
    this.webgl.scene.add(directionalLight);

    // Configura propriedades de sombra para a luz
    directionalLight.shadow.mapSize.width = 2048; 
    directionalLight.shadow.mapSize.height = 2048; 
    directionalLight.shadow.camera.near = 0.5; 
    directionalLight.shadow.camera.far = 5000; 

    // Adiciona luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    this.webgl.scene.add(ambientLight);
  }

  // Desenha um armazém na cena
  drawArmazem() {
    this.cleanScene();
    
    const armazem = new Armazem(5000, 3000, 4000, 30);
    this.webgl.scene.add(armazem);
  
    const estante1 = new Estante(800, 1600, 300);
    const estante2 = new Estante(800, 1600, 300);
    const estante3 = new Estante(800, 1600, 300);
  
    estante1.position.set(3000, -1750, -1550);
    estante2.position.set(0, -1750, -1550);
    estante3.position.set(-3000, -1750, -1550);
  
    estante1.rotateY(Math.PI / 2);
    estante2.rotateY(Math.PI / 2);
    estante3.rotateY(Math.PI / 2);
  
    armazem.add(estante1);
    armazem.add(estante2);
    armazem.add(estante3);
  
    this.webgl.scene.add(armazem);
    
    armazem.receiveShadow = true;
    armazem.castShadow = true;
    
    // Adiciona luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
    this.webgl.scene.add(ambientLight); 

    // Acrescenta spotlights por cima de cada estante
    const spotLight1 = new THREE.SpotLight(0xffffff, 0.8); 
    spotLight1.position.set(3000, 1600, -1550); 
    spotLight1.castShadow = true; 
    spotLight1.target.position.set(3000, -1750, -1550); // aponta a luz para estante1
    this.webgl.scene.add(spotLight1);
    this.webgl.scene.add(spotLight1.target);

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.8); 
    spotLight2.position.set(0, 1600, -1550); 
    spotLight2.castShadow = true; 
    spotLight2.target.position.set(0, -1750, -1550); 
    this.webgl.scene.add(spotLight2);
    this.webgl.scene.add(spotLight2.target);

    const spotLight3 = new THREE.SpotLight(0xffffff, 0.8); 
    spotLight3.position.set(-3000, 1600, -1550); 
    spotLight3.castShadow = true; 
    spotLight3.target.position.set(-3000, -1750, -1550); 
    this.webgl.scene.add(spotLight3);
    this.webgl.scene.add(spotLight3.target);

    // Ajusta as propriedades do spotlight e as propriedades da sombra
    [spotLight1, spotLight2, spotLight3].forEach(light => {
      light.angle = Math.PI / 4; // ângulo do cone do spotlight
      light.penumbra = 0.1; // suavidade da borda
      light.decay = 2; // degradação da luz
      light.distance = 5000; // distância da luz

      // Propriedades da sombra
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 5000;
    });
  }
  
  // Verifica ou cria um robot na cena
  verRobot() {
    // Verifica se o robot já existe na cena
    if (!this.webgl.robot) {
      // Se não existir, cria o robot
      this.webgl.robot = new Robot();
      this.webgl.robot.position.set(-3100, -1360, -300); // Posição inicial do robot
      this.webgl.scene.add(this.webgl.robot);
      this.robotInstance = this.webgl.robot; 
    } else {
      // Se já existir, apenas torna-o visível
      this.webgl.robot.visible = true;
      this.robotInstance = this.webgl.robot; 
    }
  }

  // Animação do robot
  animateRobot() {
    const robot = this.robotInstance;
    if (robot) {
        const initialPosition = robot.position.clone();
        
        // Coordenadas das estantes inicial e final
        const startPosition = new THREE.Vector3(-3100, -1360, -300); // Posição da primeira estante
        const endPosition = new THREE.Vector3(8700, -1360, -300); // Posição da última estante
        
        // Calcular o caminho intermediário
        const middlePosition = startPosition.clone().lerp(endPosition, 0.5); // Ponto médio entre as estantes
        
        const duration = 5000; // Duração total do loop

        const animateForward = () => {
            const startTime = Date.now();
            const endTime = startTime + duration;
            const animate = () => {
                const now = Date.now();
                const t = Math.min(1, (now - startTime) / duration);
                robot.position.copy(initialPosition.clone().lerp(middlePosition, t));
                if (now < endTime) {
                    requestAnimationFrame(animate);
                } else {
                    animateBackward(); // Inicía movimento de volta
                }
            };
            animate();
        };

        const animateBackward = () => {
            const startTime = Date.now();
            const endTime = startTime + duration;
            const animate = () => {
                const now = Date.now();
                const t = Math.min(1, (now - startTime) / duration);
                robot.position.copy(middlePosition.clone().lerp(initialPosition, t));
                if (now < endTime) {
                    requestAnimationFrame(animate);
                } else {
                    animateForward(); // Inicía movimento para a frente
                }
            };
            animate();
        };

        animateForward(); // Inicia a animação de movimento para frente
    } else {
        console.error('Robot não encontrado na cena.');
    }
  }

  // Alterna entre câmera ortográfica e perspetiva
  switchCamera() {
    if (this.webgl.camera instanceof THREE.PerspectiveCamera) {
      this.webgl.camera = new THREE.OrthographicCamera(-5000, 5000, 4000, -4000, 0.1, 200000);
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 10000;
      this.webgl.camera.position.set(0, 0, 10000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Orthographic';
    } else {
      this.webgl.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1000, 200000);
      this.webgl.camera.position.set(0, 0, 10000);
      this.webgl.camera.lookAt(this.webgl.scene.position);
      this.cameraTypeText = 'Perspective';
    }

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
