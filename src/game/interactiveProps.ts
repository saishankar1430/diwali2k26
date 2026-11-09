import * as THREE from 'three';
import { MemoryItem } from '../types/game';

export interface InteractivePropManager {
  group: THREE.Group;
  update: (delta: number, memories: MemoryItem[], isChakriSpinning?: boolean) => void;
  getPropGroup: (id: string) => THREE.Group | undefined;
  setLanternLaunched: (launched: boolean) => void;
}

export function createInteractiveProps(memories: MemoryItem[]): InteractivePropManager {
  const group = new THREE.Group();
  group.name = 'InteractiveProps';

  const propMap = new Map<string, THREE.Group>();
  const markerBeacons: { beacon: THREE.Group; id: string }[] = [];
  let chakriDiscMesh: THREE.Group | null = null;
  let restingLanternMesh: THREE.Mesh | null = null;

  // Helper to create the floating golden heart beacon shown in the video
  const createMemoryBeacon = (pos: [number, number, number], id: string) => {
    const beacon = new THREE.Group();
    beacon.position.set(pos[0], pos[1] + 1.25, pos[2]);
    beacon.userData = { id, baseHeight: pos[1] + 1.25, phase: Math.random() * Math.PI * 2 };

    // Floating 3D Heart geometry
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.2);
    heartShape.bezierCurveTo(0, 0.4, -0.25, 0.55, -0.4, 0.35);
    heartShape.bezierCurveTo(-0.55, 0.15, -0.3, -0.15, 0, -0.4);
    heartShape.bezierCurveTo(0.3, -0.15, 0.55, 0.15, 0.4, 0.35);
    heartShape.bezierCurveTo(0.25, 0.55, 0, 0.4, 0, 0.2);

    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const heartGeom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeom.center();
    heartGeom.scale(0.45, 0.45, 0.45);

    const heartMat = new THREE.MeshStandardMaterial({
      color: '#ffd54f',
      emissive: '#ff9800',
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.5,
    });
    const heartMesh = new THREE.Mesh(heartGeom, heartMat);
    beacon.add(heartMesh);

    // Glowing ground circle decal
    const ringGeom = new THREE.RingGeometry(0.35, 0.48, 24);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#ffa726',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.y = -1.2;
    beacon.add(ring);

    markerBeacons.push({ beacon, id });
    return beacon;
  };

  // Build specific physical props for each memory
  memories.forEach((mem) => {
    const propGroup = new THREE.Group();
    propGroup.position.set(mem.position[0], mem.position[1], mem.position[2]);

    // Attach floating heart beacon
    const beacon = createMemoryBeacon(mem.position, mem.id);
    group.add(beacon);

    if (mem.id === 'chakri') {
      const chakriPivot = new THREE.Group();
      chakriPivot.position.y = 0.02;

      // Outer Paper Disc with vibrant concentric rings
      const discGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 20);
      const discMat = new THREE.MeshStandardMaterial({
        color: '#e91e63',
        roughness: 0.4,
        metalness: 0.1,
      });
      const disc = new THREE.Mesh(discGeom, discMat);
      chakriPivot.add(disc);

      // Gold Foil Trim
      const rimGeom = new THREE.TorusGeometry(0.24, 0.015, 8, 20);
      rimGeom.rotateX(Math.PI / 2);
      const rimMat = new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 0.8, roughness: 0.2 });
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.position.y = 0.022;
      chakriPivot.add(rim);

      // Spiral Firecracker Nozzle Arms (curved wings)
      for (let s = 0; s < 3; s++) {
        const sAngle = (s / 3) * Math.PI * 2;
        const armGeom = new THREE.BoxGeometry(0.12, 0.02, 0.03);
        const armMat = new THREE.MeshBasicMaterial({ color: '#ffeb3b' });
        const arm = new THREE.Mesh(armGeom, armMat);
        arm.position.set(Math.cos(sAngle) * 0.12, 0.025, Math.sin(sAngle) * 0.12);
        arm.rotation.y = sAngle + 0.6;
        chakriPivot.add(arm);
      }

      // Central brass pivot pin
      const pinGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.07, 8);
      const pinMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.9, roughness: 0.2 });
      const pin = new THREE.Mesh(pinGeom, pinMat);
      pin.position.y = 0.035;
      chakriPivot.add(pin);

      propGroup.add(chakriPivot);
      chakriDiscMesh = chakriPivot;
    } else if (mem.id === 'anar') {
      // Traditional Decorative Indian Anaar Pot
      const anarPot = new THREE.Group();

      // Fluted clay base
      const baseGeom = new THREE.CylinderGeometry(0.14, 0.18, 0.08, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#795548', roughness: 0.85 });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.position.y = 0.04;
      anarPot.add(base);

      // Main Conical Firework Body
      const anarGeom = new THREE.ConeGeometry(0.17, 0.38, 16);
      const anarMat = new THREE.MeshStandardMaterial({
        color: '#c0392b',
        roughness: 0.5,
        metalness: 0.2,
      });
      const anar = new THREE.Mesh(anarGeom, anarMat);
      anar.position.y = 0.27;
      anarPot.add(anar);

      // Golden foil decorative sash band
      const sashGeom = new THREE.CylinderGeometry(0.13, 0.15, 0.08, 16);
      const sashMat = new THREE.MeshStandardMaterial({
        color: '#ffd700',
        metalness: 0.8,
        roughness: 0.3,
      });
      const sash = new THREE.Mesh(sashGeom, sashMat);
      sash.position.y = 0.22;
      anarPot.add(sash);

      // Gold cap on tip
      const capGeom = new THREE.CylinderGeometry(0.035, 0.05, 0.06, 12);
      const capMat = new THREE.MeshStandardMaterial({ color: '#f39c12', metalness: 0.6, roughness: 0.3 });
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.y = 0.44;
      anarPot.add(cap);

      // Black fuse wick poking out
      const wickGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6);
      const wickMat = new THREE.MeshBasicMaterial({ color: '#212121' });
      const wick = new THREE.Mesh(wickGeom, wickMat);
      wick.position.set(0.01, 0.49, 0);
      wick.rotation.z = -0.2;
      anarPot.add(wick);

      propGroup.add(anarPot);
    } else if (mem.id === 'rocket') {
      // Bottle launcher
      const bottleGeom = new THREE.CylinderGeometry(0.07, 0.1, 0.42, 10);
      const bottleMat = new THREE.MeshStandardMaterial({
        color: '#1b5e20',
        roughness: 0.2,
        metalness: 0.1,
      });
      const bottle = new THREE.Mesh(bottleGeom, bottleMat);
      bottle.position.set(0, 0.21, 0);
      propGroup.add(bottle);

      const rocketPiv = new THREE.Group();
      rocketPiv.position.set(0, 0.22, 0);
      rocketPiv.rotation.z = -0.18; // Tilted slightly towards open sky

      // Bamboo launching stick
      const stickGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.85, 6);
      const stickMat = new THREE.MeshStandardMaterial({ color: '#d7ccc8', roughness: 0.9 });
      const stick = new THREE.Mesh(stickGeom, stickMat);
      stick.position.y = 0.35;
      rocketPiv.add(stick);

      // Rocket cylinder body with festive red & yellow stripes
      const bodyGeom = new THREE.CylinderGeometry(0.048, 0.048, 0.26, 10);
      const bodyMat = new THREE.MeshStandardMaterial({ color: '#e53935', roughness: 0.4 });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.position.y = 0.48;
      rocketPiv.add(body);

      // Conical aerodynamic head
      const headGeom = new THREE.ConeGeometry(0.055, 0.14, 10);
      const headMat = new THREE.MeshStandardMaterial({ color: '#ffb300', roughness: 0.3, metalness: 0.4 });
      const head = new THREE.Mesh(headGeom, headMat);
      head.position.y = 0.67;
      rocketPiv.add(head);

      propGroup.add(rocketPiv);
    } else if (mem.id === 'sky_lantern') {
      // Wooden Plinth / Stool
      const stoolGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.36, 12);
      const stoolMat = new THREE.MeshStandardMaterial({ color: '#3e2723', roughness: 0.8 });
      const stool = new THREE.Mesh(stoolGeom, stoolMat);
      stool.position.y = 0.18;
      propGroup.add(stool);

      // Resting Sky Lantern (starts unlit)
      const lanternGeom = new THREE.CylinderGeometry(0.26, 0.2, 0.52, 12);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: '#ffb74d',
        emissive: '#e65100',
        emissiveIntensity: 0.4,
        roughness: 0.4,
      });
      const lantern = new THREE.Mesh(lanternGeom, lanternMat);
      lantern.position.y = 0.62;
      propGroup.add(lantern);
      restingLanternMesh = lantern;
    } else if (mem.id === 'phuljhadi') {
      // Box of sparklers
      const boxGeom = new THREE.BoxGeometry(0.28, 0.42, 0.14);
      const boxMat = new THREE.MeshStandardMaterial({ color: '#7b1fa2', roughness: 0.5 });
      const box = new THREE.Mesh(boxGeom, boxMat);
      box.position.y = 0.21;
      propGroup.add(box);

      // Gold Sparkler logo on box
      const emblemGeom = new THREE.PlaneGeometry(0.18, 0.28);
      const emblemMat = new THREE.MeshBasicMaterial({ color: '#ffd54f' });
      const emblem = new THREE.Mesh(emblemGeom, emblemMat);
      emblem.position.set(0, 0.21, 0.075);
      propGroup.add(emblem);
    }

    group.add(propGroup);
    propMap.set(mem.id, propGroup);
  });

  const update = (delta: number, currentMemories: MemoryItem[], isChakriSpinning = false) => {
    // 1. Animate heart beacons
    markerBeacons.forEach(({ beacon, id }) => {
      const mem = currentMemories.find((m) => m.id === id);
      if (mem && mem.unlocked) {
        beacon.visible = false;
        return;
      }
      beacon.visible = true;
      beacon.userData.phase += delta * 2.2;
      beacon.position.y = beacon.userData.baseHeight + Math.sin(beacon.userData.phase) * 0.12;
      beacon.rotation.y += delta * 1.5;
    });

    // 2. Physical rotation of chakri when active
    if (chakriDiscMesh && isChakriSpinning) {
      chakriDiscMesh.rotation.y += delta * 36.0; // Rapid high-rpm physical spin
    }
  };

  const setLanternLaunched = (launched: boolean) => {
    if (restingLanternMesh) {
      restingLanternMesh.visible = !launched;
    }
  };

  const getPropGroup = (id: string) => propMap.get(id);

  return {
    group,
    update,
    getPropGroup,
    setLanternLaunched,
  };
}
