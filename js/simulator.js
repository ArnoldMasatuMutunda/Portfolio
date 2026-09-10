/**
 * Advanced Disk Scheduling Simulator
 * Inspired by Arnold Masatu Mutunda's Project
 * Supports FCFS, SSTF, SCAN, and C-SCAN algorithms with Canvas Visualization
 */

class DiskSchedulingSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.diskSize = 200; // Track range 0-199
    this.animationId = null;
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width - 40;
    this.canvas.height = 200;
  }

  // Parse input queue
  parseQueue(queueStr) {
    return queueStr
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n < this.diskSize);
  }

  // Algorithm: FCFS
  runFCFS(queue, initialHead) {
    const sequence = [initialHead, ...queue];
    let totalSeek = 0;
    for (let i = 0; i < sequence.length - 1; i++) {
      totalSeek += Math.abs(sequence[i + 1] - sequence[i]);
    }
    return {
      name: 'FCFS (First-Come First-Served)',
      sequence,
      totalSeek,
      avgSeek: (totalSeek / queue.length).toFixed(2)
    };
  }

  // Algorithm: SSTF
  runSSTF(queue, initialHead) {
    const sequence = [initialHead];
    const pending = [...queue];
    let current = initialHead;
    let totalSeek = 0;

    while (pending.length > 0) {
      let closestIdx = 0;
      let minDiff = Math.abs(pending[0] - current);

      for (let i = 1; i < pending.length; i++) {
        const diff = Math.abs(pending[i] - current);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }

      totalSeek += minDiff;
      current = pending.splice(closestIdx, 1)[0];
      sequence.push(current);
    }

    return {
      name: 'SSTF (Shortest Seek Time First)',
      sequence,
      totalSeek,
      avgSeek: (totalSeek / queue.length).toFixed(2)
    };
  }

  // Algorithm: SCAN
  runSCAN(queue, initialHead, direction = 'right') {
    const sequence = [initialHead];
    const left = queue.filter(x => x < initialHead).sort((a, b) => b - a);
    const right = queue.filter(x => x >= initialHead).sort((a, b) => a - b);
    let totalSeek = 0;

    if (direction === 'right') {
      for (const req of right) sequence.push(req);
      if (left.length > 0) {
        sequence.push(this.diskSize - 1); // Hit end boundary
        for (const req of left) sequence.push(req);
      }
    } else {
      for (const req of left) sequence.push(req);
      if (right.length > 0) {
        sequence.push(0); // Hit start boundary
        for (const req of right) sequence.push(req);
      }
    }

    for (let i = 0; i < sequence.length - 1; i++) {
      totalSeek += Math.abs(sequence[i + 1] - sequence[i]);
    }

    return {
      name: 'SCAN (Elevator Algorithm)',
      sequence,
      totalSeek,
      avgSeek: (totalSeek / queue.length).toFixed(2)
    };
  }

  // Algorithm: C-SCAN
  runCSCAN(queue, initialHead, direction = 'right') {
    const sequence = [initialHead];
    const left = queue.filter(x => x < initialHead).sort((a, b) => a - b);
    const right = queue.filter(x => x >= initialHead).sort((a, b) => a - b);
    let totalSeek = 0;

    if (direction === 'right') {
      for (const req of right) sequence.push(req);
      if (left.length > 0) {
        sequence.push(this.diskSize - 1);
        sequence.push(0);
        for (const req of left) sequence.push(req);
      }
    } else {
      const leftDesc = queue.filter(x => x <= initialHead).sort((a, b) => b - a);
      const rightDesc = queue.filter(x => x > initialHead).sort((a, b) => b - a);
      for (const req of leftDesc) sequence.push(req);
      if (rightDesc.length > 0) {
        sequence.push(0);
        sequence.push(this.diskSize - 1);
        for (const req of rightDesc) sequence.push(req);
      }
    }

    for (let i = 0; i < sequence.length - 1; i++) {
      totalSeek += Math.abs(sequence[i + 1] - sequence[i]);
    }

    return {
      name: 'C-SCAN (Circular SCAN)',
      sequence,
      totalSeek,
      avgSeek: (totalSeek / queue.length).toFixed(2)
    };
  }

  // Draw chart on canvas
  render(sequence) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const paddingX = 40;
    const paddingY = 30;

    ctx.clearRect(0, 0, w, h);

    // Is dark theme?
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#a1a1a6' : '#6e6e73';
    const primaryColor = isDark ? '#2997ff' : '#0071e3';
    const pointFill = isDark ? '#64d2ff' : '#00c7be';

    // Draw track grid line
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingX, h - paddingY);
    ctx.lineTo(w - paddingX, h - paddingY);
    ctx.stroke();

    // Scale helpers
    const scaleX = (val) => paddingX + (val / (this.diskSize - 1)) * (w - 2 * paddingX);
    const stepY = (h - 2 * paddingY) / Math.max(sequence.length - 1, 1);

    // Axis labels
    ctx.fillStyle = textColor;
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('0', paddingX, h - paddingY + 18);
    ctx.fillText('99', w / 2, h - paddingY + 18);
    ctx.fillText('199', w - paddingX, h - paddingY + 18);

    // Draw path
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    sequence.forEach((val, idx) => {
      const x = scaleX(val);
      const y = paddingY + idx * stepY;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw nodes
    sequence.forEach((val, idx) => {
      const x = scaleX(val);
      const y = paddingY + idx * stepY;

      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#ff9500' : pointFill;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node label
      ctx.fillStyle = textColor;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(` ${val}`, x + 6, y + 3);
    });
  }
}

// Global hook
window.DiskSimulator = DiskSchedulingSimulator;
