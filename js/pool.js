let pool_IM = new Image();
pool_IM.src = "images/pool.png";
let rs_IM = new Image();
rs_IM.src = "images/rs.png";

class pool {
    constructor(game, ball, x, y) {
        this.game = game;
        this.ball = ball;
        this.W = sizeFloor / 30;
        this.H = this.W * 35;
        this.x = x;
        this.y = y;
        this.angle = 90;
        this.visible = true;
    }

    draw() {
        if (!this.visible)
            return;
        this.game.context.save();
        this.game.context.translate(this.x, this.y);
        this.game.context.rotate(this.toRadian(this.angle));
        this.game.context.drawImage(pool_IM, -this.W / 2, this.W * 1.5 + power, this.W, this.H);
        this.game.context.restore();

        let t = 0;
        let al = Math.PI * (270 + this.angle) / 180;
        let XX = Math.cos(al) * t;
        let YY = Math.sin(al) * t;

        while (true) {
            XX = Math.cos(al) * t + this.x;
            YY = Math.sin(al) * t + this.y;
            if (this.check(XX, YY, al)) {
                // t -= this.ball.sizeBall / 2;
                XX = Math.cos(al) * t + this.x;
                YY = Math.sin(al) * t + this.y;
                break;
            }
            t += 0.01;
        }

        this.drawLine(this.x + Math.cos(al) * this.ball.sizeBall / 2, this.y + Math.sin(al) * this.ball.sizeBall / 2, XX, YY)

        // t += this.ball.sizeBall / 2;
        XX = Math.cos(al) * t + this.x;
        YY = Math.sin(al) * t + this.y;
        this.game.context.drawImage(rs_IM, XX - this.ball.sizeBall / 2, YY - this.ball.sizeBall / 2, this.ball.sizeBall, this.ball.sizeBall);
    }

    drawLine(x1, y1, x2, y2) {
        this.game.context.beginPath();
        this.game.context.strokeStyle = "#36F9FF";
        this.game.context.lineWidth = 3;
        this.game.context.moveTo(x1, y1);
        this.game.context.lineTo(x2, y2);
        this.game.context.stroke();
    }

    toRadian(angle) {
        return (angle / 180) * Math.PI;
    }

    check(XX, YY, al) {
        let R = this.ball.sizeBall / 2;
        if (XX - R < X || XX + R > X + W || YY - R < Y || YY + R > Y + H)
            return true;
        for (let i = 1; i < Nball; i++) {
            let X = XX - B[i].x;
            let Y = YY - B[i].y;
            if (Math.sqrt(X * X + Y * Y) <= this.ball.sizeBall) {
                // this.drawLine(XX, YY, B[i].x + 2.0 * vx, B[i].y + 2.0 * vy);
                let t = 2.5 * this.ball.sizeBall;
                // this.drawLine(XX, YY, XX + Math.cos(al) * t, YY + Math.sin(al) * t);

                let x0 = XX;
                let y0 = YY;
                let vx = B[i].x - XX;
                let vy = B[i].y - YY;
                let x = XX + Math.cos(al) * t;
                let y = YY + Math.sin(al) * t;
                let ans = this.hc(x0, y0, vx, vy, x, y);

                vx = ans.x - XX;
                vy = ans.y - YY;
                let vh = Math.sqrt(vx * vx + vy * vy);
                let dx = (vx / vh) * this.ball.sizeBall;
                let dy = (vy / vh) * this.ball.sizeBall;
                this.drawLine(dx + XX, dy + YY, dx + ans.x, dy + ans.y);

                let temp = vx;
                vx = -vy;
                vy = temp;
                ans = this.hc(x0, y0, vx, vy, x, y);
                this.drawLine(XX, YY, ans.x, ans.y);

                return true;
            }
        }
        return false;
    }

    cos2Vector(x1, y1, x2, y2) {
        x1 = Math.abs(x1);
        x2 = Math.abs(x2);
        y1 = Math.abs(y1);
        y2 = Math.abs(y2);
        return (x1 * x2 + y1 * y2) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2));
    }

    hc(x0, y0, vx, vy, x, y) {
        let t = ((x - x0) * vx + (y - y0) * vy) / (vx * vx + vy * vy)
        return { x: x0 + vx * t, y: y0 + vy * t };
    }
}