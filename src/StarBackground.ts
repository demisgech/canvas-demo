interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  alphaSpeed: number;
}

export class StarBackground {
  private stars: Star[] = [];
  private lastTime = 0;

  private readonly STAR_COUNT = 200;
  private readonly TWINKLE_SPEED = 0.001; // 👈 slow

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.resize();
    this.createStars();
    requestAnimationFrame((t) => this.animate(t));
  }

  private createStars() {
    this.stars = [];
    for (let i = 0; i < this.STAR_COUNT; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2 + 0.2,
        alpha: Math.random(),
        alphaSpeed: Math.random() * this.TWINKLE_SPEED + this.TWINKLE_SPEED / 2,
      });
    }
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private drawSky() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawStars() {
    this.ctx.fillStyle = "white";
    for (const s of this.stars) {
      this.ctx.globalAlpha = s.alpha;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  private animate(time: number) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.drawSky();

    for (const s of this.stars) {
      s.alpha += s.alphaSpeed * delta;
      if (s.alpha <= 0 || s.alpha >= 1) {
        s.alphaSpeed *= -1;
      }
    }

    this.drawStars();
    requestAnimationFrame((t) => this.animate(t));
  }
}
