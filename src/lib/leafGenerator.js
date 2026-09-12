// Botanical Leaf Canvas Generator for Hackathon Benchmarks & Live Telemetry
export const generateSampleLeafCanvas = (type = 'rust') => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  // Background gradient (clean neutral canvas)
  const grad = ctx.createLinearGradient(0, 0, 400, 300);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 300);

  // Digital grid lines (simulating lab scanner)
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 20; x < 400; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 300); ctx.stroke(); }
  for (let y = 20; y < 300; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke(); }

  // Draw Leaf Shape
  ctx.save();
  ctx.translate(200, 150);
  ctx.beginPath();
  ctx.moveTo(0, -115);
  ctx.bezierCurveTo(95, -70, 115, 45, 0, 115);
  ctx.bezierCurveTo(-115, 45, -95, -70, 0, -115);
  ctx.closePath();

  // Leaf Base Color
  const leafGrad = ctx.createLinearGradient(0, -115, 0, 115);
  if (type === 'rust') {
    leafGrad.addColorStop(0, '#854d0e');
    leafGrad.addColorStop(0.5, '#65a30d');
    leafGrad.addColorStop(1, '#ca8a04');
  } else if (type === 'leaf_blight') {
    leafGrad.addColorStop(0, '#451a03');
    leafGrad.addColorStop(0.4, '#15803d');
    leafGrad.addColorStop(1, '#78350f');
  } else if (type === 'powdery_mildew') {
    leafGrad.addColorStop(0, '#64748b');
    leafGrad.addColorStop(0.5, '#16a34a');
    leafGrad.addColorStop(1, '#94a3b8');
  } else {
    // Healthy
    leafGrad.addColorStop(0, '#22c55e');
    leafGrad.addColorStop(0.5, '#16a34a');
    leafGrad.addColorStop(1, '#15803d');
  }
  ctx.fillStyle = leafGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#22c55e';
  ctx.stroke();

  // Main Central Vein
  ctx.beginPath();
  ctx.moveTo(0, -105);
  ctx.lineTo(0, 105);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Side Veins
  for (let i = -75; i <= 75; i += 22) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(45, i - 18);
    ctx.moveTo(0, i);
    ctx.lineTo(-45, i - 18);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Symptoms
  if (type === 'rust') {
    ctx.fillStyle = '#ea580c';
    for (let j = 0; j < 35; j++) {
      const rx = Math.sin(j * 3.7) * 55;
      const ry = Math.cos(j * 4.9) * 75;
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5 + (j % 4), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'leaf_blight') {
    ctx.fillStyle = '#3e1604';
    ctx.beginPath();
    ctx.ellipse(22, -35, 28, 50, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(-26, 25, 32, 45, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'powdery_mildew') {
    ctx.fillStyle = 'rgba(241, 245, 249, 0.8)';
    for (let k = 0; k < 20; k++) {
      const px = Math.sin(k * 7) * 50;
      const py = Math.cos(k * 4.3) * 65;
      ctx.beginPath();
      ctx.arc(px, py, 7 + (k % 6), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return canvas.toDataURL('image/png');
};
