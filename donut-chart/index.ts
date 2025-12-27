interface Item {
  name: string;
  value: number;
  color?: string;
}

interface Config {
  itemNameId: string;
  itemValueId: string;
  addBtnId: string;
  itemsContainerId: string;
  canvasId: string;
}

class DonutChart {
  private items: Item[] = [];
  private itemNameInput: HTMLInputElement;
  private itemValueInput: HTMLInputElement;
  private addBtn: HTMLButtonElement;
  private itemsContainer: HTMLDListElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor(config: Config) {
    this.items = [];
    this.itemNameInput = document.getElementById(
      config.itemNameId
    ) as HTMLInputElement;
    this.itemValueInput = document.getElementById(
      config.itemValueId
    ) as HTMLInputElement;
    this.addBtn = document.getElementById(config.addBtnId) as HTMLButtonElement;
    this.itemsContainer = document.getElementById(
      config.itemsContainerId
    ) as HTMLDListElement;
    this.canvas = document.getElementById(config.canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!this.ctx) {
      alert("Canvas context could not be initialized!");
      return;
    }

    this.init();
  }

  generateNewColor(index: number) {
    // Generate a unique color based on index using HSL
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  renderItems() {
    this.itemsContainer.innerHTML = "";
    this.items.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "item";

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = item.name;
      nameInput.addEventListener("input", () => {
        this.items[index].name = nameInput.value;
        this.drawDonut();
      });

      const valueInput = document.createElement("input");
      valueInput.type = "number";
      valueInput.value = String(item.value);
      valueInput.addEventListener("input", () => {
        const val = parseFloat(valueInput.value);
        if (!isNaN(val) && val > 0) {
          this.items[index].value = val;
          this.drawDonut();
        }
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Delete";
      removeBtn.addEventListener("click", () => this.removeItem(index));

      div.append(nameInput, valueInput, removeBtn);
      this.itemsContainer.appendChild(div);
    });
  }

  addItem(item: Item) {
    if (!item.name || isNaN(item.value) || item.value <= 0) return;

    // Assign a new color only for the new item
    const color = this.generateNewColor(this.items.length);
    this.items.push({ ...item, color });

    this.renderItems();
    this.drawDonut();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.renderItems();
    this.drawDonut();
  }

  drawDonut() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.items.length === 0) return;

    const total = this.items.reduce((sum, item) => sum + item.value, 0);
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const outerR = 150;
    const innerR = 70;

    let startAngle = -Math.PI / 2;

    this.items.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color as string; // use stored color
      ctx.fill();

      const midAngle = startAngle + sliceAngle / 2;
      const labelX = cx + Math.cos(midAngle) * (outerR + 20);
      const labelY = cy + Math.sin(midAngle) * (outerR + 20);
      const percent = ((item.value / total) * 100).toFixed(1);

      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(`${item.name} (${percent}%)`, labelX - 20, labelY);

      startAngle += sliceAngle;
    });
  }

  init() {
    this.addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const name = this.itemNameInput.value.trim();
      const value = parseFloat(this.itemValueInput.value);
      this.addItem({ name, value });
      this.itemNameInput.value = "";
      this.itemValueInput.value = "";
    });

    this.renderItems();
    this.drawDonut();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DonutChart({
    itemNameId: "itemName",
    itemValueId: "itemValue",
    addBtnId: "addBtn",
    itemsContainerId: "items",
    canvasId: "chart",
  });
});
