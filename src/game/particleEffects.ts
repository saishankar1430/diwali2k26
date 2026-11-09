import * as THREE from 'three';

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  drag?: number;
  gravity?: number;
}

interface SkyRocket {
  pos: THREE.Vector3;
  targetY: number;
  speed: number;
  color: string;
  isHeart: boolean;
  trailTimer: number;
}

export class ParticleManager {
  private particles: Particle[] = [];
  private geom: THREE.BufferGeometry;
  private mat: THREE.PointsMaterial;
  private points: THREE.Points;
  private maxParticles = 4800;
  private skyLanterns: { group: THREE.Group; velY: number; swayPhase: number }[] = [];
  private activeRockets: SkyRocket[] = [];
  private sceneRef: THREE.Scene;

  // Reusable colors to prevent GC
  private colGold = new THREE.Color('#ffea00');
  private colAmber = new THREE.Color('#ff9100');
  private colWhite = new THREE.Color('#ffffff');
  private colCoral = new THREE.Color('#ff5252');
  private colPink = new THREE.Color('#ff4081');
  private colTeal = new THREE.Color('#00e5ff');
  private colGreen = new THREE.Color('#00e676');
  private colPurple = new THREE.Color('#e040fb');
  private colSmoke = new THREE.Color('#4a4055');

  constructor(scene: THREE.Scene) {
    this.sceneRef = scene;
    this.geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxParticles * 3);
    const colors = new Float32Array(this.maxParticles * 3);

    this.geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geom, this.mat);
    scene.add(this.points);

    // Seed gentle ambient distant lanterns in the night sky
    this.seedDistantSkyLanterns();
  }

  private seedDistantSkyLanterns() {
    const lanternPositions = [
      [-12, 18, 22],
      [14, 24, 25],
      [-6, 28, 30],
      [8, 20, 18],
      [-15, 32, 28],
      [18, 30, 32],
      [0, 35, 35],
    ];

    lanternPositions.forEach(([lx, ly, lz]) => {
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(lx, ly, lz);

      const lanternGeom = new THREE.CylinderGeometry(0.25, 0.2, 0.55, 8);
      const lanternMat = new THREE.MeshBasicMaterial({
        color: '#ff9800',
        transparent: true,
        opacity: 0.85,
      });
      const lantern = new THREE.Mesh(lanternGeom, lanternMat);
      lanternGroup.add(lantern);

      this.sceneRef.add(lanternGroup);
      this.skyLanterns.push({
        group: lanternGroup,
        velY: 0.4 + Math.random() * 0.4,
        swayPhase: Math.random() * Math.PI * 2,
      });
    });
  }

  // -------------------------------------------------------------
  // 1. ANAAR (FLOWERPOT FOUNTAIN OF GOLDEN SPARKS)
  // -------------------------------------------------------------
  public spawnAnaarFuse(origin: [number, number, number]) {
    const [ox, oy, oz] = origin;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.8;
      this.particles.push({
        pos: new THREE.Vector3(ox, oy + 0.38, oz),
        vel: new THREE.Vector3(Math.cos(angle) * speed, 0.6 + Math.random() * 0.8, Math.sin(angle) * speed),
        color: Math.random() > 0.4 ? this.colGold.clone() : this.colWhite.clone(),
        size: 0.14,
        alpha: 1.0,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.25,
        gravity: -2.0,
      });
    }
  }

  public spawnAnaarSurge(origin: [number, number, number], intensity = 1.0, count = 35) {
    const [ox, oy, oz] = origin;
    const baseHeight = 0.38;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Parabolic cone spread
      const spread = 0.12 + Math.random() * 0.28;
      const verticalSpeed = (5.5 + Math.random() * 5.5) * intensity;
      const horizontalSpeed = verticalSpeed * spread;

      const vx = Math.cos(angle) * horizontalSpeed;
      const vy = verticalSpeed;
      const vz = Math.sin(angle) * horizontalSpeed;

      const colRand = Math.random();
      const col =
        colRand > 0.7
          ? this.colWhite.clone()
          : colRand > 0.3
          ? this.colGold.clone()
          : this.colAmber.clone();

      this.particles.push({
        pos: new THREE.Vector3(ox + (Math.random() - 0.5) * 0.08, oy + baseHeight, oz + (Math.random() - 0.5) * 0.08),
        vel: new THREE.Vector3(vx, vy, vz),
        color: col,
        size: 0.16 + Math.random() * 0.12,
        alpha: 1.0,
        life: 0,
        maxLife: 0.75 + Math.random() * 0.55,
        gravity: -7.8, // Heavy parabolic arc
        drag: 0.98,
      });
    }

    // Occasional wispy smoke particle
    if (Math.random() > 0.6) {
      this.particles.push({
        pos: new THREE.Vector3(ox, oy + baseHeight + 0.2, oz),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.4, 1.2 + Math.random() * 0.8, (Math.random() - 0.5) * 0.4),
        color: this.colSmoke.clone(),
        size: 0.35,
        alpha: 0.4,
        life: 0,
        maxLife: 1.2,
        gravity: 0.4,
      });
    }
  }

  // -------------------------------------------------------------
  // 2. CHAKRI (GROUND SPINNER)
  // -------------------------------------------------------------
  public spawnChakriSpin(origin: [number, number, number], currentAngle: number, count = 22) {
    const [ox, oy, oz] = origin;
    const baseHeight = 0.04;

    for (let i = 0; i < count; i++) {
      // 2 opposite nozzle emission streams
      const streamOffset = i % 2 === 0 ? 0 : Math.PI;
      const tangAngle = currentAngle + streamOffset + (Math.random() - 0.5) * 0.4;
      const speed = 4.2 + Math.random() * 3.8;

      const vx = Math.cos(tangAngle) * speed;
      const vy = 0.15 + Math.random() * 0.45;
      const vz = Math.sin(tangAngle) * speed;

      const isEmerald = Math.random() > 0.75;
      const col = isEmerald ? this.colGreen.clone() : Math.random() > 0.4 ? this.colGold.clone() : this.colAmber.clone();

      this.particles.push({
        pos: new THREE.Vector3(ox, oy + baseHeight, oz),
        vel: new THREE.Vector3(vx, vy, vz),
        color: col,
        size: 0.16 + Math.random() * 0.1,
        alpha: 1.0,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35,
        gravity: -3.5,
        drag: 0.94,
      });
    }
  }

  // -------------------------------------------------------------
  // 3. SKY FIREWORKS & ROCKET ASCENT
  // -------------------------------------------------------------
  public launchRocket(origin: [number, number, number], targetHeight = 16, color = '#ffd700', isHeart = false) {
    this.activeRockets.push({
      pos: new THREE.Vector3(origin[0], origin[1] + 0.3, origin[2]),
      targetY: origin[1] + targetHeight,
      speed: 16.0 + Math.random() * 4.0,
      color,
      isHeart,
      trailTimer: 0,
    });
  }

  public spawnChrysanthemumFirework(origin: [number, number, number], hexColor: string, count = 180) {
    const [ox, oy, oz] = origin;
    const baseColor = new THREE.Color(hexColor);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 4.5 + Math.random() * 6.5;

      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.cos(phi) * speed + 0.8;
      const vz = Math.sin(phi) * Math.sin(theta) * speed;

      const col = Math.random() > 0.25 ? baseColor.clone() : this.colGold.clone();

      this.particles.push({
        pos: new THREE.Vector3(ox, oy, oz),
        vel: new THREE.Vector3(vx, vy, vz),
        color: col,
        size: 0.26 + Math.random() * 0.12,
        alpha: 1.0,
        life: 0,
        maxLife: 2.0 + Math.random() * 0.8,
        gravity: -3.2,
        drag: 0.97, // Cascading willow tendril deceleration
      });
    }
  }

  public spawnHeartFirework(origin: [number, number, number]) {
    const [ox, oy, oz] = origin;
    const count = 150;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3) * 0.18;
      const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.18;

      const p: Particle = {
        pos: new THREE.Vector3(ox, oy, oz),
        vel: new THREE.Vector3(
          hx * 2.2 + (Math.random() - 0.5) * 0.4,
          hy * 2.2 + (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 1.2
        ),
        color: (i % 2 === 0 ? this.colPink : this.colGold).clone(),
        size: 0.28,
        alpha: 1.0,
        life: 0,
        maxLife: 2.5,
        gravity: -2.4,
        drag: 0.98,
      };
      this.particles.push(p);
    }
  }

  public spawnGrandFirework(origin: [number, number, number], hexColor: string) {
    this.spawnChrysanthemumFirework(origin, hexColor, 200);
  }

  // -------------------------------------------------------------
  // 4. CANDIL / SKY LANTERN RELEASE
  // -------------------------------------------------------------
  public launchSkyLantern(scene: THREE.Scene, startPos: [number, number, number]): THREE.Group {
    const [sx, sy, sz] = startPos;
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(sx, sy, sz);

    // Bamboo Frame & Translucent Gold Paper
    const lanternGeom = new THREE.CylinderGeometry(0.34, 0.25, 0.75, 12);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: '#ffa726',
      emissive: '#ff6d00',
      emissiveIntensity: 0.9,
      roughness: 0.35,
    });
    const lantern = new THREE.Mesh(lanternGeom, lanternMat);
    lantern.position.y = 0.38;
    lanternGroup.add(lantern);

    // Inner glowing flame
    const flameGeom = new THREE.SphereGeometry(0.09, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: '#fffde7' });
    const flame = new THREE.Mesh(flameGeom, flameMat);
    flame.position.y = 0.18;
    lanternGroup.add(flame);

    // Warm radiant point light illuminating surroundings as it ascends
    const light = new THREE.PointLight('#ffa000', 1.8, 8);
    light.position.y = 0.38;
    lanternGroup.add(light);

    scene.add(lanternGroup);
    this.skyLanterns.push({
      group: lanternGroup,
      velY: 1.8,
      swayPhase: Math.random() * Math.PI * 2,
    });
    return lanternGroup;
  }

  // -------------------------------------------------------------
  // 5. PHULJHADI (SPARKLER) PARTICLES
  // -------------------------------------------------------------
  public spawnSparklerEmbers(handPos: THREE.Vector3, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elev = (Math.random() - 0.5) * Math.PI;
      const speed = 1.2 + Math.random() * 1.6;

      this.particles.push({
        pos: handPos.clone(),
        vel: new THREE.Vector3(
          Math.cos(angle) * Math.cos(elev) * speed,
          Math.sin(elev) * speed,
          Math.sin(angle) * Math.cos(elev) * speed
        ),
        color: Math.random() > 0.3 ? this.colGold.clone() : this.colWhite.clone(),
        size: 0.15,
        alpha: 1.0,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35,
        gravity: -4.0,
      });
    }
  }

  // -------------------------------------------------------------
  // 6. RANGOLI AMBIENT MAGICAL SPARKLES
  // -------------------------------------------------------------
  public spawnRangoliSparkles(center: [number, number, number], count = 4) {
    const [cx, cy, cz] = center;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2.2;
      const px = cx + Math.cos(angle) * radius;
      const pz = cz + Math.sin(angle) * radius;

      this.particles.push({
        pos: new THREE.Vector3(px, cy + 0.05 + Math.random() * 0.2, pz),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.15, 0.25 + Math.random() * 0.35, (Math.random() - 0.5) * 0.15),
        color: Math.random() > 0.5 ? this.colGold.clone() : this.colCoral.clone(),
        size: 0.12 + Math.random() * 0.08,
        alpha: 0.9,
        life: 0,
        maxLife: 1.4 + Math.random() * 0.8,
        gravity: 0.05, // Gentle float up
      });
    }
  }

  // Legacy compat aliases
  public spawnAnarSparks(origin: [number, number, number], count = 25) {
    this.spawnAnaarSurge(origin, 1.0, count);
  }

  public spawnChakriSparks(origin: [number, number, number], angle: number, count = 12) {
    this.spawnChakriSpin(origin, angle, count);
  }

  // -------------------------------------------------------------
  // UPDATE TICK
  // -------------------------------------------------------------
  public update(delta: number) {
    // 1. Update Active Ascending Rockets
    for (let r = this.activeRockets.length - 1; r >= 0; r--) {
      const rocket = this.activeRockets[r];
      rocket.pos.y += rocket.speed * delta;
      rocket.trailTimer += delta;

      // Emit trailing fire sparks
      for (let s = 0; s < 4; s++) {
        this.particles.push({
          pos: rocket.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.15, -0.2, (Math.random() - 0.5) * 0.15)),
          vel: new THREE.Vector3((Math.random() - 0.5) * 0.8, -rocket.speed * 0.4, (Math.random() - 0.5) * 0.8),
          color: this.colGold.clone(),
          size: 0.2,
          alpha: 1.0,
          life: 0,
          maxLife: 0.35,
          gravity: -2.0,
        });
      }

      // Detonation reached
      if (rocket.pos.y >= rocket.targetY) {
        if (rocket.isHeart) {
          this.spawnHeartFirework([rocket.pos.x, rocket.pos.y, rocket.pos.z]);
        } else {
          this.spawnChrysanthemumFirework([rocket.pos.x, rocket.pos.y, rocket.pos.z], rocket.color, 180);
        }
        this.activeRockets.splice(r, 1);
      }
    }

    // 2. Update Particles Buffer
    const positions = this.geom.attributes.position.array as Float32Array;
    const colors = this.geom.attributes.color.array as Float32Array;
    let writeIdx = 0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Physics
      const g = p.gravity !== undefined ? p.gravity : -3.8;
      p.vel.y += g * delta;
      if (p.drag !== undefined) {
        p.vel.x *= p.drag;
        p.vel.z *= p.drag;
      }
      p.pos.addScaledVector(p.vel, delta);
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      positions[writeIdx * 3] = p.pos.x;
      positions[writeIdx * 3 + 1] = p.pos.y;
      positions[writeIdx * 3 + 2] = p.pos.z;

      colors[writeIdx * 3] = p.color.r * p.alpha;
      colors[writeIdx * 3 + 1] = p.color.g * p.alpha;
      colors[writeIdx * 3 + 2] = p.color.b * p.alpha;

      writeIdx++;
      if (writeIdx >= this.maxParticles) break;
    }

    // Zero out unused particles
    for (let i = writeIdx; i < this.maxParticles; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -999;
      positions[i * 3 + 2] = 0;
    }

    this.geom.attributes.position.needsUpdate = true;
    this.geom.attributes.color.needsUpdate = true;

    // 3. Update Rising Sky Lanterns
    for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
      const sl = this.skyLanterns[i];
      sl.swayPhase += delta * 1.5;
      sl.group.position.y += sl.velY * delta;
      sl.group.position.x += Math.sin(sl.swayPhase) * delta * 0.45;
      sl.group.position.z += Math.cos(sl.swayPhase * 0.8) * delta * 0.35;
      sl.group.rotation.y += delta * 0.25;

      // Emit trailing golden embers
      if (Math.random() > 0.7 && writeIdx < this.maxParticles - 1) {
        this.particles.push({
          pos: sl.group.position.clone().add(new THREE.Vector3(0, -0.2, 0)),
          vel: new THREE.Vector3((Math.random() - 0.5) * 0.2, -0.6, (Math.random() - 0.5) * 0.2),
          color: this.colGold.clone(),
          size: 0.12,
          alpha: 0.8,
          life: 0,
          maxLife: 0.8,
          gravity: -0.5,
        });
      }

      if (sl.group.position.y > 60) {
        sl.group.removeFromParent();
        this.skyLanterns.splice(i, 1);
      }
    }
  }

  public dispose() {
    this.geom.dispose();
    this.mat.dispose();
  }
}
