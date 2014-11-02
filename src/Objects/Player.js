/*
Player = function(game, x, y, img, speed, maxSpeed, acceleration){
    Phaser.Sprite.call(this, game, x, y, img);
    this.playerImg = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.v = 0;
}*/

Player = function(game, x, y, img, speed, jumpHeight){
    Phaser.Sprite.call(this, game, x, y, img);
    this.playerImg = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.jumpHeight = jumpHeight;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
/*
   if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
       this.v -= this.acceleration;
   } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
       this.v += this.acceleration;
   } else {
       if(this.v >= -this.maxSpeed && this.v < 0)
        this.v += this.acceleration;
       else if(this.v <= this.maxSpeed && this. v > 0)
        this.v -= this.acceleration;
   }
   if(this.v >= this.maxSpeed){
       this.v = this.maxSpeed;
   } else if(this.v <= -this.maxSpeed){
       this.v = -this.maxSpeed;
   }
   this.x += this.speed*this.v;
*/
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
        this.body.velocity.x = -this.speed;
    } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
        this.body.velocity.x = this.speed;
    } else {
        this.body.velocity.x = 0;
    }

    if(this.body.velocity.y > 1000){
        this.body.velocity.y = 1000;
    }

}