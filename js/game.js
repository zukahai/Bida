game_W = 0, game_H = 0;

let bg = new Image();
bg.src = "images/bg.png";
let fl = new Image();
fl.src = "images/floor.jpg";
sizeFloor = 0;
xFl = yFl = 0;
X = Y = W = H = 0
rtt = false;
dx = dy = 0;
run = true;

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.render();
        this.ball = new ball(this);
        this.pool = new pool(this, this.ball.x, this.ball.y);
        this.loop();
        this.listenMouse();
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        this.ball.update();
        if (Math.abs(this.ball.dx) + Math.abs(this.ball.dy) < 0.1) {
            this.pool.visible = true;
            this.pool.x = this.ball.x;
            this.pool.y = this.ball.y;
            run = true;
        } else {
            run = false;
        }
    }

    draw() {
        this.clearScreen();
        this.context.drawImage(bg, 0, 0, game_W, game_H);
        this.context.drawImage(fl, xFl, yFl, 2 * sizeFloor, sizeFloor);
        this.ball.draw();
        this.pool.draw();
        // this.context.fillRect(this.ball.x, this.ball.y, W, H);
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
    }

    rotatePool(x, y) {
        this.pool.x = this.ball.x;
        this.pool.y = this.ball.y;
        let X = this.ball.x - x;
        let Y = this.ball.y - y;
        dx = X;
        dy = Y;
        let H = Math.sqrt(X * X + Y * Y);
        let angle = Math.asin(X / H);
        angle = 180 * angle / Math.PI;
        if (Y > 0)
            angle = 180 - angle;
        // console.log(Math.floor(angle));
        this.pool.angle = angle;
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (!run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            rtt = true;
            this.rotatePool(x, y);
        })

        document.addEventListener("mousemove", evt => {
            if (!run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (rtt)
                this.rotatePool(x, y);

        })

        document.addEventListener("mouseup", evt => {
            if (!run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            rtt = false;
            this.ball.dx = dx;
            this.ball.dy = dy;
            this.pool.visible = false;
        })
    }

    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            sizeFloor = 2 * game_H / 3;
            xFl = (game_W - 2 * sizeFloor) / 2;
            yFl = (game_H - sizeFloor) / 2;

            X = xFl + sizeFloor / 8.5;
            Y = yFl + sizeFloor / 9;
            W = 1.77 * sizeFloor;
            H = 0.8 * sizeFloor;
        }
    }
}

var g = new game();