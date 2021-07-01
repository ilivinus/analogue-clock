class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    xDiffFromXof(point) {
        if (!point instanceof Point) {
            throw new Error("Requires a point");
        }
        return point.x - this.x;
    }
    yDiffFromYof(point) {
        if (!point instanceof Point) {
            throw new Error("Requires instance of point");
        }
        return point.y - this.y;
    }
}

class Line {
    constructor(pointA, pointB) {
        if (!pointA instanceof Point || !pointA instanceof Point) {
            throw new Error("pointA and pointB must be instance of a Point class");
        }
        this.pointA = pointA;
        this.pointB = pointB;
    }
    slope() {
        return this.pointA.yDiffFromYof(this.pointB) / this.pointA.xDiffFromXof(this.pointB);
    }
    length() {
        return this.pointA.xDiffFromXof(this.pointB);
    }
    yIntercept() {
        return this.pointA.getY() - (this.slope() * this.pointA.getX());
    }
    xIntercept() {

    }
    tick(numOfPoints = 15) {
        const spaceBetweenPoints = Math.abs(this.length() / 200);
        const yIntercept = this.yIntercept();
        const slope = this.slope();
        const pointsFromX1ToX2 = [];
        if (this.pointB.getX() < 0) {
            for (let x2 = this.pointB.getX(); x2 < this.pointA.getX(); x2 += spaceBetweenPoints) {
                //y = mx + c
                const y = slope * x2 + yIntercept;
                pointsFromX1ToX2.push(new Point(x2, y));
                if (pointsFromX1ToX2.length % numOfPoints === 0) break;
            }
        } else {
            for (let x2 = this.pointB.getX(); x2 > this.pointA.getX(); x2 -= spaceBetweenPoints) {
                const y = slope * x2 + yIntercept;
                pointsFromX1ToX2.push(new Point(x2, y));
                if (pointsFromX1ToX2.length % numOfPoints === 0) break;
            }
        }
        return pointsFromX1ToX2;
    }
    draw(lengthOfLine = 15) {
        const spaceBetweenPoints = Math.abs(this.length() / 200);
        const yIntercept = this.yIntercept();
        const slope = this.slope();
        const pointsFromX1ToX2 = [];

        if (this.pointB.getX() > 0) {
            for (let x1 = this.pointA.getX(); x1 < this.pointB.getX(); x1 += spaceBetweenPoints) {
                //y = mx + c
                const y = slope * x1 + yIntercept;
                pointsFromX1ToX2.push(new Point(x1, y));
                if (pointsFromX1ToX2.length % lengthOfLine === 0) break;
            }
        } else {
            for (let x1 = this.pointA.getX(); x1 > this.pointB.getX(); x1 -= spaceBetweenPoints) {
                const y = slope * x1 + yIntercept;
                pointsFromX1ToX2.push(new Point(x1, y));
                if (pointsFromX1ToX2.length % lengthOfLine === 0) break;
            }
        }
        return pointsFromX1ToX2;
    }
}

class ShapeDrawer {
    drawTick(pointA, pointB, lengthOfLine) {
        if (!pointA instanceof Point || !pointB instanceof Point) {
            throw new Error("pointA or pointB is not an instance of Point");
        }
        const line = new Line(pointA, pointB);
        return line.tick(lengthOfLine);
    }
    drawLine(pointA, pointB, lengthOfLine) {
        if (!pointA instanceof Point || !pointB instanceof Point) {
            throw new Error("pointA or pointB is not an instance of Point");
        }
        const line = new Line(pointA, pointB);
        return line.draw(lengthOfLine);
    }
    drawCircle(radius = 1, shift = 0, numOfPoints = 12, rotation = 7 / 6) {
        //formular  y = rsinO | x = rcosO 0 < O < 2PI (polar cordinate)

        const circleAngle = 2 * Math.PI, //360 degrees is equivalent to 2 * PI in polar cordinate system
            spaceBtwPoints = (circleAngle / numOfPoints),
            cordinates = []
        const rad = radius - shift;
        for (let startAngle = 0; startAngle < circleAngle; startAngle += spaceBtwPoints) {
            cordinates.push({
                x: rad * Math.sin(-(startAngle + (Math.PI) * rotation)),
                y: rad * Math.cos(startAngle + (Math.PI) * rotation)
            });
        }
        return cordinates;
    }
}
class AnalogueClock {
    constructor(layoutCanvas, layoutCtx, hourHandCtx, minuteHandCtx, secondHandCtx) {
        this.layoutCtx = layoutCtx;
        this.hourHandCtx = hourHandCtx;
        this.minuteHandCtx = minuteHandCtx;
        this.secondHandCtx = secondHandCtx;

        const gridSize = 25;
        const xDistanceGridLines = 15;
        const yDistanceGridLines = 28;

        this.canvasWidth = layoutCanvas.width;
        this.canvasHeight = layoutCanvas.height;

        this.layoutCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.secondHandCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.minuteHandCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.hourHandCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);



        this.layoutCtx.translate(yDistanceGridLines * gridSize, xDistanceGridLines * gridSize);
        this.secondHandCtx.translate(yDistanceGridLines * gridSize, xDistanceGridLines * gridSize);
        this.minuteHandCtx.translate(yDistanceGridLines * gridSize, xDistanceGridLines * gridSize);
        this.hourHandCtx.translate(yDistanceGridLines * gridSize, xDistanceGridLines * gridSize);

        this.shapeDrawer = new ShapeDrawer();

    }

    drawHourNumbers(radius) {
        let clockHourNumber = 1;
        this.layoutCtx.font = "14px Arial";
        this.shapeDrawer.drawCircle(radius, 0).forEach(circlePoints => {
            this.layoutCtx.fillText(clockHourNumber++, circlePoints.x, circlePoints.y);
            this.drawHourTicks(circlePoints.x, circlePoints.y);
        })
    }
    drawHourTicks(x, y) {
        const lengthOfTick = 15;
        this.shapeDrawer.drawTick(new Point(0, 0), new Point(x, y), lengthOfTick)
            .forEach(point => this.layoutCtx.fillRect(-point.x, -point.y, 2, 2));
    }
    drawMinuteTicks(radius) {
        const numberOfTicks = 60;
        const lengthOfTick = 5;
        this.shapeDrawer.drawCircle(radius, 0, numberOfTicks).forEach(circlPoint => {
            this.shapeDrawer.drawTick(new Point(0, 0), new Point(circlPoint.x, circlPoint.y), lengthOfTick)
                .forEach(point => this.layoutCtx.fillRect(-point.x, -point.y, 1, 1));
        })
    }
    clockRenderer(clock,radius) {
        let secondHand = 0,
            minuteHand = 0,
            hourHand = 0;
        return () => {
            this.secondHandCtx.clearRect(-500, -radius, this.canvasWidth, this.canvasHeight);
            this.shapeDrawer.drawLine(new Point(0, 0), new Point(clock[secondHand % 120].x, clock[secondHand % 120].y), 180)
                .forEach((point, index) => {
                    this.secondHandCtx.fillRect(point.x, point.y, 1, 1);
                    if (index == 179) this.secondHandCtx.fillRect(point.x, point.y, 9, 9);
                })
            secondHand++;
            if (secondHand % 60 == 0) {
                this.minuteHandCtx.clearRect(-500, -radius, this.canvasWidth, this.canvasHeight);

                this.shapeDrawer.drawLine(new Point(0, 0), new Point(clock[minuteHand % 120].x, clock[minuteHand % 120].y), 150)
                    .forEach((point, index) => {
                        this.minuteHandCtx.fillRect(point.x, point.y, 2, 2);
                        if (index == 148) this.minuteHandCtx.fillRect(point.x, point.y, 9, 9);
                    })
                if (minuteHand % 12 === 0) {
                    this.hourHandCtx.clearRect(-500, -radius, this.canvasWidth, this.canvasHeight);
                    this.shapeDrawer.drawLine(new Point(0, 0), new Point(clock[hourHand % 120].x, clock[hourHand % 120].y), 120)
                        .forEach(point => this.hourHandCtx.fillRect(point.x, point.y, 3, 3));
                    hourHand++;
                }
                minuteHand++;
            }
        }
    }
    init() {
        const radius = 300;
        this.drawHourNumbers(radius);
        this.drawMinuteTicks(radius);

        const clock = this.shapeDrawer.drawCircle(radius, 0, 120, 1);

        this.shapeDrawer.drawLine(new Point(0, 0), new Point(clock[0].x, clock[0].y), 150)
            .forEach((point, index) => {
                this.minuteHandCtx.fillRect(point.x, point.y, 1, 1);
                if (index == 148) this.minuteHandCtx.fillRect(point.x, point.y, 9, 9); //add big shade at the tip
            })
        this.shapeDrawer.drawLine(new Point(0, 0), new Point(clock[0].x, clock[0].y), 120)
            .forEach(point => this.hourHandCtx.fillRect(point.x, point.y, 3, 3))

        const secondHandTickTime = 1000; //milliseconds

        setInterval(this.clockRenderer(clock,radius), secondHandTickTime);
    }
}