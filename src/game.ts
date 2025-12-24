interface Point {
  x: number;
  y: number;
}

interface Grid {
  GRID_SIZE: number;
  CELL: number;
}

const enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const enum GameState {
  Running,
  Paused,
  GameOver,
}

export function getGrid(gridSize = 20, canvasWidth = 400): Grid {
  return {
    GRID_SIZE: gridSize,
    CELL: canvasWidth / gridSize,
  };
}

const { GRID_SIZE, CELL } = getGrid(20, 600);

class Snake {
  private body: Point[];
  private direction: Direction;
  private nextDirection: Direction;

  public constructor(initial: Point[], direction: Direction) {
    this.body = initial;
    this.direction = direction;
    this.nextDirection = direction;
  }

  public setDirection(dir: Direction) {
    const invalid =
      (this.direction === Direction.Up && dir === Direction.Down) ||
      (this.direction === Direction.Down && dir === Direction.Up) ||
      (this.direction === Direction.Left && dir === Direction.Right) ||
      (this.direction === Direction.Right && dir === Direction.Left);
    if (!invalid) this.nextDirection = dir;
  }

  public move(): Point {
    this.direction = this.nextDirection;
    const head = this.body[0] ?? { x: 0, y: 0 };
    const newHead = { ...head };

    switch (this.direction) {
      case Direction.Up:
        newHead.y--;
        break;

      case Direction.Right:
        newHead.x++;
        break;
      case Direction.Down:
        newHead.y++;
        break;
      case Direction.Left:
        newHead.x--;
        break;
    }
    this.body.unshift(newHead);
    return newHead;
  }

  public shrink(): void {
    this.body.pop();
  }

  public grow(): void {}

  public hitsSelf(point: Point): boolean {
    return this.body.slice(1).some((p) => p.x === point.x && p.y === point.y);
  }

  public hits(point: Point): boolean {
    return this.body.some((p) => p.x === point.x && p.y === point.y);
  }

  public getBody(): Point[] {
    return this.body;
  }
}

class Food {
  position: Point;

  public constructor(snake: Snake) {
    this.position = this.generate(snake);
  }

  public regenerate(snake: Snake) {
    this.position = this.generate(snake);
  }

  public generate(snake: Snake): Point {
    let pos: Point;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.hits(pos));
    return pos;
  }
}

class Renderer {
  public constructor(
    private ctx: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement
  ) {}

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public drawGrid(color = "rgba(255, 255, 255, 0.4)"): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    for (let i = 0; i <= GRID_SIZE; i++) {
      const p = i * CELL;

      // vertical
      this.ctx.beginPath();
      this.ctx.moveTo(p, 0);
      this.ctx.lineTo(p, this.canvas.height);
      this.ctx.stroke();

      // horizontal
      this.ctx.beginPath();
      this.ctx.moveTo(0, p);
      this.ctx.lineTo(this.canvas.width, p);
      this.ctx.stroke();
    }
  }

  public drawSnake(
    snake: Snake,
    headColor = "#89d3a4ff", // bright green
    bodyColor = "#16a34a" // darker green
  ): void {
    const body = snake.getBody();
    if (body.length === 0) return;

    // Draw head
    const head = body[0] ?? { x: 0, y: 0 };
    this.ctx.fillStyle = headColor;
    this.ctx.fillRect(head.x * CELL, head.y * CELL, CELL, CELL);

    // Draw body
    this.ctx.fillStyle = bodyColor;
    for (let i = 1; i < body.length; i++) {
      const p = body[i] ?? { x: 0, y: 0 };
      this.ctx.fillRect(p.x * CELL, p.y * CELL, CELL, CELL);
    }
  }

  public drawFood(food: Food, fillColor = "#f87171"): void {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(
      food.position.x * CELL + CELL / 2,
      food.position.y * CELL + CELL / 2,
      CELL / 2.5,
      0,
      Math.PI * CELL
    );
    this.ctx.fill();
  }
}

export class Game {
  private snake!: Snake;
  private food!: Food;
  private renderer: Renderer;
  private score: number = 0;
  private state: GameState = GameState.Running;
  private timerId: number | null = null;
  private readonly TICK = 120;
  private readonly RESTART_DELAY = 2000; // 2sec

  public constructor(
    private canvas: HTMLCanvasElement,
    private scoreEl: HTMLElement
  ) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.renderer = new Renderer(ctx, canvas);
    this.reset();

    this.bindControls();
  }

  private reset() {
    this.snake = new Snake(
      [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      Direction.Right
    );
    this.food = new Food(this.snake);
    this.score = 0;
    this.scoreEl.textContent = `Score: 0`;
    this.state = GameState.Running;
    this.draw();
  }

  public start() {
    this.stop();
    this.timerId = window.setInterval(() => this.loop(), this.TICK);
  }
  private stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private pause() {
    if (this.state === GameState.Running) {
      this.state = GameState.Paused;
    }
  }
  private resume() {
    if (this.state === GameState.Paused) {
      this.state = GameState.Running;
    }
  }

  private togglePause() {
    this.state === GameState.Running ? this.pause() : this.resume();
  }

  private gameOver() {
    this.state = GameState.GameOver;
    this.stop();

    setTimeout(() => {
      this.reset();
      this.start();
    }, this.RESTART_DELAY);
  }

  private loop(): void {
    if (this.state === GameState.Running) return;

    const head = this.snake.move();

    if (this.hitsWall(head) || this.snake.hitsSelf(head)) {
      this.gameOver();
      return;
    }

    if (this.isEating(head)) {
      this.score++;
      this.scoreEl.textContent = `Score: ${this.score}`;
      this.food.regenerate(this.snake);
      this.snake.grow();
    } else {
      this.snake.shrink();
    }
    this.draw();
  }
  private isEating(head: Point) {
    return head.x === this.food.position.x && head.y === this.food.position.y;
  }

  private draw() {
    this.renderer.clear();
    this.renderer.drawGrid();
    this.renderer.drawSnake(this.snake);
    this.renderer.drawFood(this.food);
  }

  private hitsWall(point: Point): boolean {
    return (
      point.x < 0 || point.y < 0 || point.x >= GRID_SIZE || point.y >= GRID_SIZE
    );
  }

  private bindControls() {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case " ":
          this.togglePause();
          break;
        case "ArrowUp":
          this.snake.setDirection(Direction.Up);
          break;
        case "ArrowRight":
          this.snake.setDirection(Direction.Right);
          break;

        case "ArrowDown":
          this.snake.setDirection(Direction.Down);
          break;
        case "ArrowLeft":
          this.snake.setDirection(Direction.Left);
          break;
      }
    });
  }
}
