const enum FlagColor {
    red = "#E80000",
    green = "#078930",
    yellow = "#FCD116",
    blue = "#0038A8",
}


interface Circle {
    x: number;
    y: number;
    radius: number;
}

interface Point {
    x: number;
    y: number;
}

export class Flag {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(canvasId: string, contextId: string = '2d', width?: number, height?: number) {

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) throw new Error(`Canvas with id ${canvasId} is not found.`)

        this.context = this.canvas.getContext(contextId) as CanvasRenderingContext2D;

        this.width = width ?? this.canvas.width;
        this.height = height ?? this.canvas.height;
    }

    draw() {
        this.drawStripes();
        this.drawCircle();
        this.drawStar();
    }

    drawStripes(): void {
        const stripeHeight = this.height / 3;

        this.context.fillStyle = FlagColor.green; // green
        this.context.fillRect(0, 0, this.width, stripeHeight);

        this.context.fillStyle = FlagColor.yellow; // Yellow
        this.context.fillRect(0, stripeHeight, this.width, stripeHeight);

        this.context.fillStyle = FlagColor.red; // red
        this.context.fillRect(0, stripeHeight * 2, this.width, stripeHeight);
    }

    drawCircle() {
        const { x: centerX, y: centerY, radius } = this.getCirclePosition();

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.context.fillStyle = FlagColor.blue;
        this.context.fill();
        this.context.closePath()
    }

    getCirclePosition(): Circle {
        return {
            x: this.width / 2,
            y: this.height / 2,
            radius: this.height * 0.28
        };
    }

    drawStar(): void {
        const { x: centerX, y: centerY, radius } = this.getCirclePosition();

        const starPoints = 5;
        const outerRadius = radius * 0.75;
        const innerRadius = outerRadius * 0.35;

        // Draw the main star
        this.context.beginPath();

        for (let i = 0; i < starPoints * 2; i++) {
            const angle = (Math.PI / starPoints) * i - Math.PI / 2;
            const starCurrentRadius = i % 2 === 0 ? outerRadius : innerRadius;

            const x = centerX + Math.cos(angle) * starCurrentRadius;
            const y = centerY + Math.sin(angle) * starCurrentRadius;

            if (i === 0) {
                this.context.moveTo(x, y);
            } else {
                this.context.lineTo(x, y);
            }
        }

        this.context.lineWidth = 6;
        this.context.closePath();
        this.context.strokeStyle = FlagColor.yellow;
        this.context.stroke();
        // this.context.fillStyle = FlagColor.yellow;
        // this.context.fill();

        // // Draw rays/lines
        // this.context.beginPath();
        // this.context.strokeStyle = FlagColor.yellow;
        // this.context.lineWidth = 4;

        // for (let i = 0; i < starPoints; i++) {
        //     const angle = (Math.PI * 2 / starPoints) * i - Math.PI / 2;
        //     const rayLength = outerRadius * 1.5;

        //     const endX = centerX + Math.cos(angle) * rayLength;
        //     const endY = centerY + Math.sin(angle) * rayLength;

        //     this.context.moveTo(centerX, centerY);
        //     this.context.lineTo(endX, endY);
        // }

        // this.context.stroke();
    }

}