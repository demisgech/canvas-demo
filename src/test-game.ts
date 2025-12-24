import { Game } from "./game";
import { StarBackground } from "./StarBackground";


const bg = document.getElementById("background") as HTMLCanvasElement;
const bgCtx = bg.getContext("2d") as CanvasRenderingContext2D;

new StarBackground(bg, bgCtx);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const scoreEl = document.getElementById("score")!;

const game = new Game(canvas, scoreEl);
game.start();
