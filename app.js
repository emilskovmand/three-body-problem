const randomNumBetweenTwo = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);

}

var GravitationalConstant = 6.673;

class Body {

    constructor(parameters) {
        this.name = parameters.name ?? null;
        this.mass = (parameters.mass) ? parameters.mass : 10;
        this.color = (parameters.color) ? parameters.color : "white";
        this.velocity = 0;
        this.position = (parameters.position) ? parameters.position : { x: randomNumBetweenTwo(300, window.innerWidth - 300), y: randomNumBetweenTwo(300, window.innerHeight - 300) };
        this.vector = { x: 0, y: 0 };
        this.vectorNormalized = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.radius = (parameters.radius) ? parameters.radius : 5;
        this.ctx = parameters.ctx ?? null;
        this.lastPosition = null;
        this.element = parameters.element ?? null;
        this.rotation = 0;
        this.initialPosition = { x: this.position.x, y: this.position.y};

        this.element.style.height = this.radius + "px"
        this.element.style.width = this.radius + "px"
        this.element.style.transform = "translate(" + this.position.x + "px," + this.position.y + "px)";

        parameters.BodyGroup.push(this);
    }

    update(bodyArray) {
        var bodyGroupExcludeSelf = bodyArray.filter((body) => body.name != this.name);
        var accelerationResult = 0;
        var centerOfMass = CurrentCenterOfMass(this.name);
        this.rotation += 0.5;

        if (this.lastPosition) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastPosition.x + (this.radius / 2), this.lastPosition.y + (this.radius / 2));
            this.ctx.lineTo(this.position.x + (this.radius / 2), this.position.y + (this.radius / 2));
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        bodyGroupExcludeSelf.forEach((body) => {

            var distance = Math.sqrt(Math.pow(body.position.x - this.position.x, 2) + Math.pow(body.position.y - this.position.y, 2));

            if (distance > 10) {
                accelerationResult += GravitationalConstant * body.mass * (body.position.x - this.position.x) / Math.pow(distance, 3);
                accelerationResult += GravitationalConstant * body.mass * (body.position.y - this.position.y) / Math.pow(distance, 3);
            }
        });

        // Vector to Center of Mass
        this.vector = { x: centerOfMass.x - this.position.x, y: centerOfMass.y - this.position.y };

        // Vector to Center of Mass normalized
        var magnitude = Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y);

        if (magnitude > 10) {
            this.vectorNormalized = {
                x: this.vector.x / magnitude,
                y: this.vector.y / magnitude
            };
        }

        this.velocity.x += Math.abs(accelerationResult) * this.vectorNormalized.x;
        this.velocity.y += Math.abs(accelerationResult) * this.vectorNormalized.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    draw() {
        // Body Texture
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, .5, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = 'transparent';
        this.ctx.stroke();

        var xDerivedImg = this.position.x - (this.radius / 2);
        var yDerivedImg = this.position.y - (this.radius / 2);

        this.element.style.transform = "translate(" + xDerivedImg + "px," + yDerivedImg + "px) rotate(" + this.rotation + "deg)";
    }

    drawLines() {
        if (this.savedPosition.length > 3) return;
        this.ctx.beginPath();
        for (let i = 0; i < this.savedPosition.length; i++) {
            this.ctx.moveTo(this.savedPosition[i].x, this.savedPosition[i].y);
            this.ctx.lineTo(this.savedPosition[1 + i].x, this.savedPosition[1 + i].y);
        }
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    refresh(currentWindow) {
        this.position = { x: randomNumBetweenTwo(200, window.innerWidth - 200), y: randomNumBetweenTwo(200, window.innerHeight - 200) };
        this.vector = { x: 0, y: 0 };
        this.vectorNormalized = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastPosition = null;
        this.initialPosition = { x: this.position.x, y: this.position.y};
    }

    restart() {
        this.position = { x: this.initialPosition.x, y: this.initialPosition.y };
        this.vector = { x: 0, y: 0 };
        this.vectorNormalized = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastPosition = null;
    }
}

var bodyMasses = [];

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function updateBG() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var Sun = new Body({
    BodyGroup: bodyMasses,
    ctx: ctx,
    name: "Sun",
    mass: 100,
    color: "orange",
    radius: 30,
    element: document.querySelector('#Sun')
});

var Earth = new Body({
    BodyGroup: bodyMasses,
    ctx: ctx,
    mass: 80,
    name: "Earth",
    color: "green",
    radius: 20,
    element: document.querySelector('#Earth')
});

var Mars = new Body({
    BodyGroup: bodyMasses,
    ctx: ctx,
    mass: 80,
    name: "Mars",
    color: "red",
    radius: 13,
    element: document.querySelector('#Mars')
})

function CurrentCenterOfMass(name) {
    // massCenter = Center of mass
    // Mass of center equation in a loop = X_cm = m_1*x_1+m_2*x_2/m_1+m_2
    var massCenterXCounting = 0, massCenterYCounting = 0, massCenterDenom = 0;

    for (let i = 0; i < bodyMasses.length; i++) {
        if (name === bodyMasses[i].name) continue;
        var mass = bodyMasses[i].mass;
        var x = bodyMasses[i].position.x;
        var y = bodyMasses[i].position.y;
        massCenterXCounting += mass * x;
        massCenterYCounting += mass * y;
        massCenterDenom += mass;
    }

    var massCenterX = massCenterXCounting / massCenterDenom;
    var massCenterY = massCenterYCounting / massCenterDenom;
    return { x: massCenterX, y: massCenterY }
}


function animate() {

    bodyMasses.forEach((body) => {
        body.update(bodyMasses);
        body.draw();
    })

    OverlayDisplay();
}

var steps = 300;
var stepsTaken = 0;

function OverlayDisplay() {
    document.getElementById("stepsTaken").innerText = `${stepsTaken} / ${steps}`;
}

function Refresh() {
    bodyMasses.forEach((body) => {
        body.refresh();
    })
    stepsTaken = 0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
}

function Restart() {
    bodyMasses.forEach((body) => {
        body.restart();
    });
    stepsTaken = 0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
}

document.getElementById("refresh").addEventListener("click", Refresh);

document.getElementById("restart").addEventListener("click", Restart);

document.getElementById("stepsAmount").addEventListener("change", (e) => {
    steps = e.target.value * 1;
    OverlayDisplay();
})

var animateCanvas = setInterval(() => {
    if (steps >= stepsTaken) {
        animate();
        stepsTaken++;
    }
}, 1000 / 60);

window.onresize = () => {
    updateBG();
}