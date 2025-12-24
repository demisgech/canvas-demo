interface RadialChartOptions {
  radius: number;
  lineWidth: number;
  backgroundColor: string;
  foregroundColor: string;
  textColor: string;
  font: string;
  animationDuration: number; // ms
}

export class RadialChart {
  private currentValue = 0;
  private startTime = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private centerX: number,
    private centerY: number,
    private maxValue: number,
    private options: RadialChartOptions
  ) {}

  public setValue(value: number) {
    const clamped = Math.max(0, Math.min(value, this.maxValue));
    this.animateTo(clamped);
  }

  private animateTo(target: number) {
    const startValue = this.currentValue;
    this.startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min(
        (time - this.startTime) / this.options.animationDuration,
        1
      );

      this.currentValue = startValue + (target - startValue) * progress;

      this.draw();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private draw() {
    const {
      radius,
      lineWidth,
      backgroundColor,
      foregroundColor,
      textColor,
      font,
    } = this.options;

    const percent = this.currentValue / this.maxValue;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + percent * Math.PI * 2;

    // Clear area
    this.ctx.clearRect(
      this.centerX - radius - lineWidth,
      this.centerY - radius - lineWidth,
      (radius + lineWidth) * 2,
      (radius + lineWidth) * 2
    );

    // Background ring
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = backgroundColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();

    // Foreground arc
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, radius, startAngle, endAngle);
    this.ctx.strokeStyle = foregroundColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.stroke();

    // Text
    this.ctx.fillStyle = textColor;
    this.ctx.font = font;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `${Math.round(percent * 100)}%`,
      this.centerX,
      this.centerY
    );
  }
}
