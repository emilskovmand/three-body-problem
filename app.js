const randomNumBetweenTwo = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);

}

var GravitationalConstant = 6.673; 

class Body {

    constructor( parameters ) {
        this.name = parameters.name ?? null;
        this.mass = (parameters.mass) ? parameters.mass : 10;
        this.color = (parameters.color) ? parameters.color : "white";
        this.velocity = 0;
        this.position = (parameters.position) ? parameters.position : {x: randomNumBetweenTwo(200, window.innerWidth - 200), y: randomNumBetweenTwo(200, window.innerHeight - 200)};
        this.vector = {x: 0, y: 0};
        this.vectorNormalized = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.radius = (parameters.radius) ? parameters.radius : 5;
        this.ctx = parameters.ctx ?? null;

        parameters.BodyGroup.push(this);
    }

    update(centerOfMass, bodyArray) {
        var bodyGroupExcludeSelf = bodyArray.filter((body) => body.name != this.name);
        var accelerationResult = 0;

        bodyGroupExcludeSelf.forEach((body) => {
            // Distance = Magnitude
            var distance = Math.sqrt(Math.pow(body.position.x - this.position.x, 2) + Math.pow(body.position.y - this.position.y, 2));

            accelerationResult += GravitationalConstant * this.mass * (body.position.x - this.position.x) / Math.pow(distance, 3);
            accelerationResult += GravitationalConstant * this.mass * (body.position.y - this.position.y) / Math.pow(distance, 3);
        });

        // Vector to Center of Mass
        this.vector = {x: centerOfMass.x - this.position.x, y: centerOfMass.y - this.position.y};

        // Vector to Center of Mass normalized
        this.vectorNormalized = {x: this.vector.x / Math.sqrt(Math.abs(this.vector.x) + Math.abs(this.vector.y)), y: this.vector.y / Math.sqrt(Math.abs(this.vector.x) + Math.abs(this.vector.y))};
        console.log(this.vectorNormalized);
        console.log(Math.sqrt(Math.abs(this.vector.x) + Math.abs(this.vector.y)))
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = 'transparent';
        this.ctx.stroke();
    }

    refresh(currentWindow) {

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
    mass: 1200,
    color: "orange"
});

var Earth = new Body({
    BodyGroup: bodyMasses,
    ctx: ctx,
    mass: 1000,
    name: "Earth",
    color: "green"
});

function CurrentCenterOfMass() {
    // massCenter = Center of mass
    // Mass of center equation in a loop = X_cm = m_1*x_1+m_2*x_2/m_1+m_2
    var massCenterXCounting = 0, massCenterYCounting = 0, massCenterDenom = 0;

    for (let i = 0; i < bodyMasses.length; i++) {
        var mass = bodyMasses[i].mass;
        var x = bodyMasses[i].position.x;
        var y = bodyMasses[i].position.y;
        massCenterXCounting += mass * x;
        massCenterYCounting += mass * y;
        massCenterDenom += mass;
    }

    var massCenterX = massCenterXCounting/massCenterDenom;
    var massCenterY = massCenterYCounting/massCenterDenom;
    return {x: massCenterX, y: massCenterY}
}


function animate() {
    // window.requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    const cm = CurrentCenterOfMass();

    bodyMasses.forEach((body) => {
        body.update(cm, bodyMasses);
        body.draw();
    })
}

animate();

window.onresize = () => {
    updateBG();
}

console.log(bodyMasses);