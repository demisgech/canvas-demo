type Point = { x: number; y: number };

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const PIXEL = 5;

class Shape {
  private points: Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of this.points) {
      ctx.fillRect(p.x, p.y, PIXEL, PIXEL);
    }
  }

  translate(dx: number, dy: number) {
    if (!this.canMove(dx, dy)) return;

    for (const p of this.points) {
      p.x += dx;
      p.y += dy;
    }
    this.draw();
  }

  rotate(deg: number) {
    const pivot = this.getPivot();
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    this.points = this.points.map((p) => {
      const x = p.x - pivot.x;
      const y = p.y - pivot.y;

      return {
        x: Math.round(x * cos - y * sin + pivot.x),
        y: Math.round(x * sin + y * cos + pivot.y),
      };
    });

    this.draw();
  }

  private getPivot(): Point {
    const sum = this.points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );

    return {
      x: sum.x / this.points.length,
      y: sum.y / this.points.length,
    };
  }

  private canMove(dx: number, dy: number): boolean {
    return this.points.every(
      (p) =>
        p.x + dx >= 0 &&
        p.y + dy >= 0 &&
        p.x + dx < canvas.width &&
        p.y + dy < canvas.height
    );
  }
}

const shape = new Shape([
  { x: 19, y: 32 },
  { x: 9, y: 39 },
  { x: 30, y: 39 },
  { x: 9, y: 55 },
  { x: 30, y: 55 },
]);

shape.draw();

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

let currentDirection = Direction.Up;

const ROTATION_MAP: Record<Direction, number> = {
  [Direction.Up]: 0,
  [Direction.Right]: 90,
  [Direction.Down]: 180,
  [Direction.Left]: -90,
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      rotateIfNeeded(Direction.Up);
      shape.translate(0, -1);
      break;

    case "ArrowRight":
      rotateIfNeeded(Direction.Right);
      shape.translate(1, 0);
      break;

    case "ArrowDown":
      rotateIfNeeded(Direction.Down);
      shape.translate(0, 1);
      break;

    case "ArrowLeft":
      rotateIfNeeded(Direction.Left);
      shape.translate(-1, 0);
      break;
  }
});

function rotateIfNeeded(next: Direction) {
  if (currentDirection === next) return;

  // angle to rotate
  const delta = ROTATION_MAP[next] - ROTATION_MAP[currentDirection];

  shape.rotate(delta);
  currentDirection = next;
}
