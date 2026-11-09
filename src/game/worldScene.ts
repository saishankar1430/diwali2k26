import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MemoryItem, PlayerInput, InteractionState } from '../types/game';
import { createCoupleActor, CoupleActor } from './characterModels';
import { createDiwaliEnvironment, EnvironmentResult } from './environment';
import { createInteractiveProps, InteractivePropManager } from './interactiveProps';
import { ParticleManager } from './particleEffects';
import { clampPlayerPosition } from './rules';
import { soundEngine } from '../utils/audio';

export interface WorldSceneConfig {
  container: HTMLDivElement;
  onNearMemoryChange: (memory: MemoryItem | null) => void;
  onMemoryComplete: (memory: MemoryItem) => void;
  onInteractionStateChange?: (state: InteractionState, memory: MemoryItem | null) => void;
}

export class WorldScene {
  public container: HTMLDivElement;
  public renderer!: THREE.WebGLRenderer;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean;

  // Scene Components
  public coupleActor!: CoupleActor;
  public environment!: EnvironmentResult;
  public interactiveProps!: InteractivePropManager;
  public particleManager!: ParticleManager;

  // Game & Camera State
  public playerPos = new THREE.Vector3(0, 0, -6.5);
  public playerHeading = 0; // Radians, facing +Z initially
  private cameraOffset = new THREE.Vector3(0, 1.8, -3.5);
  private cameraTarget = new THREE.Vector3(0, 1.0, -3.0);
  private cameraOrbitAngleX = 0;
  private cameraOrbitAngleY = 0.15;
  public isCinematic: boolean = false;
  private cinematicTargetPos = new THREE.Vector3();
  private cinematicTargetLook = new THREE.Vector3();

  // Interaction State Machine
  public interactionState: InteractionState = 'idle';
  public activeInteractingMemory: MemoryItem | null = null;
  private interactionTimer: number = 0;
  private onInteractionStateChange?: (state: InteractionState, memory: MemoryItem | null) => void;
  private onMemoryCompleteCallback: (memory: MemoryItem) => void;
  public isChakriSpinning: boolean = false;
  private hasLanternLaunched: boolean = false;
  private rocketLaunchCount: number = 0;
  public eventLight!: THREE.PointLight;

  // Scratch vectors for zero GC in render loop
  private _scratchVec1 = new THREE.Vector3();
  private _scratchVec2 = new THREE.Vector3();

  // Input & Lifecycle
  private input: PlayerInput = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    interact: false,
  };
  private isMoving = false;
  private clock = new THREE.Clock();
  private frameId: number = 0;
  private isDisposed = false;

  private onNearMemoryChange: (memory: MemoryItem | null) => void;
  public memories: MemoryItem[] = [];
  public currentNearMemory: MemoryItem | null = null;

  constructor(config: WorldSceneConfig, memories: MemoryItem[]) {
    this.container = config.container;
    this.onNearMemoryChange = config.onNearMemoryChange;
    this.onMemoryCompleteCallback = config.onMemoryComplete;
    this.onInteractionStateChange = config.onInteractionStateChange;
    this.memories = memories;

    // Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    this.initScene();
    this.initPBRandLighting();
    this.initActorsAndProps();
    this.bindEvents();
    this.startLoop();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0f081d'); // Midnight Diwali sky
    this.scene.fog = new THREE.FogExp2('#140b24', 0.024);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150);
    this.camera.position.set(0, 2.5, -12);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  private initPBRandLighting() {
    // Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Indian Night Sky Hemisphere Light
    const hemiLight = new THREE.HemisphereLight('#ffe0b2', '#1a0d2e', 0.75);
    this.scene.add(hemiLight);

    // Warm Directional Key Light (Moonlight & Ambient Glow)
    const dirLight = new THREE.DirectionalLight('#ffe5b4', 1.0);
    dirLight.position.set(12, 22, -10);
    dirLight.castShadow = !this.isSoftwareGl;
    if (!this.isSoftwareGl) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 45;
      dirLight.shadow.camera.left = -15;
      dirLight.shadow.camera.right = 15;
      dirLight.shadow.camera.top = 15;
      dirLight.shadow.camera.bottom = -15;
      dirLight.shadow.bias = -0.0005;
    }
    this.scene.add(dirLight);

    // Distant Starfield in Night Sky
    const starCount = 650;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 60 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.45); // Sky hemisphere
      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.max(12, radius * Math.cos(phi));
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#fffbf0',
      size: 0.35,
      transparent: true,
      opacity: 0.85,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    this.scene.add(starPoints);
  }

  private initActorsAndProps() {
    // 3D Environment
    this.environment = createDiwaliEnvironment();
    this.scene.add(this.environment.group);

    // Interactive Props
    this.interactiveProps = createInteractiveProps(this.memories);
    this.scene.add(this.interactiveProps.group);

    // Couple & Cat
    this.coupleActor = createCoupleActor();
    this.coupleActor.root.position.copy(this.playerPos);
    this.scene.add(this.coupleActor.root);

    // Dynamic firework / event point light
    this.eventLight = new THREE.PointLight('#ffea00', 0, 14);
    this.eventLight.position.set(0, 1.0, 0);
    this.scene.add(this.eventLight);

    // Particle Manager
    this.particleManager = new ParticleManager(this.scene);
  }

  public setInput(newInput: Partial<PlayerInput>) {
    this.input = { ...this.input, ...newInput };
  }

  public setOrbitDelta(dx: number, dy: number) {
    if (this.isCinematic) return;
    this.cameraOrbitAngleX -= dx * 0.005;
    this.cameraOrbitAngleY = Math.max(-0.1, Math.min(0.85, this.cameraOrbitAngleY + dy * 0.005));
  }

  public teleportTo(pos: [number, number, number], heading?: number) {
    this.playerPos.set(pos[0], pos[1], pos[2]);
    if (heading !== undefined) this.playerHeading = heading;
    this.coupleActor.root.position.copy(this.playerPos);
    this.coupleActor.root.rotation.y = this.playerHeading;

    // Check proximity immediately
    let closestMem: MemoryItem | null = null;
    let minDist = 3.2;
    for (const mem of this.memories) {
      const dist = this.playerPos.distanceTo(new THREE.Vector3(mem.position[0], mem.position[1], mem.position[2]));
      if (dist < minDist) {
        minDist = dist;
        closestMem = mem;
      }
    }
    this.currentNearMemory = closestMem;
    this.onNearMemoryChange(closestMem);
  }

  public startCinematicView(cameraPos: [number, number, number], lookAt: [number, number, number]) {
    this.isCinematic = true;
    this.cinematicTargetPos.set(cameraPos[0], cameraPos[1], cameraPos[2]);
    this.cinematicTargetLook.set(lookAt[0], lookAt[1], lookAt[2]);
  }

  public resetToThirdPerson() {
    this.isCinematic = false;
    this.interactionState = 'idle';
    this.activeInteractingMemory = null;
    this.isChakriSpinning = false;
    this.hasLanternLaunched = false;
    this.rocketLaunchCount = 0;
    this.eventLight.intensity = 0;
    this.interactiveProps.setLanternLaunched(false);
    this.coupleActor.setPose('idle');
    this.coupleActor.setSparklersVisible(false);
    if (this.onInteractionStateChange) {
      this.onInteractionStateChange('idle', null);
    }
  }

  // -------------------------------------------------------------
  // CINEMATIC INTERACTION ORCHESTRATION
  // -------------------------------------------------------------
  public triggerCinematicInteraction(memory: MemoryItem) {
    if (this.interactionState !== 'idle') return;

    this.interactionState = 'approaching';
    this.activeInteractingMemory = memory;
    this.interactionTimer = 0;
    this.isCinematic = true;
    this.isChakriSpinning = false;
    this.hasLanternLaunched = false;
    this.rocketLaunchCount = 0;
    this.eventLight.intensity = 0;

    if (this.onInteractionStateChange) {
      this.onInteractionStateChange('approaching', memory);
    }

    // Set cinematic camera framing (guaranteeing both character and object are visible, unoccluded)
    const camX = memory.characterTargetPos[0] + memory.cameraOffset[0];
    const camY = memory.characterTargetPos[1] + memory.cameraOffset[1];
    const camZ = memory.characterTargetPos[2] + memory.cameraOffset[2];
    this.startCinematicView([camX, camY, camZ], memory.cameraTarget);
  }

  private handleInteractionLifecycle(delta: number) {
    if (!this.activeInteractingMemory) return;
    const mem = this.activeInteractingMemory;

    if (this.interactionState === 'approaching') {
      // Step 1: Smoothly orient and walk characters to the exact interaction spot
      const targetPos = new THREE.Vector3(mem.characterTargetPos[0], mem.characterTargetPos[1], mem.characterTargetPos[2]);
      const dist = this.playerPos.distanceTo(targetPos);

      if (dist > 0.08) {
        const moveDir = targetPos.clone().sub(this.playerPos).normalize();
        this.playerPos.addScaledVector(moveDir, delta * 2.8);
        this.playerHeading = THREE.MathUtils.damp(this.playerHeading, mem.characterTargetHeading, 8.0, delta);
        this.coupleActor.root.position.copy(this.playerPos);
        this.coupleActor.root.rotation.y = this.playerHeading;
        this.coupleActor.updateAnimation(delta, true);
      } else {
        // Arrived at spot! Transition to animation state
        this.playerPos.copy(targetPos);
        this.playerHeading = mem.characterTargetHeading;
        this.coupleActor.root.position.copy(this.playerPos);
        this.coupleActor.root.rotation.y = this.playerHeading;

        this.interactionState = 'playing_animation';
        this.interactionTimer = 0;
        this.coupleActor.setPose(mem.pose);

        // Trigger visible object & audio responses
        this.executeObjectResponse(mem);

        if (this.onInteractionStateChange) {
          this.onInteractionStateChange('playing_animation', mem);
        }
      }
    } else if (this.interactionState === 'playing_animation') {
      this.interactionTimer += delta;
      this.coupleActor.updateAnimation(delta, false);

      let targetDuration = 3.0;

      // 1. ANAAR INTERACTION: Fuse ignition -> 5m golden fountain -> gentle ember finish
      if (mem.type === 'anar') {
        targetDuration = 4.5;
        if (this.interactionTimer < 0.75) {
          this.particleManager.spawnAnaarFuse(mem.position);
          this.eventLight.position.set(mem.position[0], mem.position[1] + 0.4, mem.position[2]);
          this.eventLight.intensity = 0.5 + Math.random() * 0.3;
        } else {
          // Standing back to admire the fountain
          this.coupleActor.setPose('look_up');
          const surgeProgress = Math.min(1.0, (this.interactionTimer - 0.75) / 1.0);
          this.particleManager.spawnAnaarSurge(mem.position, surgeProgress, 35);
          this.eventLight.position.set(mem.position[0], mem.position[1] + 1.2, mem.position[2]);
          this.eventLight.color.set('#ffea00');
          this.eventLight.intensity = 2.4 * surgeProgress + Math.sin(this.interactionTimer * 25) * 0.5;
        }
      }
      // 2. CHAKRI INTERACTION: Fuse ignition -> rapid ground spin & circular spark vortex
      else if (mem.type === 'chakri') {
        targetDuration = 4.2;
        if (this.interactionTimer < 0.65) {
          this.particleManager.spawnAnaarFuse(mem.position);
        } else {
          this.isChakriSpinning = true;
          this.coupleActor.setPose('idle');
          this.particleManager.spawnChakriSpin(mem.position, this.interactionTimer * 22.0, 24);
          this.eventLight.position.set(mem.position[0], mem.position[1] + 0.25, mem.position[2]);
          this.eventLight.color.set('#ffd54f');
          this.eventLight.intensity = 1.6 + Math.sin(this.interactionTimer * 30) * 0.4;
        }
      }
      // 3. CANDIL / SKY LANTERN INTERACTION: Light wick -> rises smoothly into starry sky
      else if (mem.type === 'lantern') {
        targetDuration = 5.0;
        if (this.interactionTimer >= 1.0 && !this.hasLanternLaunched) {
          this.hasLanternLaunched = true;
          this.interactiveProps.setLanternLaunched(true);
          this.particleManager.launchSkyLantern(this.scene, [mem.position[0], mem.position[1] + 0.6, mem.position[2]]);
          this.coupleActor.setPose('look_up');
        }
        if (this.hasLanternLaunched) {
          // Camera smoothly tilts upward tracking the rising lantern into the sky
          this.cinematicTargetLook.y = THREE.MathUtils.damp(this.cinematicTargetLook.y, 14.0, 0.8, delta);
        }
      }
      // 4. SKY ROCKET INTERACTION: Ascends with fire trail -> giant aerial chrysanthemum bursts
      else if (mem.type === 'rocket') {
        targetDuration = 4.8;
        this.coupleActor.setPose('look_up');
        if (this.interactionTimer >= 0.3 && this.rocketLaunchCount === 0) {
          this.rocketLaunchCount = 1;
          this.particleManager.launchRocket([mem.position[0], mem.position[1], mem.position[2]], 18, '#ffd700', false);
        } else if (this.interactionTimer >= 1.5 && this.rocketLaunchCount === 1) {
          this.rocketLaunchCount = 2;
          this.particleManager.launchRocket([mem.position[0] + 1.8, mem.position[1], mem.position[2] + 2.0], 22, '#ff4081', true);
          soundEngine.playFireworkBurst(false);
        } else if (this.interactionTimer >= 2.6 && this.rocketLaunchCount === 2) {
          this.rocketLaunchCount = 3;
          this.particleManager.launchRocket([mem.position[0] - 2.5, mem.position[1], mem.position[2] + 1.2], 20, '#00e5ff', false);
          soundEngine.playFireworkBurst(true);
        }
      }
      // 5. RANGOLI INTERACTION: Blooming colors with swirling golden sparkles
      else if (mem.type === 'rangoli') {
        targetDuration = 3.5;
        this.particleManager.spawnRangoliSparkles(mem.position, 6);
      }
      // 6. PHULJHADI (SPARKLER) INTERACTION
      else if (mem.type === 'phuljhadi') {
        targetDuration = 3.5;
        const handPos = this.playerPos.clone().add(new THREE.Vector3(0.2, 1.0, 0.2));
        this.particleManager.spawnSparklerEmbers(handPos, 6);
      }

      // After animation sequence completes, present the corner story card
      if (this.interactionTimer >= targetDuration) {
        this.interactionState = 'completing_event';
        this.isChakriSpinning = false;
        this.eventLight.intensity = 0;
        if (this.onInteractionStateChange) {
          this.onInteractionStateChange('completing_event', mem);
        }
        this.onMemoryCompleteCallback(mem);
      }
    } else {
      this.coupleActor.updateAnimation(delta, false);
    }
  }

  private executeObjectResponse(mem: MemoryItem) {
    switch (mem.type) {
      case 'diya':
        soundEngine.playDiyaSound();
        this.environment.igniteFirstDiya();
        this.particleManager.spawnAnarSparks(mem.position, 8);
        break;
      case 'rangoli':
        soundEngine.playCardReveal();
        this.environment.bloomRangoli();
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            this.particleManager.spawnChakriSparks(mem.position, i * 1.5, 12);
          }, i * 200);
        }
        break;
      case 'temple':
        soundEngine.playTempleBell();
        this.environment.ringMandirBell();
        break;
      case 'sit':
        soundEngine.playCardReveal();
        break;
      case 'kandil':
        soundEngine.playDiyaSound();
        this.environment.lightUpAll();
        break;
      case 'lantern':
        soundEngine.playDiyaSound();
        this.particleManager.launchSkyLantern(this.scene, [mem.position[0], mem.position[1] + 0.6, mem.position[2]]);
        break;
      case 'chakri':
        soundEngine.playChakriSound();
        break;
      case 'rocket':
        soundEngine.playRocketSound();
        setTimeout(() => {
          this.particleManager.spawnHeartFirework([mem.position[0], mem.position[1] + 12, mem.position[2] + 8]);
        }, 900);
        break;
      case 'anar':
        soundEngine.playAnarSound();
        break;
      case 'phuljhadi':
        soundEngine.playSparklerSound();
        this.coupleActor.setSparklersVisible(true);
        break;
      case 'mithai':
        soundEngine.playCardReveal();
        break;
    }
  }

  public skipCurrentCinematic() {
    if (this.activeInteractingMemory) {
      const mem = this.activeInteractingMemory;
      this.interactionState = 'completing_event';
      if (this.onInteractionStateChange) {
        this.onInteractionStateChange('completing_event', mem);
      }
      this.onMemoryCompleteCallback(mem);
    }
  }

  private updatePlayer(delta: number) {
    if (this.isCinematic) {
      this.handleInteractionLifecycle(delta);
      return;
    }

    const moveSpeed = 3.6;
    let moveX = 0;
    let moveZ = 0;

    if (this.input.forward) moveZ += 1;
    if (this.input.backward) moveZ -= 1;
    if (this.input.left) moveX -= 1;
    if (this.input.right) moveX += 1;

    this.isMoving = moveX !== 0 || moveZ !== 0;

    if (this.isMoving) {
      const forwardVec = this._scratchVec1.set(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraOrbitAngleX);
      const rightVec = this._scratchVec2.set(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraOrbitAngleX);

      const moveDir = new THREE.Vector3()
        .addScaledVector(forwardVec, moveZ)
        .addScaledVector(rightVec, moveX)
        .normalize();

      this.playerPos.addScaledVector(moveDir, moveSpeed * delta);

      const [cx, cz] = clampPlayerPosition(this.playerPos.x, this.playerPos.z, -3.8, 3.8, -11.0, 17.5);
      this.playerPos.x = cx;
      this.playerPos.z = cz;

      const targetHeading = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetHeading - this.playerHeading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.playerHeading += angleDiff * Math.min(1.0, delta * 9.0);
    }

    this.coupleActor.root.position.copy(this.playerPos);
    this.coupleActor.root.rotation.y = this.playerHeading;
    this.coupleActor.updateAnimation(delta, this.isMoving);

    // Detect nearby memory
    let closestMem: MemoryItem | null = null;
    let minDist = 3.2;

    for (const mem of this.memories) {
      const dist = this.playerPos.distanceTo(new THREE.Vector3(mem.position[0], mem.position[1], mem.position[2]));
      if (dist < minDist) {
        minDist = dist;
        closestMem = mem;
      }
    }

    if (closestMem !== this.currentNearMemory) {
      this.currentNearMemory = closestMem;
      this.onNearMemoryChange(closestMem);
    }
  }

  private updateCamera(delta: number) {
    if (this.isCinematic) {
      // Smooth exponential damping to cinematic framing
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.cinematicTargetPos.x, 5.0, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.cinematicTargetPos.y, 5.0, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.cinematicTargetPos.z, 5.0, delta);

      this.cameraTarget.x = THREE.MathUtils.damp(this.cameraTarget.x, this.cinematicTargetLook.x, 6.0, delta);
      this.cameraTarget.y = THREE.MathUtils.damp(this.cameraTarget.y, this.cinematicTargetLook.y, 6.0, delta);
      this.cameraTarget.z = THREE.MathUtils.damp(this.cameraTarget.z, this.cinematicTargetLook.z, 6.0, delta);
      this.camera.lookAt(this.cameraTarget);
      return;
    }

    // Third-Person Over-the-shoulder follow
    const camDist = 3.8;
    const camHeight = 1.6 + Math.sin(this.cameraOrbitAngleY) * 2.2;
    const horizDist = Math.cos(this.cameraOrbitAngleY) * camDist;

    const targetCamX = this.playerPos.x - Math.sin(this.cameraOrbitAngleX) * horizDist;
    const targetCamZ = this.playerPos.z - Math.cos(this.cameraOrbitAngleX) * horizDist;
    const targetCamY = Math.max(0.6, this.playerPos.y + camHeight);

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 6.0, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 6.0, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 6.0, delta);

    const lookTargetY = this.playerPos.y + 1.1;
    this.cameraTarget.set(
      THREE.MathUtils.damp(this.cameraTarget.x, this.playerPos.x, 8.0, delta),
      THREE.MathUtils.damp(this.cameraTarget.y, lookTargetY, 8.0, delta),
      THREE.MathUtils.damp(this.cameraTarget.z, this.playerPos.z, 8.0, delta)
    );

    this.camera.lookAt(this.cameraTarget);
  }

  private handleResize = () => {
    if (!this.container || this.isDisposed) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private bindEvents() {
    window.addEventListener('resize', this.handleResize);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      this.setOrbitDelta(dx, dy);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  private startLoop() {
    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 60);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (this.isDisposed) return;
      const delta = Math.min(this.clock.getDelta(), 0.05);

      this.updatePlayer(delta);
      this.updateCamera(delta);
      this.environment.updateAnimations(delta);
      this.interactiveProps.update(delta, this.memories, this.isChakriSpinning);
      this.particleManager.update(delta);

      // Ambient magical shimmer over the central Rangoli plaza
      if (Math.random() > 0.65) {
        this.particleManager.spawnRangoliSparkles([0, 0.025, 1.0], 1);
      }

      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    tick();
  }

  public dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    window.removeEventListener('resize', this.handleResize);
    this.particleManager.dispose();
    this.renderer.dispose();
  }
}
