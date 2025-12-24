import { RadialChart } from "./RadialChart";

const radial = document.getElementById("radial") as HTMLCanvasElement;
const ctx = radial.getContext("2d") as CanvasRenderingContext2D;

const chart = new RadialChart(ctx, radial.width / 2, radial.height / 2, 100, {
  radius: 100,
  lineWidth: 14,
  backgroundColor: "#1f2937", // dark gray
  foregroundColor: "#22c55e", // green
  textColor: "#ffffff",
  font: "bold 24px monospace",
  animationDuration: 800,
});

// Demo
chart.setValue(75);

setTimeout(() => chart.setValue(40), 2000);
setTimeout(() => chart.setValue(90), 4000);
