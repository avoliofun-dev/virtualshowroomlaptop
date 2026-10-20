import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';

export class VirtualOffice {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('canvas-container');
    this.onZoneEnter = options.onZoneEnter || (() => {});
    this.onZoneLeave = options.onZoneLeave || (() => {});
    this.onMinimapUpdate = options.onMinimapUpdate || (() => {});
    this.onFootstep = options.onFootstep || (() => {});
    this.theme = options.theme || 'dark'; // 'dark' | 'light'
    
    // Scene state
    this.zones = [];
    this.floatingItems = [];
    this.laptopMeshes = [];
    this.npcVisitors = [];
    this.stepped = false;
    this.currentZone = null;
    this.clock = new THREE.Clock();
    
    // Smooth Movement Physics State
    this.velocity = new THREE.Vector3();
    this.maxSpeed = 9.5;
    this.acceleration = 38.0;
    this.friction = 7.5;
    this.angularSpeed = 12.0;
    this.targetRotation = 0;
    this.currentRotation = 0;
    this.walkCycle = 0;
    
    // Input state
    this.keys = { w: false, a: false, s: false, d: false };
    this.joystickVector = { x: 0, y: 0 };
    this.targetMovePoint = null;

    // Camera Orbit, Pan & Zoom State
    this.cameraDistance = 21.0;
    this.minDistance = 6.0;
    this.maxDistance = 42.0;
    this.cameraTheta = 0.0; // Horizontal orbit angle (Azimuth)
    this.cameraPhi = Math.PI / 4.0; // Vertical elevation angle
    this.minPhi = 0.18; // Don't go completely vertical overhead
    this.maxPhi = Math.PI * 0.46; // Don't clip through ground
    this.panOffset = new THREE.Vector3(0, 0, 0); // Panorama pan offset
    
    // Mouse Interaction Tracking
    this.isMouseDown = false;
    this.mouseButton = 0; // 0: Left (Rotate/Click), 2: Right (Pan)
    this.mouseStartX = 0;
    this.mouseStartY = 0;
    this.mouseLastX = 0;
    this.mouseLastY = 0;
    this.hasDragged = false;
    this.dragThreshold = 5; // pixels
    
    // Defined Laptop Store Zones
    this.zoneDefinitions = [
      {
        id: 'lobby',
        name: 'Lobby & Tech Concierge',
        subtitle: 'Konsultasi Rekomendasi Laptop & Buku Tamu',
        color: 0x00f2fe,
        position: { x: 0, z: 12 },
        radius: 4.5,
        icon: '💻',
        type: 'reception'
      },
      {
        id: 'display',
        name: 'Laptop Showcase Arena',
        subtitle: 'Katalog Laptop Gaming, Ultrabook, & Workstation',
        color: 0x9d4edd,
        position: { x: -14, z: -4 },
        radius: 6.2,
        icon: '⚡',
        type: 'services'
      },
      {
        id: 'meeting',
        name: 'Benchmark & Demo Studio',
        subtitle: 'Tes Performa FPS & Jadwalkan Demo Live',
        color: 0xffbe0b,
        position: { x: 14, z: -4 },
        radius: 5.0,
        icon: '📊',
        type: 'meeting'
      },
      {
        id: 'lounge',
        name: 'Accessories & Customer Hub',
        subtitle: 'Aksesori Laptop, Unboxing Corner & Ulasan Pembeli',
        color: 0xff007a,
        position: { x: 0, z: -14 },
        radius: 5.5,
        icon: '🎧',
        type: 'lounge'
      },
      {
        id: 'promo',
        name: 'Flash Sale & Promo Vault',
        subtitle: 'Klaim Diskon Rp 500rb + Bonus Aksesori',
        color: 0x00f59b,
        position: { x: 12, z: 12 },
        radius: 3.5,
        icon: '🎁',
        type: 'promo'
      }
    ];

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.setupThemeColors();

    // 2. Camera with safe dimension fallbacks
    const width = this.container.clientWidth || window.innerWidth || 1280;
    const height = this.container.clientHeight || window.innerHeight || 720;
    const aspect = width / (height || 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 250);
    // Explicit initial camera position to prevent starting at black (0,0,0) inside the floor!
    const initTheta = this.cameraTheta;
    const initPhi = this.cameraPhi;
    const initDist = this.cameraDistance;
    this.camera.position.set(
      initDist * Math.sin(initPhi) * Math.sin(initTheta),
      1.3 + initDist * Math.cos(initPhi),
      16 + initDist * Math.sin(initPhi) * Math.cos(initTheta)
    );
    this.camera.lookAt(0, 1.3, 16);

    // 3. Renderer with robust device compatibility fallback
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' });
    } catch (e1) {
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'default' });
      } catch (e2) {
        renderer = new THREE.WebGLRenderer();
      }
    }
    this.renderer = renderer;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Window Resize Listener
    this.onResize = () => {
      const w = this.container.clientWidth || window.innerWidth || 1280;
      const h = this.container.clientHeight || window.innerHeight || 720;
      if (w > 0 && h > 0 && this.camera && this.renderer) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', () => setTimeout(this.onResize, 200));
    setTimeout(this.onResize, 100);
    setTimeout(this.onResize, 450);

    // 4. Lights
    try { this.setupLighting(); } catch (e) { console.error('Lighting init error:', e); }

    // 5. Open Environment & Floor (NO CEILING OBSTRUCTIONS)
    try { this.buildOfficeArchitecture(); } catch (e) { console.error('Office architecture error:', e); }

    // 6. Interactive Zones & Props
    try { this.buildZones(); } catch (e) { console.error('Zones build error:', e); }

    // 7. Player Avatar
    try { this.buildPlayer(); } catch (e) { console.error('Player avatar build error:', e); }

    // 7B. Live NPC Visitors (Tahap 5 Showroom Simulation & Walking Maya Frontliner)
    try { this.buildNPCVisitors(); } catch (e) { console.error('NPC visitors build error:', e); }

    // 8. Event Listeners for Orbit, Pan, Zoom, and Movement
    try { this.setupInputListeners(); } catch (e) { console.error('Input listeners error:', e); }

    // 9. Apply initial theme
    try { this.applyTheme(this.theme); } catch (e) { console.error('Theme apply error:', e); }

    // 10. Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupThemeColors() {
    if (this.theme === 'light') {
      this.scene.background = new THREE.Color(0xf1f5f9);
      this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.005);
    } else {
      this.scene.background = new THREE.Color(0x131926); // Bright luminous cyber navy
      this.scene.fog = new THREE.FogExp2(0x131926, 0.004); // Gentle atmospheric depth (no dark void!)
    }
  }

  applyTheme(theme) {
    this.theme = theme;
    if (theme === 'light') {
      this.scene.background.set(0xf1f5f9);
      if (this.scene.fog) this.scene.fog.color.set(0xf1f5f9);
      if (this.floorMat) {
        this.floorMat.color.set(0xf8fafc);
        this.floorMat.roughness = 0.22;
        this.floorMat.metalness = 0.15;
      }
      if (this.ambientLight) this.ambientLight.intensity = 1.6;
      if (this.dirLight) this.dirLight.intensity = 1.8;
      if (this.fillLight) this.fillLight.intensity = 0.8;
      if (this.gridHelper) this.gridHelper.visible = false;
    } else {
      this.scene.background.set(0x131926);
      if (this.scene.fog) this.scene.fog.color.set(0x131926);
      if (this.floorMat) {
        this.floorMat.color.set(0x1e2738); // Elegant polished showroom floor
        this.floorMat.roughness = 0.20;
        this.floorMat.metalness = 0.65;
      }
      if (this.ambientLight) this.ambientLight.intensity = 1.45;
      if (this.dirLight) this.dirLight.intensity = 1.65;
      if (this.fillLight) this.fillLight.intensity = 0.95;
      if (this.gridHelper) this.gridHelper.visible = true;
    }
  }

  setupLighting() {
    // 1. High-illumination Ambient Light (ensures all characters are clearly visible)
    this.ambientLight = new THREE.AmbientLight(0xffffff, this.theme === 'light' ? 1.6 : 1.45);
    this.scene.add(this.ambientLight);

    // 2. Main Studio Directional Sun/Key Light
    this.dirLight = new THREE.DirectionalLight(0xfff8ee, this.theme === 'light' ? 1.8 : 1.65);
    this.dirLight.position.set(18, 34, 22);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 100;
    const d = 32;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    // 3. Fill Light (illuminates front of avatars and eliminates dark shadows)
    this.fillLight = new THREE.DirectionalLight(0x00f2fe, 0.95);
    this.fillLight.position.set(-18, 26, -20);
    this.scene.add(this.fillLight);

    // 4. Center Showroom Chandelier Downlight
    this.centerGlow = new THREE.PointLight(0xffffff, 2.4, 75);
    this.centerGlow.position.set(0, 14, 0);
    this.scene.add(this.centerGlow);

    // 5. Hemisphere Ambient Reflection
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.85);
    this.scene.add(this.hemiLight);
  }

  buildOfficeArchitecture() {
    // Floor: Luminous reflective showroom floor
    const floorGeo = new THREE.PlaneGeometry(64, 64);
    this.floorMat = new THREE.MeshStandardMaterial({
      color: this.theme === 'light' ? 0xf8fafc : 0x1e2738,
      roughness: 0.20,
      metalness: 0.65
    });
    this.floor = new THREE.Mesh(floorGeo, this.floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Neon floor grid
    this.gridHelper = new THREE.GridHelper(64, 32, 0x00f2fe, 0x1e293b);
    this.gridHelper.position.y = 0.02;
    this.scene.add(this.gridHelper);

    // Low architectural perimeter glass boundaries (no high blocking walls)
    const boundaryMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.25
    });

    const bGeoX = new THREE.BoxGeometry(64, 2.2, 0.4);
    const bGeoZ = new THREE.BoxGeometry(0.4, 2.2, 64);

    const backWall = new THREE.Mesh(bGeoX, boundaryMat);
    backWall.position.set(0, 1.1, -32);
    this.scene.add(backWall);

    const frontWall = new THREE.Mesh(bGeoX, boundaryMat);
    frontWall.position.set(0, 1.1, 32);
    this.scene.add(frontWall);

    const leftWall = new THREE.Mesh(bGeoZ, boundaryMat);
    leftWall.position.set(-32, 1.1, 0);
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(bGeoZ, boundaryMat);
    rightWall.position.set(32, 1.1, 0);
    this.scene.add(rightWall);

    // NOTE: All overhead ceiling beams, roof structures, and top obstructions
    // have been completely removed as requested, ensuring 100% open panoramic view!
  }

  buildZones() {
    this.zoneDefinitions.forEach(def => {
      // Zone Floor Ring
      const ringGeo = new THREE.RingGeometry(def.radius - 0.25, def.radius, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(def.position.x, 0.04, def.position.z);
      this.scene.add(ring);

      // Inner disc
      const diskGeo = new THREE.CircleGeometry(def.radius - 0.25, 32);
      const diskMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
      });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.rotation.x = -Math.PI / 2;
      disk.position.set(def.position.x, 0.03, def.position.z);
      this.scene.add(disk);

      // Spot light over zone (bright, crisp illumination)
      const spot = new THREE.SpotLight(def.color, 4.2, 30, Math.PI / 3.8, 0.4);
      spot.position.set(def.position.x, 12, def.position.z);
      spot.target.position.set(def.position.x, 0, def.position.z);
      this.scene.add(spot);
      this.scene.add(spot.target);

      // Specific 3D props based on zone type
      this.buildZoneProps(def);
    });
  }

  // Create a realistic stylized 3D Laptop Group
  create3DLaptop(accentColor = 0x00f2fe, screenColor = 0x00f2fe) {
    const laptop = new THREE.Group();

    // 1. Base Keyboard Chassis (Aluminum Body)
    const baseGeo = new THREE.BoxGeometry(1.2, 0.06, 0.85);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x222a38,
      metalness: 0.8,
      roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.03, 0);
    base.castShadow = true;
    laptop.add(base);

    // Keyboard Deck cutout
    const kbGeo = new THREE.BoxGeometry(0.95, 0.02, 0.45);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.6 });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0, 0.065, -0.08);
    laptop.add(kb);

    // Trackpad
    const padGeo = new THREE.BoxGeometry(0.35, 0.01, 0.22);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.5 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(0, 0.062, 0.24);
    laptop.add(pad);

    // RGB Accent strip on base edge
    const rgbGeo = new THREE.BoxGeometry(1.15, 0.02, 0.03);
    const rgbMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const rgb = new THREE.Mesh(rgbGeo, rgbMat);
    rgb.position.set(0, 0.04, 0.42);
    laptop.add(rgb);

    // 2. Screen Lid (Tilted back at ~115 deg)
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.05, -0.42);
    screenGroup.rotation.x = -Math.PI / 1.6;

    const lidGeo = new THREE.BoxGeometry(1.2, 0.04, 0.82);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x1e2633, metalness: 0.85, roughness: 0.2 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.set(0, 0.02, 0.41);
    lid.castShadow = true;
    screenGroup.add(lid);

    // Glowing Display Screen
    const displayGeo = new THREE.PlaneGeometry(1.12, 0.74);
    const displayMat = new THREE.MeshStandardMaterial({
      color: screenColor,
      emissive: screenColor,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 0.042, 0.41);
    display.rotation.x = -Math.PI / 2;
    screenGroup.add(display);

    laptop.add(screenGroup);
    return laptop;
  }

  buildZoneProps(def) {
    const group = new THREE.Group();
    group.position.set(def.position.x, 0, def.position.z);

    if (def.id === 'lobby') {
      // Reception desk
      const deskGeo = new THREE.CylinderGeometry(2.4, 2.4, 1.1, 32, 1, false, 0, Math.PI);
      const deskMat = new THREE.MeshStandardMaterial({ color: 0x182234, roughness: 0.3, metalness: 0.7 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(0, 0.55, 0);
      desk.rotation.y = Math.PI;
      desk.castShadow = true;
      group.add(desk);

      // Glowing desk edge
      const edgeGeo = new THREE.CylinderGeometry(2.42, 2.42, 0.06, 32, 1, false, 0, Math.PI);
      const edgeMat = new THREE.MeshBasicMaterial({ color: def.color });
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.position.set(0, 1.05, 0);
      edge.rotation.y = Math.PI;
      group.add(edge);

      // Laptop on Reception Desk
      const recLaptop = this.create3DLaptop(0x00f2fe, 0x00f2fe);
      recLaptop.scale.set(0.65, 0.65, 0.65);
      recLaptop.position.set(0, 1.1, 0.4);
      group.add(recLaptop);

      // Holographic Ekalaya Tech Concierge Terminal Beacon
      const holoGeo = new THREE.TorusGeometry(0.85, 0.03, 16, 40);
      const holoMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
      const holo = new THREE.Mesh(holoGeo, holoMat);
      holo.position.set(0, 2.1, 0);
      group.add(holo);
      this.floatingItems.push({ mesh: holo, basePos: 2.1, rotSpeed: 1.5 });

    } else if (def.id === 'display') {
      // 4 Interactive Laptop Showcase Pedestals
      const laptopsData = [
        { id: 'rog', x: -2.3, z: -2.3, name: 'ROG Titan X', color: 0xff0055, screen: 0xff0055 },
        { id: 'zenbook', x: 2.3, z: -2.3, name: 'ZenAir OLED 14', color: 0x00f2fe, screen: 0x00f2fe },
        { id: 'macbook', x: -2.3, z: 2.3, name: 'MacBook Studio M3', color: 0x9d4edd, screen: 0xc77dff },
        { id: 'swift', x: 2.3, z: 2.3, name: 'Swift Go 14', color: 0x00f59b, screen: 0x00f59b }
      ];

      laptopsData.forEach(l => {
        const pedGeo = new THREE.CylinderGeometry(0.85, 0.95, 1.05, 24);
        const pedMat = new THREE.MeshStandardMaterial({ color: 0x1a2333, metalness: 0.8, roughness: 0.2 });
        const ped = new THREE.Mesh(pedGeo, pedMat);
        ped.position.set(l.x, 0.525, l.z);
        ped.castShadow = true;
        group.add(ped);

        const ringGeo = new THREE.TorusGeometry(0.86, 0.03, 16, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: l.color });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(l.x, 1.06, l.z);
        group.add(ring);

        const laptop3D = this.create3DLaptop(l.color, l.screen);
        laptop3D.scale.set(0.75, 0.75, 0.75);
        laptop3D.position.set(l.x, 1.25, l.z);
        laptop3D.rotation.y = Math.PI / 4;
        group.add(laptop3D);

        this.floatingItems.push({
          mesh: laptop3D,
          basePos: 1.25,
          rotSpeed: 0.65
        });
        this.laptopMeshes.push({ id: l.id, mesh: laptop3D });
      });

    } else if (def.id === 'meeting') {
      // Benchmark & Studio Table
      const tableGeo = new THREE.BoxGeometry(4.2, 0.15, 2.2);
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.5, roughness: 0.2 });
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(0, 0.85, 0);
      table.castShadow = true;
      group.add(table);

      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.85);
      [[-1.8, -0.8], [1.8, -0.8], [-1.8, 0.8], [1.8, 0.8]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, 0.425, lz);
        group.add(leg);
      });

      const b1 = this.create3DLaptop(0xffbe0b, 0xffbe0b);
      b1.scale.set(0.65, 0.65, 0.65);
      b1.position.set(-1.1, 0.95, 0);
      group.add(b1);

      const b2 = this.create3DLaptop(0x00f2fe, 0x00f2fe);
      b2.scale.set(0.65, 0.65, 0.65);
      b2.position.set(1.1, 0.95, 0);
      group.add(b2);

      const screenGeo = new THREE.PlaneGeometry(2.6, 1.4);
      const screenMat = new THREE.MeshBasicMaterial({
        color: 0xffbe0b,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 2.3, 0);
      group.add(screen);
      this.floatingItems.push({ mesh: screen, basePos: 2.3, rotSpeed: 0.35 });

    } else if (def.id === 'lounge') {
      const couchMat = new THREE.MeshStandardMaterial({ color: 0x22132e, roughness: 0.8 });
      const couchGeo = new THREE.BoxGeometry(2.8, 0.5, 1.1);
      const couch1 = new THREE.Mesh(couchGeo, couchMat);
      couch1.position.set(0, 0.25, -1.5);
      couch1.castShadow = true;
      group.add(couch1);

      const coffeeTableGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 24);
      const coffeeTableMat = new THREE.MeshStandardMaterial({ color: 0x181824, metalness: 0.6 });
      const coffeeTable = new THREE.Mesh(coffeeTableGeo, coffeeTableMat);
      coffeeTable.position.set(0, 0.2, 0);
      group.add(coffeeTable);

      const orbGeo = new THREE.TorusGeometry(0.4, 0.12, 16, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xff007a,
        emissive: 0xff007a,
        emissiveIntensity: 0.8,
        wireframe: true
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(0, 1.6, 0);
      group.add(orb);
      this.floatingItems.push({ mesh: orb, basePos: 1.6, rotSpeed: 1.2 });

    } else if (def.id === 'promo') {
      const giftGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const giftMat = new THREE.MeshStandardMaterial({
        color: 0x00f59b,
        emissive: 0x00f59b,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2
      });
      const gift = new THREE.Mesh(giftGeo, giftMat);
      gift.position.set(0, 1.4, 0);
      group.add(gift);
      this.floatingItems.push({ mesh: gift, basePos: 1.4, rotSpeed: 1.8 });

      const promoRingGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 40);
      const promoRingMat = new THREE.MeshBasicMaterial({ color: 0x00f59b });
      const promoRing = new THREE.Mesh(promoRingGeo, promoRingMat);
      promoRing.rotation.x = Math.PI / 2;
      promoRing.position.set(0, 1.4, 0);
      group.add(promoRing);
      this.floatingItems.push({ mesh: promoRing, basePos: 1.4, rotSpeed: -1.2 });
    }

    this.scene.add(group);
  }

  buildPlayer() {
    this.player = new THREE.Group();
    this.player.position.set(0, 0, 16); // Entrance

    this.playerMeshContainer = new THREE.Group();
    this.player.add(this.playerMeshContainer);

    // Blocky Roblox / Minecraft Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfed19e,
      roughness: 0.5,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x241812,
      roughness: 0.8,
      metalness: 0.1
    });

    const jacketMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.1
    });

    const accentMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3
    });

    const blackMat = new THREE.MeshBasicMaterial({
      color: 0x09090b
    });

    const mouthMat = new THREE.MeshBasicMaterial({
      color: 0xc0504d
    });

    // 1. Torso (Blocky Rectangular Body)
    this.torsoMesh = new THREE.Group();
    this.torsoMesh.position.set(0, 0.84, 0);
    this.playerMeshContainer.add(this.torsoMesh);

    // Main Torso Block (0.50 wide, 0.56 high, 0.26 deep)
    const torsoGeo = new THREE.BoxGeometry(0.50, 0.56, 0.26);
    const torsoBox = new THREE.Mesh(torsoGeo, jacketMat);
    torsoBox.castShadow = true;
    this.torsoMesh.add(torsoBox);

    // Inner White Shirt Insert on Front
    const innerShirtGeo = new THREE.BoxGeometry(0.16, 0.24, 0.02);
    const innerShirt = new THREE.Mesh(innerShirtGeo, shirtMat);
    innerShirt.position.set(0, 0.12, 0.131);
    this.torsoMesh.add(innerShirt);

    // Neon Zipper / Accent Stripe
    const zipperGeo = new THREE.BoxGeometry(0.025, 0.54, 0.02);
    const zipper = new THREE.Mesh(zipperGeo, accentMat);
    zipper.position.set(0, 0, 0.132);
    this.torsoMesh.add(zipper);

    // Ekalaya Tech Store ID Badge on Torso
    const badgeGeo = new THREE.BoxGeometry(0.10, 0.13, 0.02);
    const badge = new THREE.Mesh(badgeGeo, whiteMat);
    badge.position.set(0.12, 0.05, 0.132);
    this.torsoMesh.add(badge);

    const badgeChipGeo = new THREE.BoxGeometry(0.06, 0.04, 0.025);
    const badgeChip = new THREE.Mesh(badgeChipGeo, accentMat);
    badgeChip.position.set(0.12, 0.06, 0.133);
    this.torsoMesh.add(badgeChip);

    // 2. Head (Blocky Cube Head)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.14, 0); // Neck pivot point
    this.playerMeshContainer.add(this.headGroup);

    // Main Cube Head (0.38 x 0.38 x 0.38)
    const headGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const headBox = new THREE.Mesh(headGeo, skinMat);
    headBox.position.set(0, 0.19, 0);
    headBox.castShadow = true;
    this.headGroup.add(headBox);

    // Roblox / Minecraft Face Details (Front at z = +0.191)
    // Left Eye
    const eyeWhiteGeo = new THREE.BoxGeometry(0.065, 0.08, 0.01);
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, whiteMat);
    leftEyeWhite.position.set(-0.085, 0.20, 0.191);
    this.headGroup.add(leftEyeWhite);

    const pupilGeo = new THREE.BoxGeometry(0.04, 0.055, 0.012);
    const leftPupil = new THREE.Mesh(pupilGeo, blackMat);
    leftPupil.position.set(-0.08, 0.195, 0.192);
    this.headGroup.add(leftPupil);

    const shineGeo = new THREE.BoxGeometry(0.015, 0.015, 0.014);
    const leftShine = new THREE.Mesh(shineGeo, whiteMat);
    leftShine.position.set(-0.072, 0.21, 0.193);
    this.headGroup.add(leftShine);

    // Right Eye
    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, whiteMat);
    rightEyeWhite.position.set(0.085, 0.20, 0.191);
    this.headGroup.add(rightEyeWhite);

    const rightPupil = new THREE.Mesh(pupilGeo, blackMat);
    rightPupil.position.set(0.08, 0.195, 0.192);
    this.headGroup.add(rightPupil);

    const rightShine = new THREE.Mesh(shineGeo, whiteMat);
    rightShine.position.set(0.088, 0.21, 0.193);
    this.headGroup.add(rightShine);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.075, 0.016, 0.01);
    const leftBrow = new THREE.Mesh(browGeo, blackMat);
    leftBrow.position.set(-0.085, 0.265, 0.191);
    this.headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, blackMat);
    rightBrow.position.set(0.085, 0.265, 0.191);
    this.headGroup.add(rightBrow);

    // Roblox Cute Smile
    const mouthGeo = new THREE.BoxGeometry(0.09, 0.02, 0.01);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.105, 0.191);
    this.headGroup.add(mouth);

    // Blocky Stylish Hair / Cap
    const hairCapGeo = new THREE.BoxGeometry(0.40, 0.12, 0.40);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.33, 0);
    this.headGroup.add(hairCap);

    const hairBangsGeo = new THREE.BoxGeometry(0.36, 0.07, 0.06);
    const hairBangs = new THREE.Mesh(hairBangsGeo, hairMat);
    hairBangs.position.set(0, 0.29, 0.195);
    this.headGroup.add(hairBangs);

    // Gamer Headset (Iconic Roblox Accessory)
    const headsetBandGeo = new THREE.BoxGeometry(0.43, 0.04, 0.08);
    const headsetBand = new THREE.Mesh(headsetBandGeo, darkTrimMat);
    headsetBand.position.set(0, 0.395, 0);
    this.headGroup.add(headsetBand);

    const earcupGeo = new THREE.BoxGeometry(0.06, 0.14, 0.12);
    const leftEarcup = new THREE.Mesh(earcupGeo, darkTrimMat);
    leftEarcup.position.set(-0.21, 0.19, 0);
    this.headGroup.add(leftEarcup);

    const rightEarcup = new THREE.Mesh(earcupGeo, darkTrimMat);
    rightEarcup.position.set(0.21, 0.19, 0);
    this.headGroup.add(rightEarcup);

    // Glowing Neon Rings on Earcups
    const cupRingGeo = new THREE.BoxGeometry(0.065, 0.06, 0.06);
    const leftRing = new THREE.Mesh(cupRingGeo, accentMat);
    leftRing.position.set(-0.21, 0.19, 0);
    this.headGroup.add(leftRing);

    const rightRing = new THREE.Mesh(cupRingGeo, accentMat);
    rightRing.position.set(0.21, 0.19, 0);
    this.headGroup.add(rightRing);

    // Glasses Group (Toggable in Wardrobe)
    this.glassesGroup = new THREE.Group();
    const glassFrameGeo = new THREE.BoxGeometry(0.32, 0.06, 0.02);
    const glassFrame = new THREE.Mesh(glassFrameGeo, accentMat);
    glassFrame.position.set(0, 0.20, 0.198);
    this.glassesGroup.add(glassFrame);
    this.headGroup.add(this.glassesGroup);

    // 3. Left Arm (Blocky Roblox Arm with Shoulder Pivot)
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.37, 1.08, 0); // Pivot at shoulder
    this.leftArm.rotation.z = 0.10; // Classic Roblox outward flare
    this.playerMeshContainer.add(this.leftArm);

    // Arm Sleeve (Jacket color: upper 72%)
    const sleeveGeo = new THREE.BoxGeometry(0.22, 0.38, 0.22);
    const leftSleeve = new THREE.Mesh(sleeveGeo, jacketMat);
    leftSleeve.position.set(0, -0.19, 0);
    leftSleeve.castShadow = true;
    this.leftArm.add(leftSleeve);

    // Arm Hand (Skin color: lower 28%)
    const handGeo = new THREE.BoxGeometry(0.20, 0.16, 0.20);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0, -0.46, 0);
    leftHand.castShadow = true;
    this.leftArm.add(leftHand);

    // Wrist Smartwatch Cuff
    const cuffGeo = new THREE.BoxGeometry(0.225, 0.04, 0.225);
    const leftCuff = new THREE.Mesh(cuffGeo, accentMat);
    leftCuff.position.set(0, -0.37, 0);
    this.leftArm.add(leftCuff);

    // 4. Right Arm (Blocky Roblox Arm with Shoulder Pivot)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.37, 1.08, 0); // Pivot at shoulder
    this.rightArm.rotation.z = -0.10; // Classic Roblox outward flare
    this.playerMeshContainer.add(this.rightArm);

    const rightSleeve = new THREE.Mesh(sleeveGeo, jacketMat);
    rightSleeve.position.set(0, -0.19, 0);
    rightSleeve.castShadow = true;
    this.rightArm.add(rightSleeve);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0, -0.46, 0);
    rightHand.castShadow = true;
    this.rightArm.add(rightHand);

    // 5. Left Leg (Blocky Roblox Leg with Hip Pivot, Floor Grounded!)
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.135, 0.56, 0); // Hip pivot at y=0.56
    this.playerMeshContainer.add(this.leftLeg);

    // Trousers (Pants color: upper 80%)
    const pantsGeo = new THREE.BoxGeometry(0.24, 0.44, 0.24);
    const leftPants = new THREE.Mesh(pantsGeo, pantsMat);
    leftPants.position.set(0, -0.22, 0);
    leftPants.castShadow = true;
    this.leftLeg.add(leftPants);

    // Sneaker Base (White sole: lower 20% resting firmly at y=0.00 floor level)
    const shoeGeo = new THREE.BoxGeometry(0.245, 0.12, 0.25);
    const leftShoe = new THREE.Mesh(shoeGeo, whiteMat);
    leftShoe.position.set(0, -0.50, 0.005);
    leftShoe.castShadow = true;
    this.leftLeg.add(leftShoe);

    const shoeStripeGeo = new THREE.BoxGeometry(0.25, 0.03, 0.255);
    const leftShoeStripe = new THREE.Mesh(shoeStripeGeo, accentMat);
    leftShoeStripe.position.set(0, -0.48, 0.005);
    this.leftLeg.add(leftShoeStripe);

    // 6. Right Leg (Blocky Roblox Leg with Hip Pivot, Floor Grounded!)
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.135, 0.56, 0); // Hip pivot at y=0.56
    this.playerMeshContainer.add(this.rightLeg);

    const rightPants = new THREE.Mesh(pantsGeo, pantsMat);
    rightPants.position.set(0, -0.22, 0);
    rightPants.castShadow = true;
    this.rightLeg.add(rightPants);

    const rightShoe = new THREE.Mesh(shoeGeo, whiteMat);
    rightShoe.position.set(0, -0.50, 0.005);
    rightShoe.castShadow = true;
    this.rightLeg.add(rightShoe);

    const rightShoeStripe = new THREE.Mesh(shoeStripeGeo, accentMat);
    rightShoeStripe.position.set(0, -0.48, 0.005);
    this.rightLeg.add(rightShoeStripe);

    // Ground Shadow (Directly under feet)
    const shadowGeo = new THREE.CircleGeometry(0.42, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4
    });
    this.playerShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.playerShadow.rotation.x = -Math.PI / 2;
    this.playerShadow.position.y = 0.01;
    this.player.add(this.playerShadow);

    // Save avatar references for Wardrobe Customizer
    this.avatarMaterials = { skinMat, hairMat, jacketMat, shirtMat, pantsMat, accentMat, darkTrimMat, shoeWhiteMat: whiteMat };

    this.scene.add(this.player);
  }

  setAvatarStyle(options = {}) {
    if (!this.avatarMaterials) return;
    if (options.jacketColor !== undefined) {
      this.avatarMaterials.jacketMat.color.setHex(options.jacketColor);
    }
    if (options.accentColor !== undefined) {
      this.avatarMaterials.accentMat.color.setHex(options.accentColor);
    }
    if (options.hairColor !== undefined) {
      this.avatarMaterials.hairMat.color.setHex(options.hairColor);
    }
    if (options.pantsColor !== undefined) {
      this.avatarMaterials.pantsMat.color.setHex(options.pantsColor);
    }
    if (this.glassesGroup && options.showGlasses !== undefined) {
      this.glassesGroup.visible = !!options.showGlasses;
    }
  }

  setupInputListeners() {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.keys.w = true;
      if (k === 'a' || k === 'arrowleft') this.keys.a = true;
      if (k === 's' || k === 'arrowdown') this.keys.s = true;
      if (k === 'd' || k === 'arrowright') this.keys.d = true;
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.keys.w = false;
      if (k === 'a' || k === 'arrowleft') this.keys.a = false;
      if (k === 's' || k === 'arrowdown') this.keys.s = false;
      if (k === 'd' || k === 'arrowright') this.keys.d = false;
    });

    // Disable default browser context menu on canvas for smooth right-click panorama dragging
    this.container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Mouse Pointer Events (Left Click Orbit, Right Click Pan, Scroll Zoom)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.container.addEventListener('pointerdown', (e) => {
      if (e.target !== this.renderer.domElement) return;

      this.isMouseDown = true;
      this.mouseButton = e.button; // 0 = left, 2 = right
      this.mouseStartX = e.clientX;
      this.mouseStartY = e.clientY;
      this.mouseLastX = e.clientX;
      this.mouseLastY = e.clientY;
      this.hasDragged = false;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isMouseDown) return;

      const deltaX = e.clientX - this.mouseLastX;
      const deltaY = e.clientY - this.mouseLastY;
      const totalDrag = Math.hypot(e.clientX - this.mouseStartX, e.clientY - this.mouseStartY);

      if (totalDrag > this.dragThreshold) {
        this.hasDragged = true;
      }

      if (this.mouseButton === 0) {
        // KLIK KIRI: PUTAR ROTASI KAMERA (ORBIT)
        this.cameraTheta -= deltaX * 0.0055;
        this.cameraPhi += deltaY * 0.0055;
        this.cameraPhi = Math.max(this.minPhi, Math.min(this.maxPhi, this.cameraPhi));
      } else if (this.mouseButton === 2) {
        // KLIK KANAN: GESER PANORAMA (PANNING)
        const panSpeed = (this.cameraDistance / 24.0) * 0.025;
        
        // Compute camera right vector projected on ground
        const rightVec = new THREE.Vector3(Math.cos(this.cameraTheta), 0, -Math.sin(this.cameraTheta));
        const forwardVec = new THREE.Vector3(-Math.sin(this.cameraTheta), 0, -Math.cos(this.cameraTheta));

        this.panOffset.addScaledVector(rightVec, -deltaX * panSpeed);
        this.panOffset.addScaledVector(forwardVec, -deltaY * panSpeed);

        // Clamp pan distance so it doesn't wander off the office
        this.panOffset.x = Math.max(-28, Math.min(28, this.panOffset.x));
        this.panOffset.z = Math.max(-28, Math.min(28, this.panOffset.z));
      }

      this.mouseLastX = e.clientX;
      this.mouseLastY = e.clientY;
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.isMouseDown) return;

      // If user performed a single LEFT click without dragging -> CLICK TO MOVE
      if (this.mouseButton === 0 && !this.hasDragged && e.target === this.renderer.domElement) {
        const rect = this.container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        // Click on Frontliner Maya to start intelligent n8n consultation
        if (this.frontlinerMaya && this.frontlinerMaya.group) {
          const mayaIntersects = raycaster.intersectObject(this.frontlinerMaya.group, true);
          if (mayaIntersects.length > 0) {
            if (window.openFrontlinerChat) {
              window.openFrontlinerChat();
              return;
            }
          }
        }

        const intersects = raycaster.intersectObject(this.floor);
        if (intersects.length > 0) {
          this.targetMovePoint = intersects[0].point;
        }
      }

      this.isMouseDown = false;
      this.hasDragged = false;
    });

    // SCROLL MOUSE: ZOOM IN / ZOOM OUT
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.022;
      this.cameraDistance += e.deltaY * zoomSpeed;
      this.cameraDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.cameraDistance));
    }, { passive: false });

    // Window resize
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  setJoystickVector(x, y) {
    this.joystickVector.x = x;
    this.joystickVector.y = y;
    if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
      this.targetMovePoint = null;
    }
  }

  teleportTo(zoneId) {
    const zone = this.zoneDefinitions.find(z => z.id === zoneId);
    if (zone && this.player) {
      this.player.position.set(zone.position.x, 0, zone.position.z + 1.8);
      this.velocity.set(0, 0, 0);
      this.targetMovePoint = null;
      this.panOffset.set(0, 0, 0); // Reset pan focus on teleport
    }
  }

  updatePlayerPhysics(delta) {
    // 1. Compute movement relative to current camera angle (intuitive controls!)
    let rawMoveX = 0;
    let rawMoveZ = 0;

    if (this.keys.w) rawMoveZ -= 1;
    if (this.keys.s) rawMoveZ += 1;
    if (this.keys.a) rawMoveX -= 1;
    if (this.keys.d) rawMoveX += 1;

    if (Math.abs(this.joystickVector.x) > 0.1 || Math.abs(this.joystickVector.y) > 0.1) {
      rawMoveX = this.joystickVector.x;
      rawMoveZ = this.joystickVector.y;
    }

    if (rawMoveX !== 0 || rawMoveZ !== 0) {
      this.targetMovePoint = null;
      // Project input relative to camera's horizontal azimuth
      const sinTheta = Math.sin(this.cameraTheta);
      const cosTheta = Math.cos(this.cameraTheta);

      const worldDirX = rawMoveX * cosTheta + rawMoveZ * sinTheta;
      const worldDirZ = -rawMoveX * sinTheta + rawMoveZ * cosTheta;

      const len = Math.sqrt(worldDirX * worldDirX + worldDirZ * worldDirZ);
      const dirX = worldDirX / len;
      const dirZ = worldDirZ / len;

      this.velocity.x += dirX * this.acceleration * delta;
      this.velocity.z += dirZ * this.acceleration * delta;

      // Pan offset smoothly recenters towards avatar when walking
      this.panOffset.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    } else if (this.targetMovePoint) {
      const dx = this.targetMovePoint.x - this.player.position.x;
      const dz = this.targetMovePoint.z - this.player.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.3) {
        const arrivalMultiplier = Math.min(1.0, dist / 2.0);
        const dirX = dx / dist;
        const dirZ = dz / dist;
        this.velocity.x += dirX * this.acceleration * arrivalMultiplier * delta;
        this.velocity.z += dirZ * this.acceleration * arrivalMultiplier * delta;
        this.panOffset.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      } else {
        this.targetMovePoint = null;
      }
    }

    // 2. Exponential friction / damping
    const frictionFactor = Math.exp(-this.friction * delta);
    this.velocity.x *= frictionFactor;
    this.velocity.z *= frictionFactor;

    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.z = (this.velocity.z / speed) * this.maxSpeed;
    }

    if (speed < 0.05) {
      this.velocity.set(0, 0, 0);
    }

    // 3. Position update
    this.player.position.x += this.velocity.x * delta;
    this.player.position.z += this.velocity.z * delta;

    this.player.position.x = Math.max(-28, Math.min(28, this.player.position.x));
    this.player.position.z = Math.max(-28, Math.min(28, this.player.position.z));

    // 4. Smooth Rotation
    if (speed > 0.2) {
      this.targetRotation = Math.atan2(this.velocity.x, this.velocity.z);
      
      let diff = this.targetRotation - this.currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      const rotStep = 1.0 - Math.exp(-this.angularSpeed * delta);
      this.currentRotation += diff * rotStep;
      this.player.rotation.y = this.currentRotation;

      // Authentic Roblox Walking Stride (100% Grounded, Zero Flying/Floating)
      this.player.position.y = 0;
      this.walkCycle += speed * delta * 7.6;

      const stride = Math.sin(this.walkCycle) * 0.78;

      // Footstep audio trigger synchronized with walking stride
      if (stride > 0.65 && !this.stepped) {
        this.stepped = true;
        if (this.onFootstep) this.onFootstep();
      } else if (stride < -0.65 && this.stepped) {
        this.stepped = false;
        if (this.onFootstep) this.onFootstep();
      }

      // Legs swing back & forth from hips
      if (this.leftLeg && this.rightLeg) {
        this.leftLeg.rotation.x = stride;
        this.rightLeg.rotation.x = -stride;
      }

      // Arms swing in counter-phase with classic Roblox outward angle
      if (this.leftArm && this.rightArm) {
        this.leftArm.rotation.x = -stride * 0.85;
        this.rightArm.rotation.x = stride * 0.85;
        this.leftArm.rotation.z = 0.12;
        this.rightArm.rotation.z = -0.12;
      }

      // Torso slight rhythmic counter-turn
      if (this.torsoMesh) {
        this.torsoMesh.rotation.y = Math.sin(this.walkCycle) * 0.04;
      }

      const forwardTilt = (speed / this.maxSpeed) * 0.06;
      const bankTilt = -diff * 0.18;
      this.playerMeshContainer.rotation.x = forwardTilt;
      this.playerMeshContainer.rotation.z = THREE.MathUtils.lerp(this.playerMeshContainer.rotation.z, bankTilt, 0.18);

      if (this.playerShadow) {
        this.playerShadow.scale.setScalar(1.0);
      }
    } else {
      // Idle Standing Pose: 100% grounded on floor
      this.player.position.y = 0;
      this.playerMeshContainer.rotation.x = THREE.MathUtils.lerp(this.playerMeshContainer.rotation.x, 0, 0.22);
      this.playerMeshContainer.rotation.z = THREE.MathUtils.lerp(this.playerMeshContainer.rotation.z, 0, 0.22);

      if (this.leftLeg && this.rightLeg) {
        this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 0.22);
        this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 0.22);
      }
      if (this.leftArm && this.rightArm) {
        this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, 0.22);
        this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, 0.22);
        this.leftArm.rotation.z = 0.10;
        this.rightArm.rotation.z = -0.10;
      }

      const elapsedTime = this.clock.getElapsedTime();
      if (this.torsoMesh) {
        this.torsoMesh.rotation.y = THREE.MathUtils.lerp(this.torsoMesh.rotation.y, 0, 0.2);
        // Subtle Roblox idle breathing
        this.torsoMesh.position.y = 0.84 + Math.sin(elapsedTime * 2.2) * 0.006;
      }
      if (this.headGroup) {
        this.headGroup.position.y = 1.14 + Math.sin(elapsedTime * 2.2) * 0.006;
        this.headGroup.rotation.y = Math.sin(elapsedTime * 0.7) * 0.04;
      }
      if (this.playerShadow) {
        this.playerShadow.scale.setScalar(1.0);
      }
    }

    // 5. Orbit, Pan & Zoom Camera Positioning (Spherical coordinates with pan target)
    const focalPointX = this.player.position.x + this.panOffset.x;
    const focalPointY = 1.3 + this.panOffset.y;
    const focalPointZ = this.player.position.z + this.panOffset.z;

    const relCamX = this.cameraDistance * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    const relCamY = this.cameraDistance * Math.cos(this.cameraPhi);
    const relCamZ = this.cameraDistance * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);

    const targetCamPos = new THREE.Vector3(
      focalPointX + relCamX,
      focalPointY + relCamY,
      focalPointZ + relCamZ
    );

    const camLerp = 1.0 - Math.exp(-8.0 * delta);
    this.camera.position.lerp(targetCamPos, camLerp);
    this.camera.lookAt(focalPointX, focalPointY, focalPointZ);

    // 6. Check Proximity to Laptop Store Zones
    this.checkZoneProximity();
  }

  checkZoneProximity() {
    let closestZone = null;
    let minDistance = Infinity;

    this.zoneDefinitions.forEach(zone => {
      const dx = this.player.position.x - zone.position.x;
      const dz = this.player.position.z - zone.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < zone.radius) {
        if (dist < minDistance) {
          minDistance = dist;
          closestZone = zone;
        }
      }
    });

    if (closestZone !== this.currentZone) {
      if (this.currentZone && (!closestZone || closestZone.id !== this.currentZone.id)) {
        this.onZoneLeave(this.currentZone);
      }
      this.currentZone = closestZone;
      if (this.currentZone) {
        this.onZoneEnter(this.currentZone);
      }
    }

    this.onMinimapUpdate({
      player: { x: this.player.position.x, z: this.player.position.z },
      zones: this.zoneDefinitions,
      currentZone: this.currentZone
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    this.floatingItems.forEach(item => {
      if (item.mesh) {
        item.mesh.rotation.y += item.rotSpeed * delta;
        item.mesh.position.y = item.basePos + Math.sin(elapsedTime * 2.2 + item.basePos) * 0.08;
      }
    });

    this.updatePlayerPhysics(delta);
    this.updateNPCVisitors(delta);

    this.renderer.render(this.scene, this.camera);
  }

  // ==========================================================================
  // Tahap 5: Autonomous NPC Live Visitors (including Frontliner Maya AI)
  // ==========================================================================
  createNPCModel(config) {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: config.skinColor || 0xfed19e, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: config.hairColor || 0x241812, roughness: 0.8 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: config.jacketColor || 0x1e293b, roughness: 0.4 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: config.pantsColor || 0x334155, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const accentMat = new THREE.MeshBasicMaterial({ color: config.accentColor || 0x00f2fe });

    const meshContainer = new THREE.Group();
    group.add(meshContainer);

    // Torso Block
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.54, 0.25), jacketMat);
    torso.position.set(0, 0.82, 0);
    torso.castShadow = true;
    meshContainer.add(torso);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.12, 0);
    meshContainer.add(headGroup);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), skinMat);
    head.position.set(0, 0.18, 0);
    head.castShadow = true;
    headGroup.add(head);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.01), blackMat);
    leftEye.position.set(-0.08, 0.18, 0.181);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.01), blackMat);
    rightEye.position.set(0.08, 0.18, 0.181);
    headGroup.add(rightEye);

    // Hair
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.38), hairMat);
    hair.position.set(0, 0.32, 0);
    headGroup.add(hair);

    // Headset
    if (config.hasHeadset) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.04, 0.08), blackMat);
      band.position.set(0, 0.38, 0);
      headGroup.add(band);
      const earcup = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.13, 0.11), accentMat);
      earcup.position.set(-0.20, 0.18, 0);
      headGroup.add(earcup);
      const earcupR = earcup.clone();
      earcupR.position.x = 0.20;
      headGroup.add(earcupR);

      // Microphone boom for Frontliner headset
      if (config.isFrontliner) {
        const micArm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.14), blackMat);
        micArm.position.set(-0.16, 0.12, 0.12);
        micArm.rotation.y = -0.3;
        headGroup.add(micArm);

        const micTip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), accentMat);
        micTip.position.set(-0.12, 0.12, 0.19);
        headGroup.add(micTip);
      }
    }

    // Frontliner Uniform details on torso
    if (config.isFrontliner) {
      // Inner crisp white shirt
      const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.02), whiteMat);
      shirt.position.set(0, 0.12, 0.126);
      torso.add(shirt);

      // Cyan Frontliner Lanyard ribbon
      const lanyard = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.02), accentMat);
      lanyard.position.set(0, 0.04, 0.128);
      torso.add(lanyard);

      // Frontliner ID card
      const idCard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.02), whiteMat);
      idCard.position.set(0, -0.09, 0.13);
      torso.add(idCard);

      // Polite smile
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0xc0504d });
      const smile = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.01), mouthMat);
      smile.position.set(0, 0.09, 0.181);
      headGroup.add(smile);
    }

    // Left Arm
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.35, 1.05, 0);
    leftArm.rotation.z = 0.10;
    meshContainer.add(leftArm);
    const lSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.36, 0.20), jacketMat);
    lSleeve.position.set(0, -0.18, 0);
    lSleeve.castShadow = true;
    leftArm.add(lSleeve);
    const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.18), skinMat);
    lHand.position.set(0, -0.42, 0);
    leftArm.add(lHand);

    // Right Arm
    const rightArm = new THREE.Group();
    rightArm.position.set(0.35, 1.05, 0);
    rightArm.rotation.z = -0.10;
    meshContainer.add(rightArm);
    const rSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.36, 0.20), jacketMat);
    rSleeve.position.set(0, -0.18, 0);
    rSleeve.castShadow = true;
    rightArm.add(rSleeve);
    const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.18), skinMat);
    rHand.position.set(0, -0.42, 0);
    rightArm.add(rHand);

    // Left Leg
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.13, 0.54, 0);
    meshContainer.add(leftLeg);
    const lPants = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.22), pantsMat);
    lPants.position.set(0, -0.21, 0);
    lPants.castShadow = true;
    leftLeg.add(lPants);
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.11, 0.24), whiteMat);
    lShoe.position.set(0, -0.48, 0.005);
    leftLeg.add(lShoe);

    // Right Leg
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.13, 0.54, 0);
    meshContainer.add(rightLeg);
    const rPants = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.22), pantsMat);
    rPants.position.set(0, -0.21, 0);
    rPants.castShadow = true;
    rightLeg.add(rPants);
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.11, 0.24), whiteMat);
    rShoe.position.set(0, -0.48, 0.005);
    rightLeg.add(rShoe);

    // 3D Canvas Billboard Sprite for Overhead Nameplate
    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 256;
    nameCanvas.height = 64;
    const ctx = nameCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(7, 9, 14, 0.88)';
      if (ctx.roundRect) {
        ctx.roundRect(8, 8, 240, 48, 24);
      } else {
        ctx.rect(8, 8, 240, 48);
      }
      ctx.fill();
      ctx.strokeStyle = config.badgeColor || '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Green pulse dot in billboard
      ctx.beginPath();
      ctx.arc(30, 32, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      // Name text
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(config.name, 46, config.isFrontliner ? 28 : 38);

      if (config.isFrontliner) {
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#00f2fe';
        ctx.fillText('Konsultan n8n Online 🟢', 46, 46);
      }

      const nameTex = new THREE.CanvasTexture(nameCanvas);
      nameTex.minFilter = THREE.LinearFilter;
      nameTex.wrapS = THREE.ClampToEdgeWrapping;
      nameTex.wrapT = THREE.ClampToEdgeWrapping;
      const spriteMat = new THREE.SpriteMaterial({ map: nameTex, transparent: true });
      const nameSprite = new THREE.Sprite(spriteMat);
      nameSprite.position.set(0, 1.95, 0);
      nameSprite.scale.set(1.6, 0.40, 1);
      group.add(nameSprite);
    }

    return {
      group,
      meshContainer,
      torso,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      headGroup
    };
  }

  buildNPCVisitors() {
    this.npcVisitors = [];
    const npcConfigs = [
      // 1. MAYA — Official Walking Frontliner Officer (n8n AI Consultant)
      {
        id: 'maya',
        isFrontliner: true,
        name: 'Maya • Frontliner AI',
        role: 'Tech Consultant',
        badgeColor: '#00f2fe',
        jacketColor: 0x0f172a, // Official navy blazer
        pantsColor: 0x1e293b,
        hairColor: 0x3d2314, // Neat bob hair
        accentColor: 0x00f2fe,
        hasHeadset: true,
        startPos: { x: 2.2, z: 9.5 },
        speed: 2.8,
        waypoints: [
          { x: 2.2, z: 9.5 },    // Lobby Reception
          { x: -5.0, z: 6.0 },   // Walking to Laptop Display
          { x: -11.0, z: -1.0 }, // ROG Titan X & ZenAir showcase
          { x: -7.0, z: -8.0 },  // Center walkway
          { x: 0.0, z: -10.5 },  // Accessories Lounge
          { x: 8.5, z: -4.0 },   // Benchmark Studio
          { x: 9.5, z: 7.0 },    // Flash Sale Vault
          { x: 1.0, z: 11.0 }    // Returning to Lobby Counter
        ]
      },
      // 2. Budi (Gamer Visitor)
      {
        name: 'Budi (Gamer)',
        role: 'ROG Enthusiast',
        badgeColor: '#ff0055',
        jacketColor: 0x991b1b,
        hairColor: 0x241812,
        accentColor: 0xff0055,
        hasHeadset: true,
        startPos: { x: -10, z: -2 },
        speed: 2.5,
        waypoints: [
          { x: -10, z: -2 },
          { x: -7, z: 2 },
          { x: -12, z: 4 },
          { x: -8, z: -3 }
        ]
      },
      // 3. Clarissa (Studio Creator Visitor)
      {
        name: 'Clarissa (Creator)',
        role: 'Studio Pro',
        badgeColor: '#a855f7',
        jacketColor: 0x1e3a8a,
        hairColor: 0x5c3a21,
        accentColor: 0x00f2fe,
        hasHeadset: false,
        startPos: { x: 10, z: -4 },
        speed: 2.4,
        waypoints: [
          { x: 10, z: -4 },
          { x: 13, z: 0 },
          { x: 9, z: 3 },
          { x: 12, z: -2 }
        ]
      },
      // 4. Dimas Aditya (Student / Value Visitor)
      {
        name: 'Dimas Aditya',
        role: 'Visitor',
        badgeColor: '#00f59b',
        jacketColor: 0x334155,
        hairColor: 0xd4c2a5,
        accentColor: 0x00f59b,
        hasHeadset: false,
        startPos: { x: 0, z: 8 },
        speed: 2.6,
        waypoints: [
          { x: 0, z: 8 },
          { x: -4, z: 10 },
          { x: 4, z: 9 },
          { x: 0, z: 12 }
        ]
      }
    ];

    npcConfigs.forEach(cfg => {
      const npcModel = this.createNPCModel(cfg);
      npcModel.group.position.set(cfg.startPos.x, 0, cfg.startPos.z);
      this.scene.add(npcModel.group);

      const record = {
        ...npcModel,
        config: cfg,
        waypoints: cfg.waypoints,
        currentWpIdx: 0,
        waitTime: 2.0 + Math.random() * 3.0,
        isWaiting: true,
        isInteracting: false,
        walkCycle: Math.random() * Math.PI,
        speed: cfg.speed || 2.6
      };

      this.npcVisitors.push(record);

      // Save Frontliner Maya reference for direct interaction
      if (cfg.isFrontliner) {
        this.frontlinerMaya = record;
      }
    });
  }

  updateNPCVisitors(delta) {
    if (!this.npcVisitors) return;

    this.npcVisitors.forEach(npc => {
      // Special Frontliner Interaction: when player approaches Maya
      if (npc.config && npc.config.isFrontliner && this.player) {
        const dxP = this.player.position.x - npc.group.position.x;
        const dzP = this.player.position.z - npc.group.position.z;
        const distP = Math.sqrt(dxP * dxP + dzP * dzP);

        if (distP < 4.2) {
          // Maya detects player: stops walking, turns to face player, and waves!
          npc.isInteracting = true;
          const targetAngle = Math.atan2(dxP, dzP);
          let diff = targetAngle - npc.group.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          npc.group.rotation.y += diff * Math.min(delta * 6.0, 1.0);

          // Animated friendly greeting wave with right arm
          const elapsed = this.clock.getElapsedTime();
          npc.rightArm.rotation.x = -1.2 + Math.sin(elapsed * 6.5) * 0.35;
          npc.rightArm.rotation.z = -0.35;
          npc.leftArm.rotation.x = THREE.MathUtils.lerp(npc.leftArm.rotation.x, 0, 0.2);
          npc.leftLeg.rotation.x = THREE.MathUtils.lerp(npc.leftLeg.rotation.x, 0, 0.2);
          npc.rightLeg.rotation.x = THREE.MathUtils.lerp(npc.rightLeg.rotation.x, 0, 0.2);
          npc.headGroup.rotation.y = Math.sin(elapsed * 1.5) * 0.08;
          return;
        } else {
          if (npc.isInteracting) {
            npc.isInteracting = false;
            npc.rightArm.rotation.z = -0.10;
          }
        }
      }

      const targetWp = npc.waypoints[npc.currentWpIdx];

      if (npc.isWaiting) {
        npc.waitTime -= delta;
        // Idle limb return
        npc.leftLeg.rotation.x = THREE.MathUtils.lerp(npc.leftLeg.rotation.x, 0, 0.1);
        npc.rightLeg.rotation.x = THREE.MathUtils.lerp(npc.rightLeg.rotation.x, 0, 0.1);
        npc.leftArm.rotation.x = THREE.MathUtils.lerp(npc.leftArm.rotation.x, 0, 0.1);
        npc.rightArm.rotation.x = THREE.MathUtils.lerp(npc.rightArm.rotation.x, 0, 0.1);
        npc.headGroup.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.2 + npc.currentWpIdx) * 0.15;

        if (npc.waitTime <= 0) {
          npc.isWaiting = false;
          npc.currentWpIdx = (npc.currentWpIdx + 1) % npc.waypoints.length;
        }
        return;
      }

      // Move toward waypoint
      const dx = targetWp.x - npc.group.position.x;
      const dz = targetWp.z - npc.group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.45) {
        npc.isWaiting = true;
        npc.waitTime = 3.5 + Math.random() * 4.0;
        return;
      }

      // Rotate toward target
      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - npc.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      npc.group.rotation.y += diff * Math.min(delta * 5.0, 1.0);

      // Move forward
      const moveDist = Math.min(npc.speed * delta, dist);
      npc.group.position.x += Math.sin(npc.group.rotation.y) * moveDist;
      npc.group.position.z += Math.cos(npc.group.rotation.y) * moveDist;

      // Animate walking limbs
      npc.walkCycle += delta * npc.speed * 4.2;
      const stride = Math.sin(npc.walkCycle) * 0.65;
      npc.leftLeg.rotation.x = stride;
      npc.rightLeg.rotation.x = -stride;
      npc.leftArm.rotation.x = -stride * 0.7;
      npc.rightArm.rotation.x = stride * 0.7;
    });
  }
}
