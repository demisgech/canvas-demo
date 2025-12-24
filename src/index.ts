

import { ConcentricRadialChart } from "./ConcentricRadialChart";




const canvas = document.getElementById("chart") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const chart = new ConcentricRadialChart(
  ctx,
  canvas.width / 2,
  canvas.height / 2,
  70,
  {
    animationDuration: 900,
    backgroundColor: "#020617",
  }
);

chart.addRing({
  value: 0,
  max: 100,
  color: "#22c55e",
  thickness: 14,
});

chart.addRing({
  value: 0,
  max: 100,
  color: "#3b82f6",
  thickness: 14,
});

chart.addRing({
  value: 0,
  max: 100,
  color: "#f59e0b",
  thickness: 14,
});

chart.addRing({
  value: 0,
  max: 100,
  color: "#f65e0b",
  thickness: 14,
});

// Animate to values
chart.setValues([45, 55, 65, 75]);
