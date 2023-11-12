const grid = document.getElementById("layer1");
const drawPanel = document.getElementById("layer2");
const ctx_grid = grid.getContext("2d");
const ctx_draw = drawPanel.getContext("2d");

ctx_draw.transform(1, 0, 0, -1, drawPanel.width / 2, drawPanel.height / 2);
ctx_draw.strokeStyle = "black";

const xStartElem = document.getElementById("xStart");
const yStartElem = document.getElementById("yStart");
const xEndElem = document.getElementById("xEnd");
const yEndElem = document.getElementById("yEnd");

const xDelta = [0, -1, -1, 0];
const yDelta = [0, 0, -1, -1];
let scale = 10;
let step = 1;

drawGrid();


function start() {
    let alg = document.querySelector(".alg:checked").value;
    let sc = document.querySelector(".sc:checked").value;
    scale = parseInt(sc);
    step = 10 / scale;
    clearLine();
    drawGrid();
    if (alg === "stepByStep") {
        stepByStep();
    } else {
        bresenham();
    }
}

function clearLine() {
    ctx_draw.clearRect(-drawPanel.width / 2, -drawPanel.height / 2, drawPanel.width, drawPanel.height);
}

function drawGrid() {
    ctx_grid.clearRect(0, 0, drawPanel.width, drawPanel.height);
    ctx_grid.beginPath();
    // Vertical lines
    for (let x = -grid.width / 2; x < grid.width; x += step * scale) {
        ctx_grid.moveTo(grid.width / 2 + x, 0);
        ctx_grid.lineTo(grid.width / 2 + x, grid.height);
        if (x % ((scale * 100) / scale) === 0)
            ctx_grid.fillText((x / scale).toString(), grid.width / 2 + x - 7, grid.height / 2 + 10);
    }
    // Horizontal lines
    for (let y = -grid.height / 2; y < grid.height; y += step * scale) {
        ctx_grid.moveTo(0, grid.height / 2 + y);
        ctx_grid.lineTo(grid.width, grid.height / 2 + y);
        if (y % ((scale * 100) / scale) === 0 && y !== 0)
            ctx_grid.fillText((-y / scale).toString(), grid.width / 2 + 2, grid.height / 2 + y + 4);
    }
    ctx_grid.strokeStyle = "#ddd";
    ctx_grid.stroke();

    // Axes lines
    ctx_grid.beginPath();
    ctx_grid.moveTo(0, grid.height / 2);
    ctx_grid.lineTo(grid.width, grid.height / 2);
    ctx_grid.moveTo(grid.width / 2, 0);
    ctx_grid.lineTo(grid.width / 2, grid.height);
    ctx_grid.strokeStyle = "black";
    ctx_grid.stroke();
}


function stepByStep() {
    draw(drawLineStepByStep(
            parseInt(xStartElem.value),
            parseInt(yStartElem.value),
            parseInt(xEndElem.value),
            parseInt(yEndElem.value)
        )
    );
}

function bresenham() {
    draw(drawBresenhamLine(
        parseInt(xStartElem.value),
        parseInt(yStartElem.value),
        parseInt(xEndElem.value),
        parseInt(yEndElem.value)
    ));
}

function drawLineStepByStep(x0, y0, x1, y1) {
    let points = [];
    let xStart = x0 > x1 ? x1 : x0
    let xEnd = x0 <= x1 ? x1 : x0
    let yStart = y0 > y1 ? y1 : y0
    let yEnd = y0 <= y1 ? y1 : y0

    points.push([x0, y0]);
    if (x0 === x1) {
        for (let y = yStart; y < yEnd; ++y) {
            points.push([x0, y]);
        }
    } else {
        let k = (y0 - y1) / (x0 - x1);
        let b = y0 - k * x0;
        for (let x = xStart; x <= xEnd; ++x) {
            points.push([x, Math.round(k * x + b)])
        }
    }
    return points;
}

function drawBresenhamLine(x0, y0, x1, y1) {
    let points = [];

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    points.push([x0, y0]);
    while (x0 !== x1 || y0 !== y1) {
        let e2 = 2 * err;
        if (e2 > -dy) {
            if (x0 === x1) break;
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            if (y0 === y1) break;
            err += dx;
            y0 += sy;
        }
        points.push([x0, y0]);
    }
    return points;
}


function draw(points) {
    ctx_draw.beginPath();
    let quadrant = getQuadrant();
    for (let i = 0; i < points.length; i++) {
        console.log(points[i][0]);
        console.log(points[i][1]);
        ctx_draw.fillRect(
            (points[i][0] + xDelta[quadrant]) * scale,
            (points[i][1] + yDelta[quadrant]) * scale, scale, scale);
    }
}

function getQuadrant() {
    let dx = xEndElem.value - xStartElem.value;
    let dy = yEndElem.value - yStartElem.value;
    if (dx >= 0) {
        if (dy >= 0) return 0;
        else return 3;
    } else {
        if (dy >= 0) return 1;
        else return 2;
    }
}
