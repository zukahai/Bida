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
Cangle = false;
dx = 100;
dy = 0;
run = false;
power = 0;
Nball = 11;
B = []
pit = [];
let start = 0;
Xangle = Yangle = start_temp = angle_temp = 0;
Nstep = 10000;

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
        B[0] = new ball(this, 1, game_W / 2 - W / 3, game_H / 2);
        for (let i = 1; i < Nball; i++)
            B[i] = new ball(this, Math.floor(Math.random() * 5 + 2), X + Math.random() * (W - 2 * B[0].sizeBall) + B[0].sizeBall, Y + Math.random() * (H - 2 * B[0].sizeBall) + B[0].sizeBall);
        this.pool = new pool(this, B[0], B[0].x, B[0].y);
        this.setXyTriangle();
        this.initPit();
        this.loop();
        this.listenMouse();
    }

    setXyTriangle() {
        let ddd = B[0].sizeBall * 1.1;
        let xM = game_W / 2 + W / 4;
        let yM = game_H / 2;
        let M = 1;
        let count = 0;
        let Yt = 0;
        for (let i = 1; i < Nball; i++) {
            B[i].x = xM;
            B[i].y = yM + Yt;
            count++;
            Yt += ddd;
            if (count == M) {
                count = 0;
                M++;
                Yt = 0;
                xM += ddd;
                yM -= ddd / 2;
            }
        }

    }

    initPit() {
        pit[0] = { x: X - B[0].sizeBall / 2, y: Y - B[0].sizeBall / 2 };
        pit[1] = { x: X + W + B[0].sizeBall / 2, y: Y - B[0].sizeBall / 2 };
        pit[2] = { x: X + W + B[0].sizeBall / 2, y: Y + H + B[0].sizeBall / 2 };
        pit[3] = { x: X - B[0].sizeBall / 2, y: Y + H + B[0].sizeBall / 2 };
        pit[4] = { x: (pit[0].x + pit[1].x) / 2, y: (pit[0].y + pit[1].y) / 2 };
        pit[5] = { x: (pit[2].x + pit[3].x) / 2, y: (pit[2].y + pit[3].y) / 2 };
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        for (let i = 0; i < Nstep; i++)
            this.updateStep();

        for (let i = 0; i < Nball; i++)
            for (let j = 0; j < 6; j++) {
                let d = 1.5 * B[0].sizeBall;
                if (j <= 3)
                    d = 2.5 * B[0].sizeBall;
                if (this.distance(B[i], pit[j]) < d) {
                    if (i != 0) {
                        B[i].dx = B[i].dy = 0;
                        B[i].x = pit[j].x;
                        B[i].y = pit[j].y;
                        B[i].checkVisible = false;
                    } else {
                        B[0].x = game_W / 2;
                        B[0].y = game_H / 2;
                        B[0].dx = B[0].dy = 0;
                    }
                }
            }
    }

    updateStep() {
        for (let i = 0; i < Nball - 1; i++)
            for (let j = i + 1; j < Nball; j++) {
                if (this.distance(B[i], B[j]) <= B[i].sizeBall && Math.abs(B[i].dx) + Math.abs(B[i].dy) + Math.abs(B[j].dx) + Math.abs(B[j].dy) > 0) {
                    let ans = this.collision(B[i].x, B[i].y, B[i].dx, B[i].dy, B[j].x, B[j].y, B[j].dx, B[j].dy)
                    B[i].dx = ans.dx;
                    B[i].dy = ans.dy;
                    B[j].dx = ans.dx2;
                    B[j].dy = ans.dy2;
                    while (this.distance(B[i], B[j]) <= B[i].sizeBall && Math.abs(B[i].dx) + Math.abs(B[i].dy) + Math.abs(B[j].dx) + Math.abs(B[j].dy) > 0) {
                        // console.log('aa');
                        // B[i].x += B[i].dx;
                        // B[i].y += B[i].dy;
                        B[i].update();
                        B[j].update();
                    }
                    // console.log("Collision");
                }
            }
        for (let i = 0; i < Nball; i++)
            B[i].update();
        let check = true;
        for (let i = 0; i < Nball; i++)
            if (Math.abs(B[i].dx) + Math.abs(B[i].dy) > 0.1)
                check = false;
        if (check) {
            this.pool.visible = true;
            this.pool.x = B[0].x;
            this.pool.y = B[0].y;
            run = false;
            if (!pw)
                power = 0;
            for (let i = 0; i < Nball; i++)
                B[i].visible = B[i].checkVisible;
            // if (!Cangle)
            //     start = 0;
        } else {
            run = true;
        }

        for (let i = 0; i < Nball; i++)
            if (Math.abs(B[i].dx) + Math.abs(B[i].dy) < 0.1) {
                B[i].dx = B[i].dy = 0;
            }
    }

    draw() {
        this.clearScreen();
        this.drawBall();
        this.pool.draw();
        this.drawPower();
        this.drawAngle();
    }

    drawBall() {
        for (let i = 0; i < Nball; i++)
            B[i].draw();
    }

    drawAngle() {
        this.context.fillStyle = "#36F9FF";
        this.context.fillRect(X - 9 * B[0].sizeBall, Y, 2 * B[0].sizeBall, H);
        this.context.fillStyle = "#000000";
        this.context.fillRect(X - 9 * B[0].sizeBall + 5, Y + 5, 2 * B[0].sizeBall - 10, (H - 10));
        for (let i = start; i <= 100; i += 10)
            this.drawLine(X - 9 * B[0].sizeBall, Y + (i / 100) * H, X - 9 * B[0].sizeBall + 2 * B[0].sizeBall, Y + (i / 100) * H);
    }

    drawPower() {
        this.context.fillStyle = "#36F9FF";
        this.context.fillRect(X + W + 7 * B[0].sizeBall, Y, 2 * B[0].sizeBall, H);
        this.context.fillStyle = "#000000";
        this.context.fillRect(X + W + 7 * B[0].sizeBall + 5, Y + 5, 2 * B[0].sizeBall - 10, (H - 10));
        this.context.fillStyle = "red";
        this.context.fillRect(X + W + 7 * B[0].sizeBall + 5, Y + 5, 2 * B[0].sizeBall - 10, (power / 100) * (H - 10));
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
            power = Math.floor(100 * (y - Y) / H);
        } else if (y < Y) {
            power = 0;
        } else
            power = 100;
    }

    Angle(x, y) {
        this.pool.angle = angle_temp + 2 * (y - Yangle) / H;
        let k = 100 * (y - Yangle) / H;
        // console.log(k);
        start = start_temp + k;
        while (start < 0)
            start += 10;
        while (start > 10)
            start -= 10;
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (run)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

            let k = Math.abs(x - B[0].x);
            let h = Math.abs(y - B[0].y);
            if (x > X + W + B[0].sizeBall * 7) {
                pw = true;
                this.powerPool(x, y);
            } else if (x < X - B[0].sizeBall * 7) {
                Cangle = true;
                Xangle = x;
                Yangle = y;
                start_temp = start;
                angle_temp = this.pool.angle;
            } else {
                rtt = true;
                this.rotatePool(x, y);
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
            if (Cangle)
                this.Angle(x, y);
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
            if (Cangle) {
                Cangle = false;
            }
        })
    }

    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            sizeFloor = 2 * game_W / 6;
            xFl = (game_W - 2 * sizeFloor) / 2;
            yFl = (game_H - sizeFloor) / 2;

            X = xFl + sizeFloor / 8.5;
            Y = yFl + sizeFloor / 9;
            W = 1.77 * sizeFloor;
            H = 0.8 * sizeFloor;
        }
    }

    collision(x1, y1, dx1, dy1, x2, y2, dx2, dy2) {
        let vx = x1 - x2;
        let vy = y1 - y2;
        let ans = this.hc(x1, y1, -vy, vx, x1 + dx1, y1 + dy1);
        let ans2 = this.hc(x1, y1, vx, vy, x1 + dx1, y1 + dy1);
        let ans3 = this.hc(x2, y2, -vy, vx, x2 + dx2, y2 + dy2);
        let ans4 = this.hc(x2, y2, vx, vy, x2 + dx2, y2 + dy2);

        let h1 = 0,
            h2 = 0,
            h3 = 0,
            h4 = 0;
        if (Math.sqrt(ans2.x * ans2.x + ans2.y + ans2.y) > Math.sqrt(ans4.x * ans4.x + ans4.y + ans4.y)) {
            h3 = ans2.x + ans4.x;
            h4 = ans2.y + ans4.y;
        } else {
            h1 = ans2.x + ans4.x;
            h2 = ans2.y + ans4.y;
        }

        ans.x += h1;
        ans.y += h2;
        ans3.x += h3;
        ans3.y += h4;
        return { dx: ans.x, dy: ans.y, dx2: ans3.x, dy2: ans3.y };
    }

    hc(x0, y0, vx, vy, x, y) {
        let t = ((x - x0) * vx + (y - y0) * vy) / (vx * vx + vy * vy)
        return { x: vx * t, y: vy * t };
    }

    distance(a, b) {
        let x = a.x - b.x;
        let y = a.y - b.y;
        return Math.sqrt(x * x + y * y);
    }

    drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.strokeStyle = "#36F9FF";
        this.context.lineWidth = 3;
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
}

var g = new game();