Bullet = function(game, x, y, img, speed, dir){
    Phaser.Sprite.call(this, game, x, y, img);
    this.x = this.x;
    this.y = this.y;
    this.img = img;
    this.speed = speed;
    this.dir = dir;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    //add the bullet to the physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the bullets no gravity
    this.body.gravity.y = -600;

}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){

    //move the bullet in the direction the object is facing
    if(this.dir == 'left'){
        this.body.velocity.x = -this.speed;
    } else if(this.dir == 'right'){
        this.body.velocity.x = this.speed;
    }
}

Bullet.prototype.playerFire = function(){
    this.game.physics.arcade.moveToPointer(this, 300);
}


