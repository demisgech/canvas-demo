interface RingConfig {
  value: number; // current value
  max: number; // max value
  color: string; // ring color
  thickness: number; // stroke width
}

interface ChartOptions {
  animationDuration: number;
  backgroundColor: string;
  textColor?: string;
  font?: string;
}

class RadialRing {
  current = 0;
  start = 0;
  target = 0;
  startTime = 0;

  constructor(public config: RingConfig) {}

  setValue(value: number, now: number) {
    this.start = this.current;
    this.target = Math.max(0, Math.min(value, this.config.max));
    this.startTime = now;
  }

  update(now: number, duration: number) {
    const t = Math.min((now - this.startTime) / duration, 1);
    this.current = this.start + (this.target - this.start) * t;
  }

  get percent() {
    return this.current / this.config.max;
  }
}

export class ConcentricRadialChart {
  private rings: RadialRing[] = [];

  constructor(
    private ctx: CanvasRenderingContext2D,
    private cx: number,
    private cy: number,
    private baseRadius: number,
    private options: ChartOptions
  ) {}

  addRing(config: RingConfig) {
    this.rings.push(new RadialRing(config));
  }

  setValues(values: number[]) {
    const now = performance.now();
    values.forEach((v, i) => {
      this.rings[i]?.setValue(v, now);
    });
    requestAnimationFrame((t) => this.animate(t));
  }

  private animate(time: number) {
    this.clear();

    this.drawBackground();

    this.rings.forEach((ring, i) => {
      ring.update(time, this.options.animationDuration);
      this.drawRing(ring, i);
    });

    if (this.rings.some((r) => r.current !== r.target)) {
      requestAnimationFrame((t) => this.animate(t));
    }
  }

  private clear() {
    const maxThickness = Math.max(...this.rings.map((r) => r.config.thickness));
    const maxRadius =
      this.baseRadius + this.rings.reduce((s, r) => s + r.config.thickness, 0);

    this.ctx.clearRect(
      this.cx - maxRadius,
      this.cy - maxRadius,
      maxRadius * 2,
      maxRadius * 2
    );
  }

  private drawBackground() {
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, this.baseRadius + 40, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawRing(ring: RadialRing, index: number) {
    const offset = this.rings
      .slice(0, index)
      .reduce((s, r) => s + r.config.thickness + 6, 0);

    const radius = this.baseRadius + offset;
    const start = -Math.PI / 2;
    const end = start + ring.percent * Math.PI * 2;

    // Background ring
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = "rgba(255,255,255,0.08)";
    this.ctx.lineWidth = ring.config.thickness;
    this.ctx.stroke();

    // Foreground arc
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, radius, start, end);
    this.ctx.strokeStyle = ring.config.color;
    this.ctx.lineWidth = ring.config.thickness;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }
}
