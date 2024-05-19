import * as THREE from 'three';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';

// Carregador de texturas
const textureLoader = new THREE.TextureLoader();

// Carregando as texturas
const boxTexture = textureLoader.load('Texturas/brown-corrugated-paper-textured-background.jpg');
const shelfTexture = textureLoader.load('Texturas/grunge-wall-texture.jpg');
const floorTexture = textureLoader.load('Texturas/floor.jpg');
const wallTexture = textureLoader.load('Texturas/blank-concrete-white-wall-texture-background.jpg');
const robotTexture = textureLoader.load('Texturas/robotextura.jpg');

export class Box extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    // Inferior
    const bottom = this.createPanel(width, thickness, depth, 0, -height / 2 + thickness / 2, 0);
    this.add(bottom);

    // Laterais
    const front = this.createPanel(width, height, thickness, 0, 0, -depth / 2 + thickness / 2);
    const back = this.createPanel(width, height, thickness, 0, 0, depth / 2 - thickness / 2);
    const left = this.createPanel(thickness, height, depth - thickness * 2, -width / 2 + thickness / 2, 0, 0);
    const right = this.createPanel(thickness, height, depth - thickness * 2, width / 2 - thickness / 2, 0, 0);

    // Adiciona as laterais à caixa
    this.add(front);
    this.add(back);
    this.add(left);
    this.add(right);
  }

  createPanel(width, height, depth, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ map: boxTexture });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    panel.castShadow = true;
    return panel;
  }
}

export class Estante extends THREE.Object3D {
  constructor(largura, altura, profundidade, espessura) {
    super();

    // Cria três pisos da estante com as dimensões especificadas
    const piso1 = this.createPiso(largura, espessura, profundidade, -200, altura / 4, 0);
    piso1.rotation.set(0, 0, Math.PI / 15); // Rotação do primeiro piso
    this.add(piso1);
    this.addBoxesToPiso(piso1, 2); // Adiciona duas caixas ao primeiro piso

    const piso2 = this.createPiso(largura, espessura, profundidade, 0, altura / 2, 0);
    piso2.rotation.set(0, 0, Math.PI / 15); // Rotação do segundo piso
    this.add(piso2);
    this.addBoxesToPiso(piso2, 2); // Adiciona duas caixas ao segundo piso

    const piso3 = this.createPiso(largura, espessura, profundidade, -200, altura * 3 / 4, 0);
    piso3.rotation.set(0, 0, -Math.PI / 15); // Rotação do terceiro piso
    this.add(piso3);
    this.addBoxesToPiso(piso3, 2); // Adiciona duas caixas ao terceiro piso

    // Adiciona pernas à estante
    this.addLegs(largura, altura, profundidade, espessura);

    // Adiciona paredes nos limites dos pisos
    this.addWallsToEdges(largura, altura, profundidade, espessura);
  }

  createPiso(largura, altura, profundidade, posX, posY, posZ) {
    const geometry = new THREE.BoxGeometry(largura, altura, profundidade);
    const material = new THREE.MeshLambertMaterial({ map: shelfTexture });
    const piso = new THREE.Mesh(geometry, material);
    piso.position.set(posX, posY, posZ);
    piso.castShadow = true;
    return piso;
  }

  createLeg(altura) {
    const legGeometry = new THREE.BoxGeometry(30, altura, 30);
    const legMaterial = new THREE.MeshLambertMaterial({ map: shelfTexture });
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.castShadow = true;
    leg.receiveShadow = true;
    return leg;
  }

  addLegs(largura, altura, profundidade, espessura) {
    const legHeight = 1200; // Aumentar a altura das pernas
    const legOffsetX = largura / 2 - 25;
    const legOffsetZ = profundidade / 2 - 25;

    const frontLeftLeg = this.createLeg(legHeight);
    frontLeftLeg.position.set(-legOffsetX, 880, -legOffsetZ);
    this.add(frontLeftLeg);

    const frontRightLeg = this.createLeg(legHeight);
    frontRightLeg.position.set(170, 880, -legOffsetZ);
    this.add(frontRightLeg);

    const backLeftLeg = this.createLeg(legHeight);
    backLeftLeg.position.set(-legOffsetX, 880, legOffsetZ);
    this.add(backLeftLeg);

    const backRightLeg = this.createLeg(legHeight);
    backRightLeg.position.set(170, 880, legOffsetZ);
    this.add(backRightLeg);
  }

  addBoxesToPiso(piso, numBoxes) {
    const spacing = 10; // Espaçamento entre as caixas
    const boxWidth = 200;
    const boxHeight = 200; // Altura das caixas
    const boxDepth = 200; // Profundidade das caixas
    const totalWidth = boxWidth * numBoxes + spacing * (numBoxes - 1);

    let startX; // Posição inicial X para as caixas

    // Verifica os pisos
    if (piso === this.children[3]) { 
        startX = (piso.geometry.parameters.width / 2) + (totalWidth + 500) ;
    } else if (piso === this.children[2]) { // Se é o terceiro piso
        startX = (piso.geometry.parameters.width / 2) - (totalWidth - 80);
    } else { // Outros pisos, coloca a caixas para a esquerda
        startX = -(totalWidth / 2) -80;
    }

    for (let i = 0; i < numBoxes; i++) {
        const posX = startX + (boxWidth + spacing) * i;
        const box = new Box(boxWidth, boxHeight, boxDepth, 15);
        box.position.set(posX, piso.geometry.parameters.height / 2 + boxHeight / 2, 0);
        piso.add(box);
        box.castShadow = true;
    }
  }

  // Método para adicionar paredes nos limites dos pisos
  addWallsToEdges(largura, altura, profundidade, espessura) {
    const wallHeight = 100; // Altura das paredes

    // Angulo dos pisos em relação ao solo
    const pisoAngle1 = Math.PI / 15;
    const pisoAngle2 = Math.PI / 15;
    const pisoAngle3 = -Math.PI / 15;

    // Parede no lado esquerdo do primeiro piso
    const leftWall1 = this.createWall(espessura, wallHeight, profundidade);
    leftWall1.position.set(-600, 365, 0);
    leftWall1.rotation.set(0, 0, pisoAngle1); // Ajuste da rotação
    this.add(leftWall1);

    // Parede no lado esquerdo do segundo piso
    const leftWall2 = this.createWall(espessura, wallHeight, profundidade);
    leftWall2.position.set(-400, 765, 0);
    leftWall2.rotation.set(0, 0, pisoAngle2); // Ajuste da rotação
    this.add(leftWall2);

    // Parede no lado direito do terceiro piso
    const rightWall3 = this.createWall(espessura, wallHeight, profundidade);
    rightWall3.position.set(200, 1165, 0);
    rightWall3.rotation.set(0, 0, pisoAngle3); // Ajuste da rotação
    this.add(rightWall3);
}


  // Método para criar paredes
  createWall(largura, altura, profundidade) {
    const geometry = new THREE.BoxGeometry(largura, altura, profundidade);
    const material = new THREE.MeshLambertMaterial({ map: shelfTexture });
    const wall = new THREE.Mesh(geometry, material);
    wall.castShadow = true;
    wall.receiveShadow = true;
    return wall;
  }
}

export class Armazem extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    // Chão
    const floor = this.createArmazem(width * 2, thickness, depth, 0, -height / 2 + thickness / 2, 0, floorTexture);
    this.add(floor);

    // Parede de trás
    const backWall = this.createArmazem(width * 2, height, thickness, 0, 0, -depth / 2 + thickness / 2, wallTexture);
    this.add(backWall);

    // Parede da esquerda
    const leftWall = this.createArmazem(thickness, height, depth, -width + thickness / 2, 0, 0, wallTexture);
    this.add(leftWall);

    // Parede da direita
    const rightWall = this.createArmazem(thickness, height, depth, width - thickness / 2, 0, 0, wallTexture);
    this.add(rightWall);

    // Teto
    const ceiling = this.createArmazem(width * 2, thickness, depth, 0, height / 2 - thickness / 2, 0, wallTexture);
    this.add(ceiling);
  }

  createArmazem(width, height, depth, posX, posY, posZ, texture) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    panel.receiveShadow = true;
    return panel;
  }
}

export class Robot extends THREE.Object3D {
  constructor() {
    super();

    // Caixa principal do robot
    const bodyGeometry = new THREE.BoxGeometry(200, 400, 100);
    const bodyMaterial = new THREE.MeshLambertMaterial({ map: robotTexture });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 100;
    this.add(body);

    // Rodas do robot
    const wheelGeometry = new THREE.SphereGeometry(25, 40, 40);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheels = [];
    const wheelPositions = [
      [-75, -85, 50],
      [75, -85, 50],
      [-75, -85, -50],
      [75, -85, -50]
    ];
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(...pos);
      this.add(wheel);
      wheels.push(wheel);
    });

    // Braços do robot
    const armGeometry = new THREE.CylinderGeometry(20, 20, 200, 32);
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const arm1 = new THREE.Mesh(armGeometry, armMaterial);
    const arm2 = new THREE.Mesh(armGeometry, armMaterial);

    arm1.position.set(-90, 150, 0);
    arm2.position.set(90, 150, 0);

    arm1.rotation.z = -Math.PI / 4;
    arm2.rotation.z = Math.PI / 4;

    this.add(arm1);
    this.add(arm2);
  }
}
