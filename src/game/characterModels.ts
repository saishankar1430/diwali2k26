import * as THREE from 'three';
import { CharacterPose } from '../types/game';

export interface CoupleActor {
  root: THREE.Group;
  heeruGroup: THREE.Group;
  sushiiGroup: THREE.Group;
  catGroup: THREE.Group;
  sparklerHeeru: THREE.Group;
  sparklerSushii: THREE.Group;
  sweetsPlate: THREE.Group;
  currentPose: CharacterPose;
  setPose: (pose: CharacterPose) => void;
  updateAnimation: (delta: number, isMoving: boolean) => void;
  setSparklersVisible: (visible: boolean) => void;
}

export function createCoupleActor(): CoupleActor {
  const root = new THREE.Group();
  root.name = 'CoupleAndPet';

  // Materials with varied roughness/metalness
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#fed8b1',
    roughness: 0.65,
    metalness: 0.05,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: '#1a1412',
    roughness: 0.85,
    metalness: 0.1,
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: '#111111' });
  const bindiMat = new THREE.MeshBasicMaterial({ color: '#d32f2f' });

  // Heeru's festive cream kurta & pajamas
  const heeruKurtaMat = new THREE.MeshStandardMaterial({
    color: '#fdfbf7',
    roughness: 0.45,
    metalness: 0.15,
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: '#e6b800',
    roughness: 0.3,
    metalness: 0.7,
  });
  const heeruPajamaMat = new THREE.MeshStandardMaterial({
    color: '#eae6df',
    roughness: 0.6,
    metalness: 0.05,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: '#261b17',
    roughness: 0.4,
    metalness: 0.2,
  });

  // Sushii's festive yellow choli & red lehenga skirt
  const sushiiCholiMat = new THREE.MeshStandardMaterial({
    color: '#f9a825',
    roughness: 0.4,
    metalness: 0.2,
  });
  const sushiiSkirtMat = new THREE.MeshStandardMaterial({
    color: '#c62828',
    roughness: 0.5,
    metalness: 0.15,
  });
  const bangleMat = new THREE.MeshStandardMaterial({
    color: '#ffd700',
    roughness: 0.2,
    metalness: 0.85,
  });

  // Cat materials
  const catFurMat = new THREE.MeshStandardMaterial({
    color: '#e67e22',
    roughness: 0.8,
    metalness: 0.05,
  });
  const catWhiteMat = new THREE.MeshStandardMaterial({
    color: '#fefefe',
    roughness: 0.75,
    metalness: 0.05,
  });
  const catPinkMat = new THREE.MeshStandardMaterial({
    color: '#ffb6c1',
    roughness: 0.6,
    metalness: 0.05,
  });

  // -------------------------------------------------------------
  // HEERU (Male Character - placed on the right side)
  // -------------------------------------------------------------
  const heeruGroup = new THREE.Group();
  heeruGroup.position.set(0.24, 0, 0);

  // Heeru Pelvis & Torso
  const heeruTorsoGroup = new THREE.Group();
  heeruTorsoGroup.position.set(0, 0.75, 0);

  // Kurta Main Body
  const heeruBodyGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 12);
  const heeruBody = new THREE.Mesh(heeruBodyGeom, heeruKurtaMat);
  heeruBody.castShadow = true;
  heeruTorsoGroup.add(heeruBody);

  // Kurta Gold Placket / Collar
  const heeruCollarGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.06, 12);
  const heeruCollar = new THREE.Mesh(heeruCollarGeom, goldTrimMat);
  heeruCollar.position.y = 0.26;
  heeruTorsoGroup.add(heeruCollar);

  const placketGeom = new THREE.BoxGeometry(0.04, 0.3, 0.02);
  const placket = new THREE.Mesh(placketGeom, goldTrimMat);
  placket.position.set(0, 0.1, 0.2);
  heeruTorsoGroup.add(placket);

  // Heeru Head
  const heeruHeadGroup = new THREE.Group();
  heeruHeadGroup.position.set(0, 0.38, 0);

  const heeruHeadGeom = new THREE.SphereGeometry(0.17, 16, 16);
  heeruHeadGeom.scale(1, 1.08, 1);
  const heeruHead = new THREE.Mesh(heeruHeadGeom, skinMat);
  heeruHead.castShadow = true;
  heeruHeadGroup.add(heeruHead);

  // Heeru Hair
  const heeruHairGeom = new THREE.SphereGeometry(0.18, 16, 16);
  heeruHairGeom.scale(1.04, 0.85, 1.08);
  const heeruHair = new THREE.Mesh(heeruHairGeom, hairMat);
  heeruHair.position.set(0, 0.06, -0.02);
  heeruHeadGroup.add(heeruHair);

  const heeruBangsGeom = new THREE.BoxGeometry(0.22, 0.08, 0.08);
  const heeruBangs = new THREE.Mesh(heeruBangsGeom, hairMat);
  heeruBangs.position.set(0.02, 0.1, 0.13);
  heeruBangs.rotation.z = -0.15;
  heeruHeadGroup.add(heeruBangs);

  // Heeru Eyes
  [-0.06, 0.06].forEach((eyeX) => {
    const eyeGeom = new THREE.SphereGeometry(0.022, 8, 8);
    const eye = new THREE.Mesh(eyeGeom, eyeMat);
    eye.position.set(eyeX, 0.01, 0.155);
    eye.scale.set(1, 1.2, 0.5);
    heeruHeadGroup.add(eye);
  });

  heeruTorsoGroup.add(heeruHeadGroup);

  // Heeru Arms
  const createHeeruArm = (isLeft: boolean) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(isLeft ? -0.22 : 0.22, 0.2, 0);

    const sleeveGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.26, 8);
    const sleeve = new THREE.Mesh(sleeveGeom, heeruKurtaMat);
    sleeve.position.y = -0.13;
    armPivot.add(sleeve);

    const handGeom = new THREE.SphereGeometry(0.045, 8, 8);
    const hand = new THREE.Mesh(handGeom, skinMat);
    hand.position.y = -0.28;
    armPivot.add(hand);

    return armPivot;
  };

  const heeruLeftArm = createHeeruArm(true);
  const heeruRightArm = createHeeruArm(false);
  heeruTorsoGroup.add(heeruLeftArm);
  heeruTorsoGroup.add(heeruRightArm);

  heeruGroup.add(heeruTorsoGroup);

  // Heeru Legs
  const createHeeruLeg = (isLeft: boolean) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(isLeft ? -0.09 : 0.09, 0.5, 0);

    const legGeom = new THREE.CylinderGeometry(0.06, 0.05, 0.44, 8);
    const leg = new THREE.Mesh(legGeom, heeruPajamaMat);
    leg.position.y = -0.22;
    leg.castShadow = true;
    legPivot.add(leg);

    const shoeGeom = new THREE.BoxGeometry(0.08, 0.06, 0.14);
    const shoe = new THREE.Mesh(shoeGeom, shoeMat);
    shoe.position.set(0, -0.45, 0.03);
    legPivot.add(shoe);

    return legPivot;
  };

  const heeruLeftLeg = createHeeruLeg(true);
  const heeruRightLeg = createHeeruLeg(false);
  heeruGroup.add(heeruLeftLeg);
  heeruGroup.add(heeruRightLeg);

  // Sweets plate attached to Heeru's hand
  const sweetsPlate = new THREE.Group();
  const plateGeom = new THREE.CylinderGeometry(0.14, 0.12, 0.02, 12);
  const plateMat = new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 0.8, roughness: 0.2 });
  const plate = new THREE.Mesh(plateGeom, plateMat);
  sweetsPlate.add(plate);

  // Sweet pieces
  const sweet1Geom = new THREE.SphereGeometry(0.035, 6, 6);
  const sweet1Mat = new THREE.MeshStandardMaterial({ color: '#ffb300' });
  const sweet1 = new THREE.Mesh(sweet1Geom, sweet1Mat);
  sweet1.position.set(0.04, 0.03, 0);
  sweetsPlate.add(sweet1);

  const sweet2Geom = new THREE.BoxGeometry(0.05, 0.02, 0.05);
  const sweet2Mat = new THREE.MeshStandardMaterial({ color: '#e0e0e0', metalness: 0.5 });
  const sweet2 = new THREE.Mesh(sweet2Geom, sweet2Mat);
  sweet2.position.set(-0.04, 0.03, 0);
  sweetsPlate.add(sweet2);

  sweetsPlate.position.set(0, -0.28, 0.12);
  sweetsPlate.visible = false;
  heeruRightArm.add(sweetsPlate);

  // -------------------------------------------------------------
  // SUSHII (Female Character - placed on the left side)
  // -------------------------------------------------------------
  const sushiiGroup = new THREE.Group();
  sushiiGroup.position.set(-0.24, 0, 0);

  const sushiiTorsoGroup = new THREE.Group();
  sushiiTorsoGroup.position.set(0, 0.72, 0);

  // Sushii Choli Top
  const sushiiCholiGeom = new THREE.CylinderGeometry(0.15, 0.17, 0.28, 12);
  const sushiiCholi = new THREE.Mesh(sushiiCholiGeom, sushiiCholiMat);
  sushiiCholi.castShadow = true;
  sushiiTorsoGroup.add(sushiiCholi);

  const choliNeckGeom = new THREE.TorusGeometry(0.13, 0.015, 8, 16);
  const choliNeck = new THREE.Mesh(choliNeckGeom, goldTrimMat);
  choliNeck.rotation.x = Math.PI / 2;
  choliNeck.position.y = 0.14;
  sushiiTorsoGroup.add(choliNeck);

  // Sushii Flared Pleated Lehenga Skirt
  const skirtGeom = new THREE.CylinderGeometry(0.17, 0.42, 0.52, 16, 1, true);
  const skirt = new THREE.Mesh(skirtGeom, sushiiSkirtMat);
  skirt.position.set(0, -0.22, 0);
  skirt.castShadow = true;
  sushiiTorsoGroup.add(skirt);

  const borderGeom = new THREE.TorusGeometry(0.42, 0.02, 8, 20);
  const border = new THREE.Mesh(borderGeom, goldTrimMat);
  border.rotation.x = Math.PI / 2;
  border.position.y = -0.48;
  sushiiTorsoGroup.add(border);

  // Sushii Head
  const sushiiHeadGroup = new THREE.Group();
  sushiiHeadGroup.position.set(0, 0.32, 0);

  const sushiiHeadGeom = new THREE.SphereGeometry(0.16, 16, 16);
  const sushiiHead = new THREE.Mesh(sushiiHeadGeom, skinMat);
  sushiiHead.castShadow = true;
  sushiiHeadGroup.add(sushiiHead);

  // Sushii Hair
  const sushiiHairGeom = new THREE.SphereGeometry(0.175, 16, 16);
  sushiiHairGeom.scale(1.05, 0.95, 1.08);
  const sushiiHair = new THREE.Mesh(sushiiHairGeom, hairMat);
  sushiiHair.position.set(0, 0.04, -0.02);
  sushiiHeadGroup.add(sushiiHair);

  const bunGeom = new THREE.SphereGeometry(0.08, 12, 12);
  const bun = new THREE.Mesh(bunGeom, hairMat);
  bun.position.set(0, 0.04, -0.16);
  sushiiHeadGroup.add(bun);

  const gajraGeom = new THREE.TorusGeometry(0.08, 0.02, 6, 16);
  const gajraMat = new THREE.MeshStandardMaterial({ color: '#fff9c4', roughness: 0.6 });
  const gajra = new THREE.Mesh(gajraGeom, gajraMat);
  gajra.position.set(0, 0.04, -0.16);
  sushiiHeadGroup.add(gajra);

  const bindiGeom = new THREE.CircleGeometry(0.016, 12);
  const bindi = new THREE.Mesh(bindiGeom, bindiMat);
  bindi.position.set(0, 0.045, 0.162);
  sushiiHeadGroup.add(bindi);

  [-0.055, 0.055].forEach((eyeX) => {
    const eyeGeom = new THREE.SphereGeometry(0.022, 8, 8);
    const eye = new THREE.Mesh(eyeGeom, eyeMat);
    eye.position.set(eyeX, -0.005, 0.15);
    eye.scale.set(1, 1.25, 0.5);
    sushiiHeadGroup.add(eye);
  });

  sushiiTorsoGroup.add(sushiiHeadGroup);

  // Sushii Arms with Bangles
  const createSushiiArm = (isLeft: boolean) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(isLeft ? -0.19 : 0.19, 0.14, 0);

    const sleeveGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8);
    const sleeve = new THREE.Mesh(sleeveGeom, sushiiCholiMat);
    sleeve.position.y = -0.06;
    armPivot.add(sleeve);

    const forearmGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.16, 8);
    const forearm = new THREE.Mesh(forearmGeom, skinMat);
    forearm.position.y = -0.18;
    armPivot.add(forearm);

    const bangleGeom = new THREE.TorusGeometry(0.042, 0.008, 6, 12);
    const bangles = new THREE.Mesh(bangleGeom, bangleMat);
    bangles.rotation.x = Math.PI / 2;
    bangles.position.y = -0.23;
    armPivot.add(bangles);

    const handGeom = new THREE.SphereGeometry(0.038, 8, 8);
    const hand = new THREE.Mesh(handGeom, skinMat);
    hand.position.y = -0.27;
    armPivot.add(hand);

    return armPivot;
  };

  const sushiiLeftArm = createSushiiArm(true);
  const sushiiRightArm = createSushiiArm(false);
  sushiiTorsoGroup.add(sushiiLeftArm);
  sushiiTorsoGroup.add(sushiiRightArm);

  sushiiGroup.add(sushiiTorsoGroup);

  // -------------------------------------------------------------
  // GINGER TABBY KITTEN
  // -------------------------------------------------------------
  const catGroup = new THREE.Group();
  catGroup.position.set(0.65, 0, 0.1);

  const catBodyGeom = new THREE.CapsuleGeometry(0.1, 0.22, 8, 8);
  catBodyGeom.rotateX(Math.PI / 2);
  const catBody = new THREE.Mesh(catBodyGeom, catFurMat);
  catBody.position.y = 0.18;
  catBody.castShadow = true;
  catGroup.add(catBody);

  const chestGeom = new THREE.SphereGeometry(0.08, 8, 8);
  const chest = new THREE.Mesh(chestGeom, catWhiteMat);
  chest.position.set(0, 0.15, 0.1);
  catGroup.add(chest);

  const catHeadGroup = new THREE.Group();
  catHeadGroup.position.set(0, 0.26, 0.16);

  const catHeadGeom = new THREE.SphereGeometry(0.1, 12, 12);
  const catHead = new THREE.Mesh(catHeadGeom, catFurMat);
  catHeadGroup.add(catHead);

  [-0.055, 0.055].forEach((earX) => {
    const earGeom = new THREE.ConeGeometry(0.04, 0.08, 4);
    const ear = new THREE.Mesh(earGeom, catFurMat);
    ear.position.set(earX, 0.1, 0);
    ear.rotation.z = earX > 0 ? -0.2 : 0.2;
    catHeadGroup.add(ear);

    const innerEarGeom = new THREE.ConeGeometry(0.025, 0.05, 4);
    const innerEar = new THREE.Mesh(innerEarGeom, catPinkMat);
    innerEar.position.set(earX, 0.09, 0.015);
    innerEar.rotation.z = ear.rotation.z;
    catHeadGroup.add(innerEar);
  });

  [-0.035, 0.035].forEach((eyeX) => {
    const eyeGeom = new THREE.SphereGeometry(0.018, 6, 6);
    const eye = new THREE.Mesh(eyeGeom, eyeMat);
    eye.position.set(eyeX, 0.01, 0.09);
    catHeadGroup.add(eye);
  });

  const noseGeom = new THREE.SphereGeometry(0.012, 6, 6);
  const nose = new THREE.Mesh(noseGeom, catPinkMat);
  nose.position.set(0, -0.015, 0.1);
  catHeadGroup.add(nose);

  catGroup.add(catHeadGroup);

  const catLegs: THREE.Group[] = [];
  const legPositions = [
    [-0.07, 0.1, 0.1],
    [0.07, 0.1, 0.1],
    [-0.07, 0.1, -0.1],
    [0.07, 0.1, -0.1],
  ];
  legPositions.forEach(([lx, ly, lz]) => {
    const legPiv = new THREE.Group();
    legPiv.position.set(lx, ly, lz);
    const legGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 6);
    const leg = new THREE.Mesh(legGeom, catFurMat);
    leg.position.y = -0.06;
    legPiv.add(leg);
    catGroup.add(legPiv);
    catLegs.push(legPiv);
  });

  const catTailPiv = new THREE.Group();
  catTailPiv.position.set(0, 0.2, -0.16);
  const tailGeom = new THREE.CylinderGeometry(0.02, 0.015, 0.22, 6);
  const tail = new THREE.Mesh(tailGeom, catFurMat);
  tail.position.set(0, 0.1, -0.05);
  tail.rotation.x = -0.6;
  catTailPiv.add(tail);
  catGroup.add(catTailPiv);

  // Sparklers
  const createSparkler = () => {
    const spGroup = new THREE.Group();
    const stickGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6);
    const stickMat = new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.9, roughness: 0.2 });
    const stick = new THREE.Mesh(stickGeom, stickMat);
    stick.position.y = 0.15;
    spGroup.add(stick);

    const tipGeom = new THREE.SphereGeometry(0.025, 8, 8);
    const tipMat = new THREE.MeshBasicMaterial({ color: '#ffea00' });
    const tip = new THREE.Mesh(tipGeom, tipMat);
    tip.position.y = 0.32;
    spGroup.add(tip);

    spGroup.visible = false;
    return spGroup;
  };

  const sparklerHeeru = createSparkler();
  heeruRightArm.add(sparklerHeeru);
  sparklerHeeru.position.set(0, -0.28, 0.06);

  const sparklerSushii = createSparkler();
  sushiiLeftArm.add(sparklerSushii);
  sparklerSushii.position.set(0, -0.28, 0.06);

  root.add(heeruGroup);
  root.add(sushiiGroup);
  root.add(catGroup);

  // Current Pose State
  let currentPose: CharacterPose = 'idle';
  let walkPhase = 0;

  const setPose = (pose: CharacterPose) => {
    currentPose = pose;
    sweetsPlate.visible = pose === 'offer_sweet';
  };

  const updateAnimation = (delta: number, isMoving: boolean) => {
    const lerpSpeed = 7.0;

    if (isMoving && currentPose === 'idle') {
      walkPhase += delta * 7.5;
      const swing = Math.sin(walkPhase);
      const bob = Math.abs(Math.sin(walkPhase * 2)) * 0.04;

      // Heeru Walk
      heeruLeftLeg.rotation.x = swing * 0.55;
      heeruRightLeg.rotation.x = -swing * 0.55;
      heeruLeftArm.rotation.x = -swing * 0.45;
      heeruRightArm.rotation.x = swing * 0.45;
      heeruRightArm.rotation.y = 0;
      heeruRightArm.rotation.z = 0;
      heeruTorsoGroup.position.y = 0.75 + bob;
      heeruTorsoGroup.rotation.x = 0;
      heeruHeadGroup.rotation.x = 0;
      heeruHeadGroup.rotation.y = 0;
      heeruHeadGroup.rotation.z = Math.sin(walkPhase) * 0.03;

      // Sushii Walk
      sushiiLeftArm.rotation.x = swing * 0.45;
      sushiiRightArm.rotation.x = -swing * 0.45;
      sushiiLeftArm.rotation.y = 0;
      sushiiLeftArm.rotation.z = 0;
      sushiiTorsoGroup.position.y = 0.72 + bob;
      sushiiTorsoGroup.rotation.x = 0;
      skirt.rotation.z = Math.sin(walkPhase) * 0.08;
      skirt.rotation.x = 0;
      sushiiHeadGroup.rotation.x = 0;
      sushiiHeadGroup.rotation.y = 0;
      sushiiHeadGroup.rotation.z = -Math.sin(walkPhase) * 0.03;

      // Cat Walk
      catLegs[0].rotation.x = swing * 0.6;
      catLegs[1].rotation.x = -swing * 0.6;
      catLegs[2].rotation.x = -swing * 0.6;
      catLegs[3].rotation.x = swing * 0.6;
      catBody.position.y = 0.18 + Math.abs(Math.sin(walkPhase * 2)) * 0.02;
      catTailPiv.rotation.y = Math.sin(walkPhase * 1.5) * 0.35;
      return;
    }

    // Interactive Cinematic Poses
    switch (currentPose) {
      case 'bend': {
        // Bending down to diya / anar / chakri
        const targetTorsoY = 0.54;
        heeruTorsoGroup.position.y = THREE.MathUtils.damp(heeruTorsoGroup.position.y, targetTorsoY, lerpSpeed, delta);
        heeruTorsoGroup.rotation.x = THREE.MathUtils.damp(heeruTorsoGroup.rotation.x, 0.55, lerpSpeed, delta);
        heeruRightArm.rotation.x = THREE.MathUtils.damp(heeruRightArm.rotation.x, -1.2, lerpSpeed, delta);
        heeruRightArm.rotation.z = THREE.MathUtils.damp(heeruRightArm.rotation.z, -0.2, lerpSpeed, delta);
        heeruHeadGroup.rotation.x = THREE.MathUtils.damp(heeruHeadGroup.rotation.x, 0.35, lerpSpeed, delta);

        sushiiTorsoGroup.position.y = THREE.MathUtils.damp(sushiiTorsoGroup.position.y, targetTorsoY, lerpSpeed, delta);
        sushiiTorsoGroup.rotation.x = THREE.MathUtils.damp(sushiiTorsoGroup.rotation.x, 0.45, lerpSpeed, delta);
        sushiiLeftArm.rotation.x = THREE.MathUtils.damp(sushiiLeftArm.rotation.x, -0.8, lerpSpeed, delta);
        sushiiHeadGroup.rotation.x = THREE.MathUtils.damp(sushiiHeadGroup.rotation.x, 0.3, lerpSpeed, delta);
        break;
      }
      case 'kneel': {
        // Kneeling down to draw rangoli
        heeruTorsoGroup.position.y = THREE.MathUtils.damp(heeruTorsoGroup.position.y, 0.38, lerpSpeed, delta);
        heeruTorsoGroup.rotation.x = THREE.MathUtils.damp(heeruTorsoGroup.rotation.x, 0.35, lerpSpeed, delta);
        heeruRightArm.rotation.x = THREE.MathUtils.damp(heeruRightArm.rotation.x, -0.9, lerpSpeed, delta);
        heeruLeftArm.rotation.x = THREE.MathUtils.damp(heeruLeftArm.rotation.x, -0.6, lerpSpeed, delta);
        heeruHeadGroup.rotation.x = THREE.MathUtils.damp(heeruHeadGroup.rotation.x, 0.45, lerpSpeed, delta);

        sushiiTorsoGroup.position.y = THREE.MathUtils.damp(sushiiTorsoGroup.position.y, 0.36, lerpSpeed, delta);
        sushiiTorsoGroup.rotation.x = THREE.MathUtils.damp(sushiiTorsoGroup.rotation.x, 0.35, lerpSpeed, delta);
        sushiiRightArm.rotation.x = THREE.MathUtils.damp(sushiiRightArm.rotation.x, -0.9, lerpSpeed, delta);
        sushiiLeftArm.rotation.x = THREE.MathUtils.damp(sushiiLeftArm.rotation.x, -0.7, lerpSpeed, delta);
        sushiiHeadGroup.rotation.x = THREE.MathUtils.damp(sushiiHeadGroup.rotation.x, 0.45, lerpSpeed, delta);
        skirt.rotation.x = THREE.MathUtils.damp(skirt.rotation.x, 0.4, lerpSpeed, delta);
        break;
      }
      case 'sit': {
        // Sitting together on haveli courtyard bench
        heeruTorsoGroup.position.y = THREE.MathUtils.damp(heeruTorsoGroup.position.y, 0.45, lerpSpeed, delta);
        heeruTorsoGroup.position.z = THREE.MathUtils.damp(heeruTorsoGroup.position.z, -0.15, lerpSpeed, delta);
        heeruTorsoGroup.rotation.x = THREE.MathUtils.damp(heeruTorsoGroup.rotation.x, 0, lerpSpeed, delta);
        heeruLeftLeg.rotation.x = THREE.MathUtils.damp(heeruLeftLeg.rotation.x, -1.3, lerpSpeed, delta);
        heeruRightLeg.rotation.x = THREE.MathUtils.damp(heeruRightLeg.rotation.x, -1.3, lerpSpeed, delta);
        heeruHeadGroup.rotation.y = THREE.MathUtils.damp(heeruHeadGroup.rotation.y, -0.32, lerpSpeed, delta); // Turn head to Sushii
        heeruRightArm.rotation.x = THREE.MathUtils.damp(heeruRightArm.rotation.x, -0.35, lerpSpeed, delta);

        sushiiTorsoGroup.position.y = THREE.MathUtils.damp(sushiiTorsoGroup.position.y, 0.43, lerpSpeed, delta);
        sushiiTorsoGroup.position.z = THREE.MathUtils.damp(sushiiTorsoGroup.position.z, -0.15, lerpSpeed, delta);
        sushiiTorsoGroup.rotation.x = THREE.MathUtils.damp(sushiiTorsoGroup.rotation.x, 0, lerpSpeed, delta);
        skirt.rotation.x = THREE.MathUtils.damp(skirt.rotation.x, -0.4, lerpSpeed, delta);
        sushiiHeadGroup.rotation.y = THREE.MathUtils.damp(sushiiHeadGroup.rotation.y, 0.35, lerpSpeed, delta); // Turn head to Heeru
        sushiiLeftArm.rotation.x = THREE.MathUtils.damp(sushiiLeftArm.rotation.x, -0.35, lerpSpeed, delta);

        // Cat sits happily beside bench
        catBody.position.y = THREE.MathUtils.damp(catBody.position.y, 0.12, lerpSpeed, delta);
        break;
      }
      case 'reach_high': {
        // Reaching up for temple bell or waving sparklers
        walkPhase += delta * 3.5;
        const wave = Math.sin(walkPhase) * 0.25;

        heeruRightArm.rotation.x = THREE.MathUtils.damp(heeruRightArm.rotation.x, -2.4 + wave, lerpSpeed, delta);
        heeruRightArm.rotation.z = THREE.MathUtils.damp(heeruRightArm.rotation.z, -0.3, lerpSpeed, delta);
        heeruHeadGroup.rotation.x = THREE.MathUtils.damp(heeruHeadGroup.rotation.x, -0.5, lerpSpeed, delta);

        sushiiLeftArm.rotation.x = THREE.MathUtils.damp(sushiiLeftArm.rotation.x, -2.2 - wave, lerpSpeed, delta);
        sushiiLeftArm.rotation.z = THREE.MathUtils.damp(sushiiLeftArm.rotation.z, 0.3, lerpSpeed, delta);
        sushiiHeadGroup.rotation.x = THREE.MathUtils.damp(sushiiHeadGroup.rotation.x, -0.45, lerpSpeed, delta);
        break;
      }
      case 'look_up': {
        // Gazing at fireworks, sky lantern, and star kandils
        heeruHeadGroup.rotation.x = THREE.MathUtils.damp(heeruHeadGroup.rotation.x, -0.65, lerpSpeed, delta);
        heeruTorsoGroup.rotation.x = THREE.MathUtils.damp(heeruTorsoGroup.rotation.x, -0.12, lerpSpeed, delta);
        sushiiHeadGroup.rotation.x = THREE.MathUtils.damp(sushiiHeadGroup.rotation.x, -0.65, lerpSpeed, delta);
        sushiiTorsoGroup.rotation.x = THREE.MathUtils.damp(sushiiTorsoGroup.rotation.x, -0.12, lerpSpeed, delta);
        break;
      }
      case 'offer_sweet': {
        // Heeru offering sweets to Sushii
        heeruRightArm.rotation.x = THREE.MathUtils.damp(heeruRightArm.rotation.x, -1.0, lerpSpeed, delta);
        heeruRightArm.rotation.y = THREE.MathUtils.damp(heeruRightArm.rotation.y, -0.45, lerpSpeed, delta);
        heeruHeadGroup.rotation.y = THREE.MathUtils.damp(heeruHeadGroup.rotation.y, -0.35, lerpSpeed, delta);

        sushiiLeftArm.rotation.x = THREE.MathUtils.damp(sushiiLeftArm.rotation.x, -0.85, lerpSpeed, delta);
        sushiiLeftArm.rotation.y = THREE.MathUtils.damp(sushiiLeftArm.rotation.y, 0.45, lerpSpeed, delta);
        sushiiHeadGroup.rotation.y = THREE.MathUtils.damp(sushiiHeadGroup.rotation.y, 0.35, lerpSpeed, delta);
        break;
      }
      default: {
        // Idle breathing
        walkPhase += delta * 1.8;
        const breathe = Math.sin(walkPhase) * 0.012;

        heeruLeftLeg.rotation.x = THREE.MathUtils.damp(heeruLeftLeg.rotation.x, 0, 8, delta);
        heeruRightLeg.rotation.x = THREE.MathUtils.damp(heeruRightLeg.rotation.x, 0, 8, delta);
        heeruLeftArm.rotation.x = THREE.MathUtils.damp(heeruLeftArm.rotation.x, 0, 8, delta);
        heeruRightArm.rotation.x = THREE.MathUtils.damp(heeruRightArm.rotation.x, 0, 8, delta);
        heeruRightArm.rotation.y = THREE.MathUtils.damp(heeruRightArm.rotation.y, 0, 8, delta);
        heeruRightArm.rotation.z = THREE.MathUtils.damp(heeruRightArm.rotation.z, 0, 8, delta);
        heeruTorsoGroup.position.y = THREE.MathUtils.damp(heeruTorsoGroup.position.y, 0.75 + breathe, 8, delta);
        heeruTorsoGroup.position.z = THREE.MathUtils.damp(heeruTorsoGroup.position.z, 0, 8, delta);
        heeruTorsoGroup.rotation.x = THREE.MathUtils.damp(heeruTorsoGroup.rotation.x, 0, 8, delta);
        heeruHeadGroup.rotation.x = THREE.MathUtils.damp(heeruHeadGroup.rotation.x, 0, 8, delta);
        heeruHeadGroup.rotation.y = THREE.MathUtils.damp(heeruHeadGroup.rotation.y, 0, 8, delta);

        sushiiLeftArm.rotation.x = THREE.MathUtils.damp(sushiiLeftArm.rotation.x, 0, 8, delta);
        sushiiRightArm.rotation.x = THREE.MathUtils.damp(sushiiRightArm.rotation.x, 0, 8, delta);
        sushiiLeftArm.rotation.y = THREE.MathUtils.damp(sushiiLeftArm.rotation.y, 0, 8, delta);
        sushiiLeftArm.rotation.z = THREE.MathUtils.damp(sushiiLeftArm.rotation.z, 0, 8, delta);
        sushiiTorsoGroup.position.y = THREE.MathUtils.damp(sushiiTorsoGroup.position.y, 0.72 + breathe, 8, delta);
        sushiiTorsoGroup.position.z = THREE.MathUtils.damp(sushiiTorsoGroup.position.z, 0, 8, delta);
        sushiiTorsoGroup.rotation.x = THREE.MathUtils.damp(sushiiTorsoGroup.rotation.x, 0, 8, delta);
        sushiiHeadGroup.rotation.x = THREE.MathUtils.damp(sushiiHeadGroup.rotation.x, 0, 8, delta);
        sushiiHeadGroup.rotation.y = THREE.MathUtils.damp(sushiiHeadGroup.rotation.y, 0, 8, delta);
        skirt.rotation.x = THREE.MathUtils.damp(skirt.rotation.x, 0, 8, delta);
        skirt.rotation.z = THREE.MathUtils.damp(skirt.rotation.z, 0, 8, delta);

        catBody.position.y = THREE.MathUtils.damp(catBody.position.y, 0.18, 8, delta);
        catTailPiv.rotation.y = Math.sin(walkPhase * 1.2) * 0.2;
        catLegs.forEach((l) => (l.rotation.x = THREE.MathUtils.damp(l.rotation.x, 0, 8, delta)));
        break;
      }
    }
  };

  const setSparklersVisible = (visible: boolean) => {
    sparklerHeeru.visible = visible;
    sparklerSushii.visible = visible;
  };

  return {
    root,
    heeruGroup,
    sushiiGroup,
    catGroup,
    sparklerHeeru,
    sparklerSushii,
    sweetsPlate,
    currentPose,
    setPose,
    updateAnimation,
    setSparklersVisible,
  };
}
