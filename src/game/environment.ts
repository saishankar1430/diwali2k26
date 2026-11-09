import * as THREE from 'three';
import {
  createCobblestoneStreetTexture,
  createTraditionalDoorTexture,
  createJaaliWindowTexture,
  createRangoliTexture,
  createStarKandilTexture,
  createCitySkylineTexture,
  createWelcomeBannerTexture,
} from '../utils/proceduralTextures';
import { COUPLE_PHOTOS } from '../data/photos';

export interface EnvironmentResult {
  group: THREE.Group;
  diyaLights: THREE.PointLight[];
  kandilMeshes: THREE.Group[];
  stringLights: THREE.Points;
  diyaFlames: THREE.Group[];
  rangoliMesh: THREE.Mesh;
  mandirBell: THREE.Group;
  mithaiStall: THREE.Group;
  rooftopArea: THREE.Group;
  haveliBench: THREE.Group;
  firstDiyaGroup: THREE.Group;
  firstDiyaFlame: THREE.Mesh;
  firstDiyaLight: THREE.PointLight;
  ringMandirBell: () => void;
  igniteFirstDiya: () => void;
  bloomRangoli: () => void;
  updateAnimations: (delta: number) => void;
  lightUpAll: () => void;
}

export function createDiwaliEnvironment(): EnvironmentResult {
  const group = new THREE.Group();
  group.name = 'DiwaliEnvironment';

  const diyaLights: THREE.PointLight[] = [];
  const kandilMeshes: THREE.Group[] = [];
  const diyaFlames: THREE.Group[] = [];

  // Textures
  const streetTex = createCobblestoneStreetTexture();
  const doorTex = createTraditionalDoorTexture();
  const jaaliTex = createJaaliWindowTexture();
  const kandilTex = createStarKandilTexture();
  const skylineTex = createCitySkylineTexture();

  // Street Floor (Cobblestone)
  const floorGeom = new THREE.PlaneGeometry(10, 36);
  floorGeom.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    map: streetTex,
    roughness: 0.8,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.position.set(0, 0, 2);
  floor.receiveShadow = true;
  group.add(floor);

  // Sidewalk / plinth steps along both sides
  [-4.8, 4.8].forEach((stepX) => {
    const stepGeom = new THREE.BoxGeometry(1.6, 0.25, 36);
    const stepMat = new THREE.MeshStandardMaterial({
      color: '#4a3b40',
      roughness: 0.75,
      metalness: 0.1,
    });
    const step = new THREE.Mesh(stepGeom, stepMat);
    step.position.set(stepX, 0.125, 2);
    step.receiveShadow = true;
    group.add(step);
  });

  // -------------------------------------------------------------
  // TRADITIONAL HAVELI HOUSES (Left & Right Sides)
  // -------------------------------------------------------------
  const houseColors = [
    '#e28743', // Warm Terracotta Ochre
    '#d9534f', // Indian Coral Pink
    '#3aa899', // Haveli Mint Teal
    '#e6af2e', // Marigold Yellow
    '#9b59b6', // Royal Purple
    '#3498db', // Jodhpur Blue
    '#e77f67', // Peach Sandstone
    '#1abc9c', // Cyan Turquoise
  ];

  // Helper to create a multi-part Haveli facade
  const createHaveli = (
    x: number,
    z: number,
    width: number,
    height: number,
    depth: number,
    color: string,
    isLeft: boolean
  ) => {
    const haveli = new THREE.Group();
    haveli.position.set(x, 0, z);

    // Main 2-story building block
    const wallGeom = new THREE.BoxGeometry(depth, height, width);
    const wallMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.85,
      metalness: 0.05,
    });
    const wall = new THREE.Mesh(wallGeom, wallMat);
    wall.position.y = height / 2;
    wall.castShadow = true;
    wall.receiveShadow = true;
    haveli.add(wall);

    // Decorative roof parapet / cornice
    const corniceGeom = new THREE.BoxGeometry(depth + 0.3, 0.3, width + 0.3);
    const corniceMat = new THREE.MeshStandardMaterial({
      color: '#f4ede2',
      roughness: 0.6,
      metalness: 0.1,
    });
    const cornice = new THREE.Mesh(corniceGeom, corniceMat);
    cornice.position.y = height + 0.15;
    haveli.add(cornice);

    // Mid-story decorative moulding
    const midCornice = new THREE.Mesh(corniceGeom, corniceMat);
    midCornice.scale.set(1.02, 0.6, 1.02);
    midCornice.position.y = height * 0.52;
    haveli.add(midCornice);

    // Traditional Ground Floor Door
    const doorFaceX = isLeft ? depth / 2 + 0.02 : -depth / 2 - 0.02;
    const doorGeom = new THREE.PlaneGeometry(1.6, 2.6);
    if (!isLeft) doorGeom.rotateY(Math.PI);
    else doorGeom.rotateY(0);
    const doorMat = new THREE.MeshStandardMaterial({
      map: doorTex,
      roughness: 0.5,
      metalness: 0.2,
    });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
    door.position.set(doorFaceX, 1.3, 0);
    haveli.add(door);

    // Floral Marigold Toran over door
    const toranGeom = new THREE.TorusGeometry(0.85, 0.05, 6, 16, Math.PI);
    const toranMat = new THREE.MeshStandardMaterial({
      color: '#ff8f00',
      roughness: 0.9,
    });
    const toran = new THREE.Mesh(toranGeom, toranMat);
    toran.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
    toran.rotation.x = Math.PI;
    toran.position.set(doorFaceX, 2.6, 0);
    haveli.add(toran);

    // 1st Floor Jharokha Balcony
    const balconyGeom = new THREE.BoxGeometry(0.8, 0.6, 1.8);
    const balconyMat = new THREE.MeshStandardMaterial({
      color: '#f8f1e5',
      roughness: 0.6,
    });
    const balcony = new THREE.Mesh(balconyGeom, balconyMat);
    balcony.position.set(isLeft ? depth / 2 + 0.4 : -depth / 2 - 0.4, height * 0.55, 0);
    haveli.add(balcony);

    // Carved Balcony brackets below
    [-0.6, 0.6].forEach((bz) => {
      const bracketGeom = new THREE.ConeGeometry(0.12, 0.4, 4);
      const bracket = new THREE.Mesh(bracketGeom, balconyMat);
      bracket.rotation.x = Math.PI;
      bracket.position.set(balcony.position.x, height * 0.55 - 0.4, bz);
      haveli.add(bracket);
    });

    // Ornate Jaali Windows (Upper & Lower Floors)
    const windowOffsets = [-1.3, 1.3];
    windowOffsets.forEach((woz) => {
      // Ground floor window
      const winGeom = new THREE.PlaneGeometry(1.0, 1.3);
      const winMat = new THREE.MeshBasicMaterial({
        map: jaaliTex,
      });
      const win = new THREE.Mesh(winGeom, winMat);
      win.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      win.position.set(doorFaceX, 1.8, woz);
      haveli.add(win);

      // Upper floor window
      const winUp = new THREE.Mesh(winGeom, winMat);
      winUp.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      winUp.position.set(doorFaceX, height * 0.72, woz);
      haveli.add(winUp);

      // Soft ambient light leaking from windows
      const winLight = new THREE.PointLight('#ff9900', 0.6, 4);
      winLight.position.set(doorFaceX, height * 0.72, woz);
      haveli.add(winLight);
    });

    return haveli;
  };

  // Generate street Haveli facades along Z
  const streetZStart = -12;
  const streetZEnd = 16;
  const buildingWidth = 4.8;
  let colorIdx = 0;

  for (let z = streetZStart; z <= streetZEnd; z += buildingWidth) {
    // Left Haveli
    const leftColor = houseColors[colorIdx % houseColors.length];
    colorIdx++;
    const leftHaveli = createHaveli(-6.8, z, buildingWidth * 0.95, 6.5, 4.0, leftColor, true);
    group.add(leftHaveli);

    // Right Haveli
    const rightColor = houseColors[colorIdx % houseColors.length];
    colorIdx++;
    const rightHaveli = createHaveli(6.8, z, buildingWidth * 0.95, 6.5, 4.0, rightColor, false);
    group.add(rightHaveli);
  }

  // -------------------------------------------------------------
  // COUPLE PHOTO FRAMES ALONG HAVELI WALLS (Our Story in 3D)
  // -------------------------------------------------------------
  const textureLoader = new THREE.TextureLoader();
  const frameLocations = [
    { x: -4.75, y: 1.65, z: -9.0, rotY: Math.PI / 2, photoIndex: 1 },
    { x: -4.75, y: 1.65, z: -4.0, rotY: Math.PI / 2, photoIndex: 2 },
    { x: -4.75, y: 1.65, z: 2.5, rotY: Math.PI / 2, photoIndex: 3 },
    { x: -4.75, y: 1.65, z: 8.5, rotY: Math.PI / 2, photoIndex: 4 },
    { x: -4.75, y: 1.65, z: 13.5, rotY: Math.PI / 2, photoIndex: 12 },
    { x: 4.75, y: 1.65, z: -8.0, rotY: -Math.PI / 2, photoIndex: 5 },
    { x: 4.75, y: 1.65, z: -2.0, rotY: -Math.PI / 2, photoIndex: 0 }, // Right next to Temple Mandir!
    { x: 4.75, y: 1.65, z: 4.5, rotY: -Math.PI / 2, photoIndex: 10 },
    { x: 4.75, y: 1.65, z: 10.5, rotY: -Math.PI / 2, photoIndex: 11 },
    { x: 4.75, y: 1.65, z: 14.5, rotY: -Math.PI / 2, photoIndex: 15 },
  ];

  frameLocations.forEach((loc) => {
    const photo = COUPLE_PHOTOS[loc.photoIndex % COUPLE_PHOTOS.length];
    if (!photo) return;

    const frameGroup = new THREE.Group();
    frameGroup.position.set(loc.x, loc.y, loc.z);
    frameGroup.rotation.y = loc.rotY;

    // Golden / Carved Frame Border (will adapt dimensions once texture loads)
    const borderGeom = new THREE.BoxGeometry(0.96, 1.2, 0.04);
    const borderMat = new THREE.MeshStandardMaterial({
      color: '#d4af37', // Gold Leaf
      roughness: 0.35,
      metalness: 0.7,
    });
    const borderMesh = new THREE.Mesh(borderGeom, borderMat);
    frameGroup.add(borderMesh);

    // Decorative Marigold garland arc over frame
    const garlandGeom = new THREE.TorusGeometry(0.48, 0.035, 6, 12, Math.PI);
    const garlandMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.9 });
    const garland = new THREE.Mesh(garlandGeom, garlandMat);
    garland.rotation.z = Math.PI;
    garland.position.set(0, 0.58, 0.03);
    frameGroup.add(garland);

    // Photo Canvas Texture with natural aspect ratio preservation
    textureLoader.load(photo.url, (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      const img = loadedTex.image;
      const aspect = img && img.width && img.height ? img.width / img.height : 0.8;

      let pWidth = 0.84;
      let pHeight = 1.05;

      if (aspect >= 1.25) {
        // Wide landscape photo (e.g. Temple Ganesha portrait)
        pWidth = 1.25;
        pHeight = Math.max(0.7, 1.25 / aspect);
      } else if (aspect <= 0.75) {
        // Tall portrait photo
        pHeight = 1.15;
        pWidth = Math.max(0.65, 1.15 * aspect);
      } else {
        // Standard / square ratio
        pWidth = 0.92;
        pHeight = 0.92 / aspect;
      }

      // Update frame border to hug the photo geometry
      borderMesh.geometry.dispose();
      borderMesh.geometry = new THREE.BoxGeometry(pWidth + 0.12, pHeight + 0.12, 0.04);

      // Reposition garland above the top border
      garland.position.y = (pHeight + 0.12) / 2;

      const photoGeom = new THREE.PlaneGeometry(pWidth, pHeight);
      const photoMat = new THREE.MeshStandardMaterial({
        map: loadedTex,
        roughness: 0.45,
        metalness: 0.05,
      });
      const photoMesh = new THREE.Mesh(photoGeom, photoMat);
      photoMesh.position.z = 0.025;
      frameGroup.add(photoMesh);
    });

    // Warm mini spotlight / diya light under frame
    const frameLight = new THREE.PointLight('#fbbf24', 0.45, 2.5);
    frameLight.position.set(0, -0.65, 0.25);
    frameGroup.add(frameLight);
    diyaLights.push(frameLight);

    group.add(frameGroup);
  });

  // -------------------------------------------------------------
  // FESTIVE ENTRANCE ARCH (Happy Diwali & Names)
  // -------------------------------------------------------------
  const archGroup = new THREE.Group();
  archGroup.position.set(0, 0, -11.5);

  const pillarMat = new THREE.MeshStandardMaterial({
    color: '#d4a373',
    roughness: 0.6,
    metalness: 0.1,
  });

  [-3.8, 3.8].forEach((px) => {
    const pillarGeom = new THREE.CylinderGeometry(0.3, 0.35, 5.2, 12);
    const pillar = new THREE.Mesh(pillarGeom, pillarMat);
    pillar.position.set(px, 2.6, 0);
    pillar.castShadow = true;
    archGroup.add(pillar);

    // Pillar Cap / Diya
    const capGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 12);
    const cap = new THREE.Mesh(capGeom, pillarMat);
    cap.position.set(px, 5.3, 0);
    archGroup.add(cap);
  });

  // Cross Arch Beam
  const beamGeom = new THREE.BoxGeometry(8.2, 0.6, 0.5);
  const beam = new THREE.Mesh(beamGeom, pillarMat);
  beam.position.set(0, 5.2, 0);
  archGroup.add(beam);

  // Welcome Banner ("Happy Diwali" / "Heeru ❤️ Sushii")
  const bannerTex = createWelcomeBannerTexture('Happy Diwali', 'Heeru ❤️ Sushii');
  const bannerGeom = new THREE.PlaneGeometry(5.2, 1.4);
  const bannerMat = new THREE.MeshStandardMaterial({
    map: bannerTex,
    roughness: 0.4,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });
  const bannerMesh = new THREE.Mesh(bannerGeom, bannerMat);
  bannerMesh.position.set(0, 4.3, 0);
  archGroup.add(bannerMesh);

  // Decorative scalloped marigold garlands beneath the beam (clean framing at top, no occlusion)
  const archGarlandMat = new THREE.MeshStandardMaterial({ color: '#ff7700', roughness: 0.9 });
  [-2.4, -0.8, 0.8, 2.4].forEach((gx) => {
    const scallopGeom = new THREE.TorusGeometry(0.7, 0.06, 6, 16, Math.PI);
    const scallop = new THREE.Mesh(scallopGeom, archGarlandMat);
    scallop.rotation.x = Math.PI;
    scallop.position.set(gx, 5.0, 0);
    archGroup.add(scallop);
  });

  group.add(archGroup);

  // -------------------------------------------------------------
  // HANGING STAR KANDILS & OVERHEAD FAIRY LIGHT STRINGS
  // -------------------------------------------------------------
  const kandilPositions = [
    [0, 5.0, -8],
    [-1.2, 4.6, -4],
    [1.4, 4.8, 0],
    [-0.8, 5.2, 4],
    [1.0, 4.7, 8],
    [0, 5.0, 12],
  ];

  kandilPositions.forEach(([kx, ky, kz], idx) => {
    const kandilGroup = new THREE.Group();
    kandilGroup.position.set(kx, ky, kz);

    // Central 8-pointed 3D Star Lantern (geometric cross cones)
    const starCoreGeom = new THREE.OctahedronGeometry(0.55, 0);
    const starMat = new THREE.MeshStandardMaterial({
      map: kandilTex,
      roughness: 0.3,
      metalness: 0.2,
      emissive: '#ff9900',
      emissiveIntensity: 0.5,
    });
    const starCore = new THREE.Mesh(starCoreGeom, starMat);
    kandilGroup.add(starCore);

    // Star points
    for (let i = 0; i < 6; i++) {
      const coneGeom = new THREE.ConeGeometry(0.28, 0.65, 4);
      const cone = new THREE.Mesh(coneGeom, starMat);
      if (i === 0) cone.position.y = 0.55;
      if (i === 1) {
        cone.position.y = -0.55;
        cone.rotation.x = Math.PI;
      }
      if (i === 2) {
        cone.position.x = 0.55;
        cone.rotation.z = -Math.PI / 2;
      }
      if (i === 3) {
        cone.position.x = -0.55;
        cone.rotation.z = Math.PI / 2;
      }
      if (i === 4) {
        cone.position.z = 0.55;
        cone.rotation.x = Math.PI / 2;
      }
      if (i === 5) {
        cone.position.z = -0.55;
        cone.rotation.x = -Math.PI / 2;
      }
      kandilGroup.add(cone);
    }

    // Dangling Decorative Frills / Ribbons at bottom
    for (let r = 0; r < 5; r++) {
      const ribbonAngle = (r / 5) * Math.PI * 2;
      const ribbonGeom = new THREE.PlaneGeometry(0.08, 0.65);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: r % 2 === 0 ? '#ffea00' : '#d32f2f',
        side: THREE.DoubleSide,
      });
      const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
      ribbon.position.set(Math.cos(ribbonAngle) * 0.18, -0.9, Math.sin(ribbonAngle) * 0.18);
      kandilGroup.add(ribbon);
    }

    // Warm inner PointLight radiating through the street
    const kLight = new THREE.PointLight('#ffa726', 1.2, 7.5);
    kLight.position.set(0, 0, 0);
    kandilGroup.add(kLight);
    diyaLights.push(kLight);

    group.add(kandilGroup);
    kandilMeshes.push(kandilGroup);
  });

  // Crisscrossing Overhead Fairy Lights (particle points)
  const numStringParticles = 240;
  const stringPositions = new Float32Array(numStringParticles * 3);
  const stringColors = new Float32Array(numStringParticles * 3);

  for (let i = 0; i < numStringParticles; i++) {
    const t = i / numStringParticles;
    const strandIdx = Math.floor(t * 8);
    const strandT = (t * 8) % 1;

    // Catenary dip across street
    const z = -10 + strandIdx * 3.5;
    const x = -4.5 + strandT * 9.0;
    const sag = Math.sin(strandT * Math.PI) * 0.7;
    const y = 5.2 - sag;

    stringPositions[i * 3] = x;
    stringPositions[i * 3 + 1] = y;
    stringPositions[i * 3 + 2] = z + Math.sin(t * 10) * 0.3;

    // Festive warm fairy light colors (gold, amber, soft warm white)
    const colChoice = i % 3;
    if (colChoice === 0) {
      stringColors[i * 3] = 1.0;
      stringColors[i * 3 + 1] = 0.85;
      stringColors[i * 3 + 2] = 0.4;
    } else if (colChoice === 1) {
      stringColors[i * 3] = 1.0;
      stringColors[i * 3 + 1] = 0.6;
      stringColors[i * 3 + 2] = 0.2;
    } else {
      stringColors[i * 3] = 1.0;
      stringColors[i * 3 + 1] = 0.95;
      stringColors[i * 3 + 2] = 0.8;
    }
  }

  const stringGeom = new THREE.BufferGeometry();
  stringGeom.setAttribute('position', new THREE.BufferAttribute(stringPositions, 3));
  stringGeom.setAttribute('color', new THREE.BufferAttribute(stringColors, 3));

  const stringMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
  });
  const stringLights = new THREE.Points(stringGeom, stringMat);
  group.add(stringLights);

  // -------------------------------------------------------------
  // OPEN CENTRAL RANGOLI PLAZA (Tree completely removed, fully unobstructed)
  // -------------------------------------------------------------
  const rangoliTex = createRangoliTexture();
  const rangoliGeom = new THREE.PlaneGeometry(4.6, 4.6);
  rangoliGeom.rotateX(-Math.PI / 2);
  const rangoliMat = new THREE.MeshBasicMaterial({
    map: rangoliTex,
    transparent: true,
    opacity: 0.98,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const rangoliMesh = new THREE.Mesh(rangoliGeom, rangoliMat);
  rangoliMesh.position.set(0, 0.025, 1.0);
  group.add(rangoliMesh);

  // Decorative border ring of 24 traditional clay diyas around the Rangoli
  const rangoliDiyaGroup = new THREE.Group();
  rangoliDiyaGroup.position.set(0, 0, 1.0);
  const diyaBorderRadius = 2.38;

  for (let d = 0; d < 24; d++) {
    const dAngle = (d / 24) * Math.PI * 2;
    const dx = Math.cos(dAngle) * diyaBorderRadius;
    const dz = Math.sin(dAngle) * diyaBorderRadius;

    // Clay Diya base
    const diyaGeom = new THREE.CylinderGeometry(0.09, 0.05, 0.06, 8);
    const diyaMat = new THREE.MeshStandardMaterial({
      color: '#b24c1e',
      roughness: 0.75,
      metalness: 0.1,
    });
    const diya = new THREE.Mesh(diyaGeom, diyaMat);
    diya.position.set(dx, 0.03, dz);
    rangoliDiyaGroup.add(diya);

    // Flickering Golden Flame
    const flameGeom = new THREE.ConeGeometry(0.04, 0.1, 6);
    const flameMat = new THREE.MeshBasicMaterial({ color: '#ffcc00' });
    const flame = new THREE.Mesh(flameGeom, flameMat);
    flame.position.set(dx, 0.09, dz);
    rangoliDiyaGroup.add(flame);
  }

  // Warm glowing plaza lighting casting gentle amber light across the entire rangoli
  const rangoliLight = new THREE.PointLight('#ff9800', 1.6, 7.5);
  rangoliLight.position.set(0, 0.8, 1.0);
  rangoliDiyaGroup.add(rangoliLight);
  diyaLights.push(rangoliLight);

  group.add(rangoliDiyaGroup);

  // Traditional Brass Urlis (bowls with floating flower petals & candles) along sidewalk steps
  const urliPositions = [
    [-3.8, 0.25, 3.5],
    [3.8, 0.25, 3.5],
    [-3.8, 0.25, -1.8],
    [3.8, 0.25, -1.8],
  ];
  urliPositions.forEach(([ux, uy, uz]) => {
    const urli = new THREE.Group();
    urli.position.set(ux, uy, uz);

    // Brass Bowl
    const bowlGeom = new THREE.CylinderGeometry(0.35, 0.2, 0.18, 16);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      metalness: 0.8,
      roughness: 0.3,
    });
    const bowl = new THREE.Mesh(bowlGeom, bowlMat);
    bowl.position.y = 0.09;
    urli.add(bowl);

    // Water surface
    const waterGeom = new THREE.CircleGeometry(0.32, 16);
    waterGeom.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#1a365d',
      roughness: 0.1,
      metalness: 0.9,
    });
    const water = new THREE.Mesh(waterGeom, waterMat);
    water.position.y = 0.16;
    urli.add(water);

    // Floating Marigold Petals & Center Diya
    const petalColors = ['#f59e0b', '#ef4444', '#f59e0b', '#eab308'];
    for (let p = 0; p < 8; p++) {
      const pAngle = (p / 8) * Math.PI * 2;
      const px = Math.cos(pAngle) * 0.2;
      const pz = Math.sin(pAngle) * 0.2;
      const petalGeom = new THREE.BoxGeometry(0.06, 0.015, 0.06);
      const petalMat = new THREE.MeshStandardMaterial({ color: petalColors[p % petalColors.length] });
      const petal = new THREE.Mesh(petalGeom, petalMat);
      petal.position.set(px, 0.165, pz);
      urli.add(petal);
    }

    // Floating diya in center
    const fDiyaGeom = new THREE.ConeGeometry(0.04, 0.08, 6);
    const fDiyaMat = new THREE.MeshBasicMaterial({ color: '#ffb703' });
    const fDiya = new THREE.Mesh(fDiyaGeom, fDiyaMat);
    fDiya.position.set(0, 0.22, 0);
    urli.add(fDiya);

    group.add(urli);
  });

  // -------------------------------------------------------------
  // MITHAI GHAR (Sweet Shop Stall - Memory 10)
  // -------------------------------------------------------------
  const mithaiStall = new THREE.Group();
  mithaiStall.position.set(-3.6, 0, -5.0);

  // Wooden Counter
  const counterGeom = new THREE.BoxGeometry(1.6, 1.0, 3.0);
  const counterMat = new THREE.MeshStandardMaterial({ color: '#5d4037', roughness: 0.6 });
  const counter = new THREE.Mesh(counterGeom, counterMat);
  counter.position.y = 0.5;
  mithaiStall.add(counter);

  // Striped Festive Canopy (orange & cream stripes)
  const canopyGeom = new THREE.BoxGeometry(2.0, 0.15, 3.4);
  const canopyMat = new THREE.MeshStandardMaterial({ color: '#ff8f00', roughness: 0.6 });
  const shopCanopy = new THREE.Mesh(canopyGeom, canopyMat);
  shopCanopy.position.set(0, 2.4, 0);
  mithaiStall.add(shopCanopy);

  // Canopy support posts
  [-0.8, 0.8].forEach((cx) => {
    [-1.4, 1.4].forEach((cz) => {
      const postGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6);
      const post = new THREE.Mesh(postGeom, counterMat);
      post.position.set(cx, 1.2, cz);
      mithaiStall.add(post);
    });
  });

  // Shop Signboard ("Mithai Ghar")
  const signTex = createWelcomeBannerTexture('Mithai Ghar', 'Fresh Sweets');
  const signGeom = new THREE.PlaneGeometry(2.4, 0.6);
  const signMat = new THREE.MeshBasicMaterial({ map: signTex });
  const signMesh = new THREE.Mesh(signGeom, signMat);
  signMesh.position.set(0.9, 2.0, 0);
  signMesh.rotation.y = Math.PI / 2;
  mithaiStall.add(signMesh);

  // Sweet Trays with Laddoos, Kaju Katlis, Jalebis
  const trayMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.8, roughness: 0.3 });
  const sweetOffsets = [-0.9, 0, 0.9];
  sweetOffsets.forEach((sz, idx) => {
    const trayGeom = new THREE.BoxGeometry(0.7, 0.06, 0.7);
    const tray = new THREE.Mesh(trayGeom, trayMat);
    tray.position.set(0.1, 1.03, sz);
    mithaiStall.add(tray);

    // Sweets on tray
    const sweetColor = idx === 0 ? '#ffb300' : idx === 1 ? '#e0e0e0' : '#ff6f00'; // Laddoo, Katli, Jalebi
    const sweetGeom = new THREE.SphereGeometry(0.06, 6, 6);
    const sweetMat = new THREE.MeshStandardMaterial({ color: sweetColor, roughness: 0.5 });
    for (let si = 0; si < 9; si++) {
      const sx = ((si % 3) - 1) * 0.16;
      const szz = (Math.floor(si / 3) - 1) * 0.16;
      const sweet = new THREE.Mesh(sweetGeom, sweetMat);
      sweet.position.set(0.1 + sx, 1.1, sz + szz);
      mithaiStall.add(sweet);
    }
  });

  group.add(mithaiStall);

  // -------------------------------------------------------------
  // MANDIR (Temple Shrine & Bell - Memory 9)
  // -------------------------------------------------------------
  const mandirGroup = new THREE.Group();
  mandirGroup.position.set(3.8, 0, -1.0);

  // Plinth
  const mandirPlinthGeom = new THREE.BoxGeometry(2.0, 0.4, 2.0);
  const mandirPlinthMat = new THREE.MeshStandardMaterial({ color: '#f5f5dc', roughness: 0.6 });
  const mandirPlinth = new THREE.Mesh(mandirPlinthGeom, mandirPlinthMat);
  mandirPlinth.position.y = 0.2;
  mandirGroup.add(mandirPlinth);

  // Pillars & Shikhar (Dome)
  const domeGeom = new THREE.ConeGeometry(0.8, 1.6, 8);
  const domeMat = new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 0.8, roughness: 0.25 });
  const dome = new THREE.Mesh(domeGeom, domeMat);
  dome.position.y = 2.8;
  mandirGroup.add(dome);

  // Kalash on peak
  const kalashGeom = new THREE.SphereGeometry(0.15, 8, 8);
  const kalash = new THREE.Mesh(kalashGeom, domeMat);
  kalash.position.y = 3.65;
  mandirGroup.add(kalash);

  // Temple Hanging Brass Bell
  const mandirBell = new THREE.Group();
  mandirBell.position.set(-0.5, 1.9, 0);

  const bellGeom = new THREE.CylinderGeometry(0.04, 0.16, 0.28, 12, 1, true);
  const bellMat = new THREE.MeshStandardMaterial({
    color: '#e6b800',
    metalness: 0.9,
    roughness: 0.2,
  });
  const bellMesh = new THREE.Mesh(bellGeom, bellMat);
  mandirBell.add(bellMesh);

  // Clapper
  const clapperGeom = new THREE.SphereGeometry(0.04, 8, 8);
  const clapper = new THREE.Mesh(clapperGeom, bellMat);
  clapper.position.y = -0.14;
  mandirBell.add(clapper);

  mandirGroup.add(mandirBell);

  // Warm temple glow
  const templeLight = new THREE.PointLight('#ff9900', 1.0, 5);
  templeLight.position.set(-0.2, 1.2, 0);
  mandirGroup.add(templeLight);
  diyaLights.push(templeLight);

  group.add(mandirGroup);

  // -------------------------------------------------------------
  // ROOFTOP / CITY TERRACE OVERLOOK (Back Vista, z = 16 to 22)
  // -------------------------------------------------------------
  const rooftopArea = new THREE.Group();
  rooftopArea.position.set(0, 0, 16.5);

  // Stone Balustrade / Railing overlooking skyline
  const railingGeom = new THREE.BoxGeometry(9.6, 0.9, 0.3);
  const railingMat = new THREE.MeshStandardMaterial({ color: '#efebe9', roughness: 0.5 });
  const railing = new THREE.Mesh(railingGeom, railingMat);
  railing.position.set(0, 0.45, 1.8);
  rooftopArea.add(railing);

  // Balusters
  for (let bx = -4.5; bx <= 4.5; bx += 0.6) {
    const balusterGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6);
    const baluster = new THREE.Mesh(balusterGeom, railingMat);
    baluster.position.set(bx, 0.4, 1.8);
    rooftopArea.add(baluster);
  }

  // Sparkling Skyline Backdrop Cylinder
  const skylineGeom = new THREE.CylinderGeometry(30, 30, 18, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
  const skylineMat = new THREE.MeshBasicMaterial({
    map: skylineTex,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.9,
  });
  const skylineMesh = new THREE.Mesh(skylineGeom, skylineMat);
  skylineMesh.position.set(0, 6, 12);
  rooftopArea.add(skylineMesh);

  group.add(rooftopArea);

  // -------------------------------------------------------------
  // AMBIENT DIYAS LINING THE STREET EDGES
  // -------------------------------------------------------------
  const diyaSpacing = 2.4;
  for (let z = -10; z <= 15; z += diyaSpacing) {
    [-3.8, 3.8].forEach((dx) => {
      const diyaHolder = new THREE.Group();
      diyaHolder.position.set(dx, 0.25, z);

      // Clay Diya bowl
      const bowlGeom = new THREE.CylinderGeometry(0.09, 0.05, 0.06, 8);
      const bowlMat = new THREE.MeshStandardMaterial({ color: '#a04000', roughness: 0.8 });
      const bowl = new THREE.Mesh(bowlGeom, bowlMat);
      diyaHolder.add(bowl);

      // Flame
      const flameGeom = new THREE.ConeGeometry(0.035, 0.09, 6);
      const flameMat = new THREE.MeshBasicMaterial({ color: '#ffb300' });
      const flame = new THREE.Mesh(flameGeom, flameMat);
      flame.position.y = 0.06;
      diyaHolder.add(flame);
      diyaFlames.push(diyaHolder);

      // Point light
      const pLight = new THREE.PointLight('#ff8800', 0.45, 3.2);
      pLight.position.y = 0.1;
      diyaHolder.add(pLight);
      diyaLights.push(pLight);

      group.add(diyaHolder);
    });
  }

  // -------------------------------------------------------------
  // HAVELI COURTYARD BENCH (Sitting Together - Memory 3)
  // -------------------------------------------------------------
  const haveliBench = new THREE.Group();
  haveliBench.position.set(-3.2, 0, 2.4);

  const benchWoodMat = new THREE.MeshStandardMaterial({ color: '#3e2723', roughness: 0.65 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: '#880e4f', roughness: 0.5 }); // Royal Maroon
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 0.8, roughness: 0.3 });

  // Bench Seat Plinth
  const seatGeom = new THREE.BoxGeometry(1.6, 0.1, 0.6);
  const seat = new THREE.Mesh(seatGeom, benchWoodMat);
  seat.position.set(0, 0.4, 0);
  haveliBench.add(seat);

  // Soft Cushion
  const cushionGeom = new THREE.BoxGeometry(1.5, 0.08, 0.52);
  const cushion = new THREE.Mesh(cushionGeom, cushionMat);
  cushion.position.set(0, 0.48, 0);
  haveliBench.add(cushion);

  // Carved Backrest
  const backrestGeom = new THREE.BoxGeometry(1.6, 0.6, 0.08);
  const backrest = new THREE.Mesh(backrestGeom, benchWoodMat);
  backrest.position.set(0, 0.8, -0.26);
  haveliBench.add(backrest);

  // Bench Legs
  const legGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6);
  [
    [-0.7, 0.2, -0.22],
    [0.7, 0.2, -0.22],
    [-0.7, 0.2, 0.22],
    [0.7, 0.2, 0.22],
  ].forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeom, benchWoodMat);
    leg.position.set(lx, ly, lz);
    haveliBench.add(leg);
  });

  // Marigold Garlands draped over bench backrest
  const benchGarlandGeom = new THREE.TorusGeometry(0.35, 0.035, 6, 12, Math.PI);
  const benchGarlandMat = new THREE.MeshStandardMaterial({ color: '#ff8f00', roughness: 0.9 });
  [-0.4, 0.4].forEach((bx) => {
    const g = new THREE.Mesh(benchGarlandGeom, benchGarlandMat);
    g.rotation.x = Math.PI;
    g.position.set(bx, 1.1, -0.26);
    haveliBench.add(g);
  });

  group.add(haveliBench);

  // -------------------------------------------------------------
  // THE FIRST DIYA (Dedicated Altar at Doorway Stoop - Memory 1)
  // -------------------------------------------------------------
  const firstDiyaGroup = new THREE.Group();
  firstDiyaGroup.position.set(-3.8, 0.4, 6.0);

  // Brass Puja Thali
  const firstThaliGeom = new THREE.CylinderGeometry(0.32, 0.28, 0.04, 16);
  const firstThali = new THREE.Mesh(firstThaliGeom, goldTrimMat);
  firstDiyaGroup.add(firstThali);

  // Clay Diya Bowl
  const firstBowlGeom = new THREE.CylinderGeometry(0.1, 0.06, 0.07, 10);
  const firstBowlMat = new THREE.MeshStandardMaterial({ color: '#a04000', roughness: 0.75 });
  const firstBowl = new THREE.Mesh(firstBowlGeom, firstBowlMat);
  firstBowl.position.y = 0.055;
  firstDiyaGroup.add(firstBowl);

  // Growing Flame (starts at scale 0 until lit!)
  const firstFlameGeom = new THREE.ConeGeometry(0.045, 0.12, 8);
  const firstFlameMat = new THREE.MeshBasicMaterial({ color: '#ffea00' });
  const firstDiyaFlame = new THREE.Mesh(firstFlameGeom, firstFlameMat);
  firstDiyaFlame.position.y = 0.14;
  firstDiyaFlame.scale.set(0.001, 0.001, 0.001); // Initially unlit!
  firstDiyaGroup.add(firstDiyaFlame);

  // Dedicated warm point light (starts off)
  const firstDiyaLight = new THREE.PointLight('#ff9900', 0, 4.5);
  firstDiyaLight.position.set(0, 0.2, 0);
  firstDiyaGroup.add(firstDiyaLight);
  diyaLights.push(firstDiyaLight);

  group.add(firstDiyaGroup);

  // Animation states
  let isDiyaIgnited = false;
  let diyaIgniteTime = 0;
  let bellSwingTime = 0;
  let isBellRinging = false;
  let rangoliBloomTime = 0;
  let isRangoliBlooming = false;

  const igniteFirstDiya = () => {
    isDiyaIgnited = true;
    diyaIgniteTime = 0;
  };

  const ringMandirBell = () => {
    isBellRinging = true;
    bellSwingTime = 0;
  };

  const bloomRangoli = () => {
    isRangoliBlooming = true;
    rangoliBloomTime = 0;
  };

  const updateAnimations = (delta: number) => {
    // 1. First Diya Flame ignition growth
    if (isDiyaIgnited) {
      diyaIgniteTime += delta;
      const progress = Math.min(1.0, diyaIgniteTime / 1.5);
      const flameScale = THREE.MathUtils.lerp(0.001, 1.0, progress);
      firstDiyaFlame.scale.set(flameScale, flameScale * (1 + Math.sin(diyaIgniteTime * 15) * 0.15), flameScale);
      firstDiyaLight.intensity = THREE.MathUtils.lerp(0, 1.4, progress);
    }

    // 2. Mandir Bell Swinging
    if (isBellRinging) {
      bellSwingTime += delta;
      const decay = Math.exp(-bellSwingTime * 1.8);
      mandirBell.rotation.z = Math.sin(bellSwingTime * 14) * 0.4 * decay;
      if (bellSwingTime > 3.0) {
        isBellRinging = false;
        mandirBell.rotation.z = 0;
      }
    }

    // 3. Rangoli blooming animation
    if (isRangoliBlooming) {
      rangoliBloomTime += delta;
      const progress = Math.min(1.0, rangoliBloomTime / 2.0);
      const scale = THREE.MathUtils.lerp(0.85, 1.05, progress);
      rangoliMesh.scale.set(scale, scale, scale);
    }
  };

  const lightUpAll = () => {
    diyaLights.forEach((l) => {
      l.intensity *= 1.8;
    });
  };

  return {
    group,
    diyaLights,
    kandilMeshes,
    stringLights,
    diyaFlames,
    rangoliMesh,
    mandirBell,
    mithaiStall,
    rooftopArea,
    haveliBench,
    firstDiyaGroup,
    firstDiyaFlame,
    firstDiyaLight,
    ringMandirBell,
    igniteFirstDiya,
    bloomRangoli,
    updateAnimations,
    lightUpAll,
  };
}
