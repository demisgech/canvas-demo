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
        if (!this.canvas) throw new Error(`Canvas with id ${canvasId} is not found.`);

        this.context = this.canvas.getContext(contextId) as CanvasRenderingContext2D;

        this.width = width ?? this.canvas.width;
        this.height = height ?? this.canvas.height;
    }

    draw() {
        this.drawStripes();
        this.drawCircle();
        this.drawStar();
        this.drawRadiatingLines(); // Add radiating lines
    }

    drawStripes(): void {
        const stripeHeight = this.height / 3;

        this.context.fillStyle = FlagColor.green;
        this.context.fillRect(0, 0, this.width, stripeHeight);

        this.context.fillStyle = FlagColor.yellow;
        this.context.fillRect(0, stripeHeight, this.width, stripeHeight);

        this.context.fillStyle = FlagColor.red;
        this.context.fillRect(0, stripeHeight * 2, this.width, stripeHeight);
    }

    drawCircle() {
        const { x: centerX, y: centerY, radius } = this.getCirclePosition();

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.context.fillStyle = FlagColor.blue;
        this.context.fill();
        this.context.closePath();
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

        // Calculate pentagram points
        const pentagramRadius = radius * 0.8;
        const pentagramPoints: Point[] = [];

        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / starPoints) - Math.PI / 2;
            const x = centerX + Math.cos(angle) * pentagramRadius;
            const y = centerY + Math.sin(angle) * pentagramRadius;
            pentagramPoints.push({ x, y });
        }

        // Draw pentagram
        this.context.beginPath();
        const startPoint = pentagramPoints[0] ?? { x: 0, y: 0 };

        this.context.moveTo(startPoint.x, startPoint.y);

        for (let i = 2; i < 10; i += 2) {
            const point = pentagramPoints[i % 5] ?? { x: 0, y: 0 };
            this.context.lineTo(point.x, point.y);
        }

        this.context.lineWidth = 6;
        this.context.strokeStyle = FlagColor.yellow;
        this.context.closePath();
        this.context.stroke();

    }

    drawRadiatingLines(): void {
        const { x: centerX, y: centerY, radius } = this.getCirclePosition();
        const outerRadius = radius * 0.75;

        // Get the 5 points of the pentagram (outer points only)
        const pentagramPoints: Point[] = [];
        const starPoints = 5;

        for (let i = 0; i < starPoints; i++) {
            const angle = (Math.PI * 2 / starPoints) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * outerRadius;
            const y = centerY + Math.sin(angle) * outerRadius;
            pentagramPoints.push({ x: x, y: y });
        }

        this.context.strokeStyle = FlagColor.yellow;
        this.context.lineWidth = 5;

        this.context.beginPath();
        for (let i = 0; i < pentagramPoints.length; i++) {
            const point = pentagramPoints[i] ?? { x: 0, y: 0 };
            const nextPoint = pentagramPoints[(i + 1) % pentagramPoints.length] ?? { x: 0, y: 0 };

            // Calculate midpoint between two pentagram points
            const midX = (point.x + nextPoint.x) / 2;
            const midY = (point.y + nextPoint.y) / 2;

            // Calculate angle from center to midpoint
            const angle = Math.atan2(midY - centerY, midX - centerX);

            // Calculate inner start point (closer to center)
            const innerRadius = outerRadius * 0.6;
            const innerX = centerX + Math.cos(angle) * innerRadius;
            const innerY = centerY + Math.sin(angle) * innerRadius;

            // Calculate outer end point
            const outerX = centerX + Math.cos(angle) * (radius * 0.95);
            const outerY = centerY + Math.sin(angle) * (radius * 0.95);

            // Draw line from inner point to outer point
            this.context.moveTo(innerX, innerY);
            this.context.lineTo(outerX, outerY);
        }
        this.context.stroke();
    }
}
