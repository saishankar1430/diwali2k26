import * as THREE from 'three';

export function createCobblestoneStreetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm terracotta slate base
  ctx.fillStyle = '#2c2226';
  ctx.fillRect(0, 0, 512, 512);

  // Cobblestone grid with rounded stone pavers
  const cols = 8;
  const rows = 16;
  const w = 512 / cols;
  const h = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const xOffset = (r % 2) * (w / 2);
    for (let c = -1; c <= cols; c++) {
      const x = c * w + xOffset;
      const y = r * h;

      // Stone shade variation
      const hueVariations = ['#453539', '#3e2e34', '#4d3b41', '#37282d', '#533f46'];
      ctx.fillStyle = hueVariations[(r * 7 + c * 3 + 13) % hueVariations.length];

      // Draw rounded rectangle paver
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 6);
      ctx.fill();

      // Stone surface noise
      ctx.fillStyle = 'rgba(255, 230, 200, 0.04)';
      ctx.fillRect(x + 5, y + 5, w - 10, (h - 10) / 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 16);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTraditionalDoorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep carved Indian Sheesham / Teak wood
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, '#381a11');
  grad.addColorStop(0.5, '#4d261a');
  grad.addColorStop(1, '#2c140d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Door frame border
  ctx.strokeStyle = '#c68a4c';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 496);

  // Center seam dividing double doors
  ctx.strokeStyle = '#1b0c08';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(128, 8);
  ctx.lineTo(128, 504);
  ctx.stroke();

  // Carved rectangular panels with floral accents
  const panelCols = 2;
  const panelRows = 4;
  for (let r = 0; r < panelRows; r++) {
    for (let c = 0; c < panelCols; c++) {
      const px = c === 0 ? 18 : 138;
      const py = 24 + r * 118;
      const pw = 100;
      const ph = 100;

      // Recessed panel
      ctx.fillStyle = '#26120b';
      ctx.fillRect(px, py, pw, ph);

      // Gold carved trim
      ctx.strokeStyle = '#d49b55';
      ctx.lineWidth = 3;
      ctx.strokeRect(px + 4, py + 4, pw - 8, ph - 8);

      // Brass central stud (boss)
      const cx = px + pw / 2;
      const cy = py + ph / 2;
      const brass = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
      brass.addColorStop(0, '#fff4cc');
      brass.addColorStop(0.5, '#d99b26');
      brass.addColorStop(1, '#664205');
      ctx.fillStyle = brass;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      // Corner decorative brass rivets
      const rivetCoords = [
        [px + 10, py + 10],
        [px + pw - 10, py + 10],
        [px + 10, py + ph - 10],
        [px + pw - 10, py + ph - 10],
      ];
      rivetCoords.forEach(([rx, ry]) => {
        ctx.fillStyle = '#f5c542';
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Brass Ring Door Knockers
  [85, 171].forEach((kx) => {
    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(kx, 260, 16, 0, Math.PI * 2);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createJaaliWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Golden glowing warm interior light base
  const glow = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  glow.addColorStop(0, '#fffae0');
  glow.addColorStop(0.4, '#ffb834');
  glow.addColorStop(1, '#ff7b00');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 256, 256);

  // Geometric Indian jharokha lattice screen
  ctx.fillStyle = '#2b1a10';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#2b1a10';

  const gridSize = 24;
  for (let x = 0; x <= 256; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  // Diamond octagonal lattice cutouts
  for (let x = gridSize / 2; x < 256; x += gridSize) {
    for (let y = gridSize / 2; y < 256; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Outer ornate carved arch border
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#382015';
  ctx.strokeRect(6, 6, 244, 244);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRangoliTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 1024);

  const cx = 512;
  const cy = 512;

  // 1. Deep Royal Purple / Indigo Outer Base Ring
  const outerGrad = ctx.createRadialGradient(cx, cy, 380, cx, cy, 490);
  outerGrad.addColorStop(0, '#4a154b');
  outerGrad.addColorStop(0.7, '#6a1b9a');
  outerGrad.addColorStop(1, '#2c0838');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 490, 0, Math.PI * 2);
  ctx.fill();

  // 2. White Kolam / Rice Flour Pearl Border (72 pearls)
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const x = cx + Math.cos(angle) * 475;
    const y = cy + Math.sin(angle) * 475;
    ctx.beginPath();
    ctx.arc(x, y, 7.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Ornate Scalloped Border Arches
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 4;
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const nextAngle = ((i + 1) / 36) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;
    const x1 = cx + Math.cos(angle) * 455;
    const y1 = cy + Math.sin(angle) * 455;
    const x2 = cx + Math.cos(nextAngle) * 455;
    const y2 = cy + Math.sin(nextAngle) * 455;
    const mx = cx + Math.cos(midAngle) * 478;
    const my = cy + Math.sin(midAngle) * 478;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.stroke();
  }

  // 4. Vibrant Saffron Marigold Ring
  const marigoldGrad = ctx.createRadialGradient(cx, cy, 360, cx, cy, 450);
  marigoldGrad.addColorStop(0, '#f57f17');
  marigoldGrad.addColorStop(0.5, '#fbc02d');
  marigoldGrad.addColorStop(1, '#ff6f00');
  ctx.fillStyle = marigoldGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 450, 0, Math.PI * 2);
  ctx.fill();

  // 5. 24 Radiant Outer Petals
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Deep Ruby Red & Coral Petal
    const petalGrad = ctx.createLinearGradient(0, 320, 0, 445);
    petalGrad.addColorStop(0, '#b71c1c');
    petalGrad.addColorStop(0.5, '#d32f2f');
    petalGrad.addColorStop(1, '#ff5252');
    ctx.fillStyle = petalGrad;

    ctx.beginPath();
    ctx.moveTo(0, 330);
    ctx.bezierCurveTo(45, 370, 35, 435, 0, 445);
    ctx.bezierCurveTo(-35, 435, -45, 370, 0, 330);
    ctx.fill();

    ctx.strokeStyle = '#fff9c4';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Central golden vein
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 335);
    ctx.lineTo(0, 435);
    ctx.stroke();

    ctx.restore();
  }

  // 6. Turquoise & Emerald Green Circular Band
  const greenGrad = ctx.createRadialGradient(cx, cy, 260, cx, cy, 330);
  greenGrad.addColorStop(0, '#00695c');
  greenGrad.addColorStop(0.5, '#00897b');
  greenGrad.addColorStop(1, '#26a69a');
  ctx.fillStyle = greenGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 330, 0, Math.PI * 2);
  ctx.fill();

  // 7. 16 Traditional Paisley (Kalka / Mango) Motifs
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = '#ffb300';
    ctx.beginPath();
    ctx.arc(0, 290, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 290, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 8. Crimson Vermilion Lotus Platform
  ctx.fillStyle = '#c2185b';
  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.fill();

  // 9. 12 Pink & Crimson Sacred Lotus Petals
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const lotusGrad = ctx.createLinearGradient(0, 120, 0, 255);
    lotusGrad.addColorStop(0, '#f8bbd0');
    lotusGrad.addColorStop(0.4, '#e91e63');
    lotusGrad.addColorStop(1, '#880e4f');
    ctx.fillStyle = lotusGrad;

    ctx.beginPath();
    ctx.moveTo(0, 110);
    ctx.quadraticCurveTo(55, 185, 0, 255);
    ctx.quadraticCurveTo(-55, 185, 0, 110);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Golden inner stamen accents
    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.arc(0, 220, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 10. Sacred 8-Pointed Star (Ashta-Lakshmi Yantra)
  ctx.fillStyle = '#ff8f00';
  ctx.beginPath();
  for (let s = 0; s < 8; s++) {
    const a1 = (s / 8) * Math.PI * 2;
    const a2 = ((s + 0.5) / 8) * Math.PI * 2;
    const r1 = 135;
    const r2 = 80;
    if (s === 0) ctx.moveTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
    else ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
    ctx.lineTo(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 11. Golden Glowing Center Disc
  const centerGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75);
  centerGlow.addColorStop(0, '#ffffff');
  centerGlow.addColorStop(0.3, '#fff59d');
  centerGlow.addColorStop(0.7, '#ffca28');
  centerGlow.addColorStop(1, '#ff6f00');
  ctx.fillStyle = centerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 75, 0, Math.PI * 2);
  ctx.fill();

  // 12. Central Traditional Auspicious Diya (Terracotta Lamp with Flame)
  ctx.fillStyle = '#b73812';
  ctx.beginPath();
  ctx.arc(cx, cy + 8, 42, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#ffe082';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Vibrant Multi-layered Golden Diya Flame
  ctx.fillStyle = '#ff3d00';
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy + 8);
  ctx.quadraticCurveTo(cx - 32, cy - 40, cx, cy - 65);
  ctx.quadraticCurveTo(cx + 32, cy - 40, cx + 24, cy + 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffea00';
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + 8);
  ctx.quadraticCurveTo(cx - 20, cy - 30, cx, cy - 52);
  ctx.quadraticCurveTo(cx + 20, cy - 30, cx + 15, cy + 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + 8);
  ctx.quadraticCurveTo(cx - 10, cy - 18, cx, cy - 35);
  ctx.quadraticCurveTo(cx + 10, cy - 18, cx + 8, cy + 8);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStarKandilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm saffron / golden paper body
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#ff9900');
  grad.addColorStop(0.5, '#ffdd33');
  grad.addColorStop(1, '#ff5500');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Perforated traditional geometric star cutouts
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cc3300';
  ctx.lineWidth = 4;

  const cx = 128;
  const cy = 128;

  // Star geometry
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a1 = (i / 8) * Math.PI * 2;
    const a2 = ((i + 0.5) / 8) * Math.PI * 2;
    const r1 = 90;
    const r2 = 40;
    if (i === 0) ctx.moveTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
    else ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
    ctx.lineTo(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Decorative border
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 236, 236);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCitySkylineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0a0515';
  ctx.fillRect(0, 0, 1024, 256);

  // Silhouette skyscrapers
  const numBuildings = 45;
  for (let i = 0; i < numBuildings; i++) {
    const bw = 16 + (i * 17) % 30;
    const bh = 50 + ((i * 37) % 150);
    const bx = i * 23;
    const by = 256 - bh;

    ctx.fillStyle = '#120b22';
    ctx.fillRect(bx, by, bw, bh);

    // Glowing window dots
    const windowCols = Math.floor(bw / 6);
    const windowRows = Math.floor(bh / 8);
    for (let wr = 0; wr < windowRows; wr++) {
      for (let wc = 0; wc < windowCols; wc++) {
        if (((i + wr * 3 + wc * 7) % 5) < 3) {
          const wx = bx + 3 + wc * 6;
          const wy = by + 6 + wr * 8;
          ctx.fillStyle = ((i + wr) % 3 === 0) ? '#ffea9f' : '#88ccee';
          ctx.fillRect(wx, wy, 3, 4);
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWelcomeBannerTexture(title: string, names: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Deep royal maroon / crimson banner with gold trim
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#660b1e');
  grad.addColorStop(0.5, '#8c142b');
  grad.addColorStop(1, '#660b1e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 160);

  // Gold ornate frame
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 144);

  ctx.strokeStyle = '#ffae00';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 480, 128);

  // Decorative Diyas on left and right
  const drawDiya = (x: number, y: number) => {
    ctx.fillStyle = '#f57c00';
    ctx.beginPath();
    ctx.arc(x, y + 10, 18, 0, Math.PI);
    ctx.fill();
    // Flame
    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 8);
    ctx.quadraticCurveTo(x, y - 18, x, y - 22);
    ctx.quadraticCurveTo(x, y - 18, x + 8, y + 8);
    ctx.fill();
  };
  drawDiya(50, 70);
  drawDiya(462, 70);

  // Text
  ctx.fillStyle = '#fff4cc';
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 55);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 26px "Outfit", sans-serif';
  ctx.fillText(names, 256, 105);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
