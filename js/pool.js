let pool_IM = new Image();
pool_IM.src = "images/pool.png";

class pool {
    constructor(game, x, y) {
        this.game = game;
        this.W = sizeFloor / 30;
        this.H = this.W * 25;
        this.x = x;
        this.y = y;
        this.angle = 0;
    }

    draw() {
        this.game.context.save();
        this.game.context.translate(this.x, this.y);
        this.game.context.rotate(this.toRadian(this.angle));
        this.game.context.drawImage(pool_IM, -this.W / 2, this.W * 1.5, this.W, this.H);

        this.game.context.beginPath();
        this.game.context.strokeStyle = "#FFFFFF";
        this.game.context.lineWidth = 3;
        this.game.context.moveTo(0, -1000);
        this.game.context.lineTo(0, -this.W);
        this.game.context.stroke();

        this.game.context.restore();
    }

    toRadian(angle) {
        return (angle / 180) * Math.PI;
    }
}