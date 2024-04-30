import * as THREE from 'three';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';


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
  constructor(lp, ep, ap, lt, et, at) {
    super();

    const pae = this.createMesh(new THREE.BoxGeometry(lp, ap, ep, 16, 16, 16), 0xff00ff); // perna anterior esquerda
    pae.translateX(lp / 2);
    pae.translateY(ap / 2);
    pae.translateZ(-ep / 2);
    pae.add(new THREE.AxesHelper(10));

    const pad = this.createMesh(new THREE.BoxGeometry(lp, ap, ep, 16, 16, 16), 0xff00ff); // perna anterior direita
    pad.translateX(lp / 2 + lt - lp);
    pad.translateY(ap / 2);
    pad.translateZ(-ep / 2);
    pad.add(new THREE.AxesHelper(10));

    const ppe = this.createMesh(new THREE.BoxGeometry(lp, ap, ep, 16, 16, 16), 0xff00ff); // perna posterior esquerda
    ppe.translateX(lp / 2);
    ppe.translateY(ap / 2);
    ppe.translateZ(-ep / 2 - et + ep);
    ppe.add(new THREE.AxesHelper(10));

    const ppd = this.createMesh(new THREE.BoxGeometry(lp, ap, ep, 16, 16, 16), 0xff00ff); // perna posterior esquerda
    ppd.translateX(lp / 2 + lt - lp);
    ppd.translateY(ap / 2);
    ppd.translateZ(-ep / 2 - et + ep);
    ppd.add(new THREE.AxesHelper(10));

    const tampo1 = this.createMesh(new THREE.BoxGeometry(lt, at, et, 16, 16, 16), 0x000000); // tampo
    tampo1.translateX(lt / 2);
    tampo1.translateY(at / 2 + ap / 8);
    tampo1.translateZ(-et / 2);

    const angleRadians1 = Math.PI / 12; // Por exemplo, 45 graus
    const angleRadians2 = Math.PI / -12;
    const angleRadians3 = Math.PI / 12;

    const axisX = new THREE.Vector3(1, 0, 0); // Eixo X

    tampo1.rotateOnAxis(axisX, angleRadians1);
    tampo1.add(new THREE.AxesHelper(10));

    const tampo2 = this.createMesh(new THREE.BoxGeometry(lt, at, et, 16, 16, 16), 0x000000); // tampo
    tampo2.translateX(lt / 2);
    tampo2.translateY(at / 2 + ap / 2);
    tampo2.translateZ(-et / 2);
    
    tampo2.rotateOnAxis(axisX, angleRadians2);
    tampo2.add(new THREE.AxesHelper(10));

    const tampo3 = this.createMesh(new THREE.BoxGeometry(lt, at, et, 16, 16, 16), 0x000000); // tampo
    tampo3.translateX(lt / 2);
    tampo3.translateY(at / 2 + ap - 100 );
    tampo3.translateZ(-et / 2);

    tampo3.rotateOnAxis(axisX, angleRadians3);
    tampo3.add(new THREE.AxesHelper(10));

    this.add(pae);
    this.add(pad);
    this.add(ppe);
    this.add(ppd);
    this.add(tampo1);
    this.add(tampo2);
    this.add(tampo3);
  }
  createMesh(geom, color) {
    // assign two materials
    const meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    const wireFrameMat = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    wireFrameMat.wireframe = false;

    // create a multimaterial
    const mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
  }
}