Bullet = function(game, x, y, img, speed, dir){
    Phaser.Sprite.call(this, game, x, y, img);
    this.x = this.x;
    this.y = this.y;
    this.img = img;
    this.speed = speed;
    this.dir = dir;
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    if(this.dir == 'left'){
        this.body.velocity.x = -this.speed;
    } else {
        this.body.velocity.x = this.speed;
    }
}
