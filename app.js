const randomNumBetweenTwo = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);

}

var GravitationalConstant = 6.673e-11; 

class Body {

    constructor( parameters ) {
        this.name = parameters.name ?? null;
        this.mass = (parameters.mass) ? parameters.mass : 10;
        this.color = (parameters.color) ? parameters.color : "white";
        this.velocity = 0;
        this.position = (parameters.position) ? parameters.position : {x: randomNumBetweenTwo(200, window.innerWidth - 200), y: randomNumBetweenTwo(200, window.innerHeight - 200)};
        this.vector = {x: 0, y: 0};
        this.vectorNormal = {x: 0, y: 0};
        this.velocity = 0.01;
        this.radius = (parameters.radius) ? parameters.radius : 5;
        this.ctx = parameters.ctx ?? null;

        parameters.BodyGroup.push(this);
    }

    update(centerOfMass) {
        
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
    ctx: ctx
});
var Earth = new Body({
    BodyGroup: bodyMasses,
    ctx: ctx
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
        body.update(cm);
        body.draw();
    })
}

animate();

window.onresize = () => {
    updateBG();
}

console.log(bodyMasses);