let pool_IM = new Image();
pool_IM.src = "images/pool.png";
let rs_IM = new Image();
rs_IM.src = "images/rs.png";

class pool {
    constructor(game, ball, x, y) {
        this.game = game;
        this.ball = ball;
        this.W = sizeFloor / 30;
        this.H = this.W * 25;
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

        let t = 100;
        let al = Math.PI * (270 + this.angle) / 180;
        let XX = Math.cos(al) * t;
        let YY = Math.sin(al) * t;
        let R = this.ball.sizeBall / 2;

        while (true) {
            XX = Math.cos(al) * t + this.x;
            YY = Math.sin(al) * t + this.y;
            if (XX - R < X || XX + R > X + W || YY - R < Y || YY + R > Y + H) {
                t -= this.ball.sizeBall / 2;
                XX = Math.cos(al) * t + this.x;
                YY = Math.sin(al) * t + this.y;
                break;
            }
            t += 0.01;
        }

        this.game.context.beginPath();
        this.game.context.strokeStyle = "#36F9FF";
        this.game.context.lineWidth = 3;
        this.game.context.moveTo(this.x + Math.cos(al) * this.ball.sizeBall / 2, this.y + Math.sin(al) * this.ball.sizeBall / 2);
        this.game.context.lineTo(XX, YY);
        this.game.context.stroke();

        t += this.ball.sizeBall / 2;
        XX = Math.cos(al) * t + this.x;
        YY = Math.sin(al) * t + this.y;
        this.game.context.drawImage(rs_IM, XX - this.ball.sizeBall / 2, YY - this.ball.sizeBall / 2, this.ball.sizeBall, this.ball.sizeBall);
    }

    toRadian(angle) {
        return (angle / 180) * Math.PI;
    }
}