export type SceneIndex = 0 | 1 | 2;

const W = 512;
const H = 1024;

function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawScene(canvas: HTMLCanvasElement, scene: SceneIndex) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  if (scene === 0) drawMapScene(ctx);
  else if (scene === 1) drawBookingScene(ctx);
  else drawConfirmScene(ctx);
}

function drawMapScene(ctx: CanvasRenderingContext2D) {
  // Background
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, W, H);

  // Map tile
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 50, W, 650);

  // Grid
  ctx.strokeStyle = "#ffffff07";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 52) {
    ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x, 700); ctx.stroke();
  }
  for (let y = 50; y < 700; y += 52) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Roads
  const roads: [number,number,number,number,number][] = [
    [60, 120, 420, 200, 14],
    [30, 320, 480, 300, 12],
    [220, 60, 260, 680, 12],
    [360, 140, 390, 680, 10],
  ];
  ctx.strokeStyle = "#1c1c1c";
  ctx.lineCap = "round";
  roads.forEach(([x1,y1,x2,y2,w]) => {
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // User location
  const [ux, uy] = [256, 385];
  ctx.fillStyle = "#3b82f620"; ctx.beginPath(); ctx.arc(ux, uy, 40, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#3b82f635"; ctx.beginPath(); ctx.arc(ux, uy, 24, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(ux, uy, 11, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.stroke();

  // Barber pins
  const pins: [number, number, boolean][] = [[148,208,true],[348,270,false],[175,520,false]];
  pins.forEach(([px, py, hot]) => {
    // shadow
    ctx.fillStyle = "#f59e0b18";
    ctx.beginPath(); ctx.ellipse(px, py+32, 16, 6, 0, 0, Math.PI*2); ctx.fill();
    // pin
    ctx.fillStyle = hot ? "#f59e0b" : "#d97706";
    ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI*2); ctx.fill();
    if (hot) {
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI*2); ctx.stroke();
    }
    // tail
    ctx.fillStyle = hot ? "#f59e0b" : "#d97706";
    ctx.beginPath(); ctx.moveTo(px-9, py+18); ctx.lineTo(px+9, py+18); ctx.lineTo(px, py+32); ctx.fill();
    // icon
    ctx.fillStyle = "#fff"; ctx.font = "bold 15px Arial"; ctx.textAlign = "center";
    ctx.fillText("✂", px, py+6);
    // rating bubble on active pin
    if (hot) {
      ctx.fillStyle = "#fff";
      rr(ctx, px-22, py-46, 44, 22, 11); ctx.fill();
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 12px Arial"; ctx.textAlign = "center";
      ctx.fillText("⭐ 4.9", px, py-31);
    }
  });

  // Status bar
  ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, W, 50);
  ctx.fillStyle = "#fff"; ctx.font = "bold 20px Arial"; ctx.textAlign = "left"; ctx.fillText("9:41", 24, 34);
  ctx.fillStyle = "#fff"; ctx.font = "14px Arial"; ctx.textAlign = "right";
  ctx.fillText("●●●●", W-60, 34);
  rr(ctx, W-52, 17, 38, 16, 4); ctx.fillStyle="#fff"; ctx.fill();
  rr(ctx, W-50, 19, 26, 12, 3); ctx.fillStyle="#4ade80"; ctx.fill();

  // Bottom sheet
  ctx.fillStyle = "#111";
  rr(ctx, 0, 688, W, 336, 24); ctx.fill();
  ctx.fillStyle = "#2a2a2a";
  rr(ctx, W/2-30, 706, 60, 5, 3); ctx.fill();

  // Heading
  ctx.fillStyle = "#fff"; ctx.font = "bold 26px Arial"; ctx.textAlign = "left";
  ctx.fillText("Barbers near you", 24, 760);
  rr(ctx, 338, 737, 76, 26, 13); ctx.fillStyle="#f59e0b"; ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "bold 11px Arial"; ctx.textAlign = "center";
  ctx.fillText("LIVE", 376, 754);

  // Barber cards
  const cards = [
    { name: "The Classic Cut", rating: "4.9", dist: "0.3 km", wait: "2 min" },
    { name: "Sharp Edge Studio", rating: "4.8", dist: "0.7 km", wait: "5 min" },
  ];
  cards.forEach((c, i) => {
    const cy = 776 + i * 78;
    rr(ctx, 14, cy, W-28, 66, 14); ctx.fillStyle="#1a1a1a"; ctx.fill();
    rr(ctx, 22, cy+10, 46, 46, 10); ctx.fillStyle="#f59e0b15"; ctx.fill();
    ctx.fillStyle = "#f59e0b"; ctx.font = "22px Arial"; ctx.textAlign = "center"; ctx.fillText("✂", 45, cy+38);
    ctx.fillStyle = "#fff"; ctx.font = "bold 16px Arial"; ctx.textAlign = "left"; ctx.fillText(c.name, 78, cy+26);
    ctx.fillStyle = "#f59e0b"; ctx.font = "13px Arial"; ctx.fillText(`⭐ ${c.rating}`, 78, cy+46);
    ctx.fillStyle = "#71717a"; ctx.fillText(`  ·  ${c.dist}`, 112, cy+46);
    rr(ctx, W-98, cy+20, 80, 26, 13); ctx.fillStyle="#16a34a20"; ctx.fill();
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 12px Arial"; ctx.textAlign = "center";
    ctx.fillText(`⏱ ${c.wait}`, W-58, cy+37);
  });
}

function drawBookingScene(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = "#111"; ctx.fillRect(0, 0, W, 62);
  ctx.fillStyle = "#f59e0b"; ctx.font = "bold 22px Arial"; ctx.textAlign = "center"; ctx.fillText("‹", 32, 42);
  ctx.fillStyle = "#fff"; ctx.font = "bold 20px Arial"; ctx.fillText("The Classic Cut", W/2, 42);

  // Photo strip
  [["#1e293b","#f59e0b"],["#1a1a2e","#d97706"],["#0f172a","#f59e0b"]].forEach(([bg, accent], i) => {
    const px = 14 + i*168;
    rr(ctx, px, 70, 156, 118, 12); ctx.fillStyle = bg; ctx.fill();
    rr(ctx, px, 70, 156, 118, 12); ctx.fillStyle = accent+"20"; ctx.fill();
    ctx.fillStyle = accent; ctx.font = "44px Arial"; ctx.textAlign = "center"; ctx.fillText("✂", px+78, 145);
  });

  // Rating
  ctx.fillStyle = "#fff"; ctx.font = "bold 22px Arial"; ctx.textAlign = "left"; ctx.fillText("⭐ 4.9", 24, 228);
  ctx.fillStyle = "#71717a"; ctx.font = "14px Arial"; ctx.fillText("  (156 reviews)  ·  0.3 km", 92, 228);

  ctx.fillStyle = "#1f1f1f"; ctx.fillRect(0, 240, W, 1);

  // Services
  ctx.fillStyle = "#71717a"; ctx.font = "bold 12px Arial"; ctx.textAlign = "left"; ctx.fillText("SERVICES", 24, 270);
  const svcs = [
    { name:"Fresh Fade", price:"₹299", time:"30 min", sel:true },
    { name:"Beard Trim", price:"₹149", time:"20 min", sel:false },
    { name:"Full Cut + Style", price:"₹449", time:"45 min", sel:false },
    { name:"Kids Cut", price:"₹199", time:"25 min", sel:false },
  ];
  svcs.forEach((s, i) => {
    const sy = 282 + i * 60;
    rr(ctx, 14, sy, W-28, 50, 12);
    ctx.fillStyle = s.sel ? "#f59e0b12" : "#111"; ctx.fill();
    if (s.sel) { ctx.strokeStyle="#f59e0b50"; ctx.lineWidth=1.5; rr(ctx,14,sy,W-28,50,12); ctx.stroke(); }
    ctx.fillStyle = s.sel?"#fff":"#aaa"; ctx.font=`${s.sel?"bold ":""}16px Arial`; ctx.textAlign="left"; ctx.fillText(s.name, 28, sy+22);
    ctx.fillStyle="#71717a"; ctx.font="13px Arial"; ctx.fillText(s.time, 28, sy+40);
    ctx.fillStyle = s.sel?"#f59e0b":"#666"; ctx.font="bold 16px Arial"; ctx.textAlign="right"; ctx.fillText(s.price, W-48, sy+30);
    if (s.sel) { ctx.fillStyle="#f59e0b"; ctx.beginPath(); ctx.arc(W-30,sy+25,9,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.font="bold 12px Arial"; ctx.textAlign="center"; ctx.fillText("✓",W-30,sy+29); }
  });

  // Time slots
  ctx.fillStyle="#71717a"; ctx.font="bold 12px Arial"; ctx.textAlign="left"; ctx.fillText("SELECT TIME — TODAY", 24, 540);
  const times = ["9:00","9:30","10:30","11:00","12:00","14:00"];
  const takenSlots = new Set([1, 3]);
  times.forEach((t, i) => {
    const tx = 14 + (i%3)*166, ty = 552 + Math.floor(i/3)*58;
    const taken = takenSlots.has(i), sel = i===2;
    rr(ctx, tx, ty, 154, 46, 10);
    ctx.fillStyle = sel?"#f59e0b": taken?"#1a1a1a":"#191919"; ctx.fill();
    if (!sel&&!taken) { ctx.strokeStyle="#2a2a2a"; ctx.lineWidth=1; rr(ctx,tx,ty,154,46,10); ctx.stroke(); }
    ctx.fillStyle = sel?"#fff": taken?"#333":"#ccc"; ctx.font=`bold 17px Arial`; ctx.textAlign="center";
    ctx.fillText(t, tx+77, ty+30);
  });

  // Book button
  const grad = ctx.createLinearGradient(14,0,W-14,0);
  grad.addColorStop(0,"#f59e0b"); grad.addColorStop(1,"#d97706");
  ctx.fillStyle = grad;
  rr(ctx, 14, 684, W-28, 66, 33); ctx.fill();
  ctx.fillStyle="#fff"; ctx.font="bold 22px Arial"; ctx.textAlign="center"; ctx.fillText("Book Now — ₹299", W/2, 724);
  ctx.fillStyle="#fef3c7"; ctx.font="13px Arial"; ctx.fillText("Instant confirmation · No calls needed", W/2, 742);
}

function drawConfirmScene(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, W, H);

  // Amber header gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 560);
  grad.addColorStop(0, "#f59e0b"); grad.addColorStop(1, "#92400e");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, 560);

  // Scatter dots (fixed positions so it doesn't flicker)
  const dots: [number,number,number,string][] = [
    [80,80,5,"#fff"],[420,60,4,"#fef3c7"],[150,140,6,"#fff"],[370,180,5,"#fed7aa"],
    [60,250,4,"#fff"],[440,200,6,"#fde68a"],[200,320,4,"#fff"],[480,300,5,"#fef3c7"],
    [100,400,5,"#fff"],[380,380,4,"#fed7aa"],[260,60,3,"#fff"],[300,440,6,"#fde68a"],
  ];
  dots.forEach(([x,y,r,c]) => {
    ctx.fillStyle = c+"90"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
  });

  // Check circle
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(W/2, 210, 78, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(W/2, 210, 78, 0, Math.PI*2); ctx.stroke();
  ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 7; ctx.lineCap="round"; ctx.lineJoin="round";
  ctx.beginPath(); ctx.moveTo(W/2-34, 210); ctx.lineTo(W/2-6, 240); ctx.lineTo(W/2+40, 174); ctx.stroke();

  // Confirmed text
  ctx.fillStyle = "#fff"; ctx.font = "bold 38px Arial"; ctx.textAlign = "center"; ctx.fillText("Booking Confirmed!", W/2, 340);
  ctx.fillStyle = "#fef3c7"; ctx.font = "17px Arial"; ctx.fillText("You're all set — see you soon.", W/2, 372);

  // Details wave divider
  ctx.fillStyle = "#0f0f0f";
  ctx.beginPath();
  ctx.moveTo(0, 540);
  ctx.quadraticCurveTo(W/4, 510, W/2, 540);
  ctx.quadraticCurveTo(3*W/4, 570, W, 540);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#111"; ctx.fillRect(0, 542, W, H-542);

  // Card
  rr(ctx, 20, 580, W-40, 254, 20); ctx.fillStyle="#1a1a1a"; ctx.fill();

  const rows = [
    ["Shop","The Classic Cut"],
    ["Service","Fresh Fade — ₹299"],
    ["Date & Time","Today, 10:30 AM"],
    ["Barber","Marcus"],
  ];
  rows.forEach(([label, val], i) => {
    const ry = 614 + i*52;
    ctx.fillStyle="#71717a"; ctx.font="13px Arial"; ctx.textAlign="left"; ctx.fillText(label, 40, ry);
    ctx.fillStyle="#fff"; ctx.font="bold 16px Arial"; ctx.textAlign="right"; ctx.fillText(val, W-40, ry);
    if (i<rows.length-1) { ctx.fillStyle="#232323"; ctx.fillRect(40,ry+12,W-80,1); }
  });

  // Action buttons
  rr(ctx, 20, 850, W/2-26, 60, 30); ctx.fillStyle="#f59e0b"; ctx.fill();
  ctx.fillStyle="#fff"; ctx.font="bold 15px Arial"; ctx.textAlign="center"; ctx.fillText("📅 Calendar", 20+(W/2-26)/2, 885);

  rr(ctx, W/2+6, 850, W/2-26, 60, 30); ctx.fillStyle="#1f1f1f"; ctx.fill();
  ctx.strokeStyle="#2a2a2a"; ctx.lineWidth=1; rr(ctx, W/2+6, 850, W/2-26, 60, 30); ctx.stroke();
  ctx.fillStyle="#fff"; ctx.font="bold 15px Arial"; ctx.textAlign="center"; ctx.fillText("📍 Directions", W/2+6+(W/2-26)/2, 885);

  ctx.fillStyle="#444"; ctx.font="13px Arial"; ctx.textAlign="center";
  ctx.fillText("We'll remind you 1 hour before", W/2, 946);
}
