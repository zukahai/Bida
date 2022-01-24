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
dx = dy = 0;
run = false;
power = 0;

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
        this.pool = new pool(this, this.ball, this.ball.x, this.ball.y);
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
            run = false;
            if (!pw)
                power = 0;
        } else {
            run = true;
        }
    }

    draw() {
        this.clearScreen();
        this.ball.draw();
        this.pool.draw();
        this.drawPower();
    }

    drawPower() {
        this.context.fillStyle = "#36F9FF";
        this.context.fillRect(X - 4 * this.ball.sizeBall, Y, this.ball.sizeBall, H);
        this.context.fillStyle = "red";
        this.context.fillRect(X - 4 * this.ball.sizeBall + 5, Y + 5, this.ball.sizeBall - 10, (power / 100) * (H - 10));
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.drawImage(bg, 0, 0, game_W, game_H);
        this.context.drawImage(fl, xFl, yFl, 2 * sizeFloor, sizeFloor);
        // this.context.fillRect(X, Y, W, H);
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

            let k = Math.abs(x - this.ball.x);
            let h = Math.abs(y - this.ball.y);
            if (x > X) {
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
                this.ball.dx = dx;
                this.ball.dy = dy;
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