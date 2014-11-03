Bullet = function(game, x, y, img, speed, player){
    Phaser.Sprite.call(this, game, x, y, img);
    this.x = player.x;
    this.y = player.y;
    this.img = img;
    this.speed = speed;
    this.dir = player.dir;
}

Bullet.prototype.object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    if(this.dir = 'left'){
        this.body.velocity = -this.speed;
    } else {
        this.body.velocity = this.speed;
    }
}
