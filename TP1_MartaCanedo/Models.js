import * as THREE from 'three';

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
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.set(posX, posY, posZ);
    return panel;
  }
}

export class Estante extends THREE.Object3D {
  constructor(width, height, depth, boxWidth, boxHeight, boxDepth, boxThickness) {
    super();

    const numFloors = 3;
    const inclination = Math.PI / 6; // Ângulo de inclinação dos andares em radianos
    const gapBetweenBoxes = 20; // Espaço vazio entre as caixas e as bordas da estante

    // Criação da estrutura da estante
    const structureMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const supportGeometry = new THREE.BoxGeometry(10, height, depth);
    const leftSupport = new THREE.Mesh(supportGeometry, structureMaterial);
    const rightSupport = new THREE.Mesh(supportGeometry, structureMaterial);
    leftSupport.position.set(-width / 2, 0, 0);
    rightSupport.position.set(width / 2, 0, 0);
    this.add(leftSupport);
    this.add(rightSupport);

    // Adiciona os andares inclinados
    for (let i = 0; i < numFloors; i++) {
      const floor = this.createInclinedFloor(width, height, depth, inclination, i * (height / numFloors), gapBetweenBoxes);
      this.add(floor);
    }

    // Adiciona caixas em cada andar
    for (let i = 0; i < numFloors; i++) {
      const boxPosY = i * (height / numFloors) + gapBetweenBoxes / 2; // Posição Y da caixa
      const box1PosX = -width / 4; // Posição X da primeira caixa em cada andar
      const box2PosX = width / 4 - boxWidth; // Posição X da segunda caixa em cada andar

      const box1 = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
      box1.position.set(box1PosX, boxPosY, depth / 2 - boxThickness / 2);
      const box2 = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
      box2.position.set(box2PosX, boxPosY, -depth / 2 + boxThickness / 2);

      this.add(box1);
      this.add(box2);
    }
  }

  createInclinedFloor(width, height, depth, inclination, posY, gapBetweenBoxes) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = inclination;
    floor.position.y = posY - height / 2 + gapBetweenBoxes / 2;
    return floor;
  }
}