let ball_IM = new Image();
ball_IM.src = "images/ball/1.png";

class ball {
    constructor(game) {
        this.game = game;
        this.sizeBall = sizeFloor / 23;
        this.dx = 0;
        this.dy = 0;
        this.x = X + sizeFloor / 2;
        this.y = Y + sizeFloor / 2;
    }

    update() {
        let xNext = this.x + this.dx;
        let yNext = this.y + this.dy;
        this.t = 0.8;
        if (yNext - this.sizeBall / 2 < Y) {
            this.dy *= -this.t;
        }
        if (yNext + this.sizeBall / 2 > Y + H) {
            this.dy *= -this.t;
        }
        if (xNext - this.sizeBall / 2 < X) {
            this.dx *= -this.t;
        }
        if (xNext + this.sizeBall / 2 > X + W) {
            this.dx *= -this.t;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.dx *= 0.98;
        this.dy *= 0.98;
        // if (Math.abs(this.dx) < 0.1)
        //     this.dx = 0;
        // if (Math.abs(this.dy) < 0.1)
        //     this.dy = 0;
    }

    draw() {
        this.game.context.drawImage(ball_IM, this.x - this.sizeBall / 2, this.y - this.sizeBall / 2, this.sizeBall, this.sizeBall);
    }

    reduction(x, t) {
        if (Math.abs(x) < Math.abs(t))
            return 0;
        let k = x / Math.abs(x);
        k = k * (Math.abs(x) - Math.abs(t));
        return k;
    }
}