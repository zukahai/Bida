game_W = 0, game_H = 0;

let bg = new Image();
bg.src = "images/bg.png";
let fl = new Image();
fl.src = "images/floor.jpg";
sizeFloor = 0;
xFl = yFl = 0;
X = Y = W = H = 0
rtt = false;
pw = false;
dx = 100;
dy = 0;
run = false;
power = 0;
Nball = 4;
B = []

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
        B = [];
        B[0] = new ball(this, 1, game_W / 2, game_H / 2);
        for (let i = 1; i < Nball; i++)
            B[i] = new ball(this, 4, X + Math.random() * W, Y + Math.random() * H);
        this.pool = new pool(this, B[0], B[0].x, B[0].y);
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
        B[0].update();
        if (Math.abs(B[0].dx) + Math.abs(B[0].dy) < 0.1) {
            this.pool.visible = true;
            this.pool.x = B[0].x;
            this.pool.y = B[0].y;
            run = false;
            if (!pw)
                power = 0;
        } else {
            run = true;
        }
    }

    draw() {
        this.clearScreen();
        this.drawBall();
        this.pool.draw();
        this.drawPower();
    }

    drawBall() {
        for (let i = 0; i < Nball; i++)
            B[i].draw();
    }

    drawPower() {
        this.context.fillStyle = "#36F9FF";
        this.context.fillRect(X - 7 * B[0].sizeBall, Y, 2 * B[0].sizeBall, H);
        this.context.fillStyle = "red";
        this.context.fillRect(X - 7 * B[0].sizeBall + 5, Y + 5, 2 * B[0].sizeBall - 10, (power / 100) * (H - 10));
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.drawImage(bg, 0, 0, game_W, game_H);
        this.context.drawImage(fl, xFl, yFl, 2 * sizeFloor, sizeFloor);
        // this.context.fillRect(X, Y, W, H);
    }

    rotatePool(x, y) {
        this.pool.x = B[0].x;
        this.pool.y = B[0].y;
        let X = B[0].x - x;
        let Y = B[0].y - y;
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

    powerPool(x, y) {
        if (y >= Y && y <= Y + H) {
            power = 100 * (y - Y) / H;
        }
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

            let k = Math.abs(x - B[0].x);
            let h = Math.abs(y - B[0].y);
            if (x > X - B[0].sizeBall * 4) {
                rtt = true;
                this.rotatePool(x, y);
            } else {
                pw = true;
                this.powerPool(x, y);
            }
        })

        document.addEventListener("mousemove", evt => {
            if (run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (rtt)
                this.rotatePool(x, y);
            if (pw)
                this.powerPool(x, y);
        })

        document.addEventListener("mouseup", evt => {
            if (run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (rtt) {
                rtt = false;
            }
            if (pw) {
                pw = false;
                let H = Math.sqrt(dx * dx + dy * dy);
                dx = power * dx / H;
                dy = power * dy / H;
                B[0].dx = dx;
                B[0].dy = dy;
                this.pool.visible = false;
            }
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